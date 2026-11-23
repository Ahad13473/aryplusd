/**
 * Download engine: a small in-process job queue that fetches direct
 * media files and HLS streams, with progress tracking, cancelation,
 * ffmpeg remuxing (mpegts -> mp4) and thumbnail generation.
 *
 * State lives on globalThis so it survives Next.js dev hot reloads.
 */
import { spawn, execFile } from "node:child_process";
import { createReadStream, createWriteStream, promises as fsp } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeWebReadableStream } from "node:stream/web";
import { createDecipheriv } from "node:crypto";
import type { Download } from "@prisma/client";
import { db } from "@/lib/db";
import { STORAGE_ROOT } from "@/lib/paths";
import { parsePlaylist, type HlsKey, type HlsSegmentRef } from "./m3u8";
import {
  CanceledError,
  errMessage,
  extFromContentType,
  extFromUrl,
  fetchWithTimeout,
  isCanceledError,
  isVideoExt,
  mergeHeaders,
  readTextCapped,
  sanitizeHeaders,
} from "./util";

export const STORAGE_DIR = STORAGE_ROOT;
export const TMP_DIR = path.join(STORAGE_DIR, "tmp");
export const THUMB_DIR = STORAGE_DIR;

const MAX_CONCURRENT_JOBS = 3;
const HLS_WORKERS = 4;
const FLUSH_INTERVAL_MS = 450;

interface JobRuntime {
  canceled: boolean;
  abort: AbortController | null;
  lastFlush: number;
  samples: { t: number; b: number }[];
  speed: number;
}

interface EngineState {
  queue: string[];
  active: Map<string, JobRuntime>;
  booted: boolean;
  ffmpegOk: boolean | null;
}

const g = globalThis as unknown as { __snapperEngine?: EngineState };

function state(): EngineState {
  if (!g.__snapperEngine) {
    g.__snapperEngine = { queue: [], active: new Map(), booted: false, ffmpegOk: null };
  }
  return g.__snapperEngine;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Initialize storage and re-enqueue jobs interrupted by a restart. */
export async function ensureEngine(): Promise<void> {
  const st = state();
  if (st.booted) return;
  st.booted = true;
  await fsp.mkdir(TMP_DIR, { recursive: true }).catch(() => undefined);
  await fsp.mkdir(STORAGE_DIR, { recursive: true }).catch(() => undefined);
  try {
    const interrupted = await db.download.findMany({
      where: { status: { in: ["queued", "downloading"] } },
      select: { id: true },
    });
    for (const job of interrupted) {
      await db.download
        .update({
          where: { id: job.id },
          data: { status: "queued", speedBps: 0, etaSeconds: null },
        })
        .catch(() => undefined);
      enqueueJob(job.id);
    }
  } catch {
    // database not ready yet - jobs stay queued in DB until next boot
  }
}

export function enqueueJob(id: string): void {
  state().queue.push(id);
  pump();
}

export function cancelJob(id: string): boolean {
  const rt = state().active.get(id);
  if (!rt) return false;
  rt.canceled = true;
  rt.abort?.abort(new CanceledError());
  return true;
}

/**
 * Cancel a queued or running download and delete everything it stored.
 * A running job cleans up itself once its workers have stopped (see runJob),
 * so no late segment write can land after the files were removed.
 */
export async function cancelAndDelete(id: string): Promise<void> {
  const st = state();
  st.queue = st.queue.filter((q) => q !== id);
  if (cancelJob(id)) return;
  await cleanupJobFiles(id);
  await db.download.delete({ where: { id } }).catch(() => undefined);
}

export function isJobActive(id: string): boolean {
  return state().active.has(id);
}

export async function removeJobFiles(id: string): Promise<void> {
  cancelJob(id);
  await cleanupJobFiles(id);
}

export function finalFilePath(id: string, ext: string): string {
  return path.join(STORAGE_DIR, `${id}.${ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin"}`);
}

export function thumbnailPath(id: string): string {
  return path.join(THUMB_DIR, `${id}.jpg`);
}

/* ------------------------------------------------------------------ */
/* Queue plumbing                                                      */
/* ------------------------------------------------------------------ */

function pump(): void {
  const st = state();
  while (st.active.size < MAX_CONCURRENT_JOBS && st.queue.length > 0) {
    const id = st.queue.shift();
    if (!id) break;
    void runJob(id).catch(() => undefined);
  }
}

async function runJob(id: string): Promise<void> {
  const st = state();
  const rt: JobRuntime = { canceled: false, abort: null, lastFlush: 0, samples: [], speed: 0 };
  st.active.set(id, rt);
  try {
    const job = await db.download.findUnique({ where: { id } });
    if (!job || job.status !== "queued") return;
    await flush(id, rt, { status: "downloading", error: null }, true);
    const headers = mergeHeaders(safeParseHeaders(job.headers));
    if (job.kind === "hls") await runHls(job, rt, headers);
    else if (job.kind === "direct") await runDirect(job, rt, headers);
    else throw new Error(`Unknown download kind: ${job.kind}`);
  } catch (err) {
    const canceled = rt.canceled || isCanceledError(err);
    await cleanupJobFiles(id).catch(() => undefined);
    if (canceled) {
      // A canceled download leaves nothing behind: files and record both go.
      await db.download.delete({ where: { id } }).catch(() => undefined);
    } else {
      await flush(
        id,
        rt,
        { status: "failed", error: errMessage(err), speedBps: 0, etaSeconds: null },
        true,
      );
    }
  } finally {
    st.active.delete(id);
    pump();
  }
}

/* ------------------------------------------------------------------ */
/* Direct file downloads                                               */
/* ------------------------------------------------------------------ */

async function runDirect(job: Download, rt: JobRuntime, headers: Record<string, string>): Promise<void> {
  rt.abort = new AbortController();
  const res = await fetchWithTimeout(job.url, { headers, redirect: "follow", signal: rt.abort.signal }, 30000);
  if (!res.ok || !res.body) {
    const hint =
      res.status === 403 || res.status === 401
        ? " - access denied. Try adding Referer/Cookie headers in Advanced options."
        : "";
    throw new Error(`The server responded with HTTP ${res.status}${hint}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const lengthHeader = Number(res.headers.get("content-length"));
  const total = Number.isFinite(lengthHeader) && lengthHeader > 0 ? lengthHeader : job.totalBytes ?? null;
  const ext =
    extFromContentType(contentType) ?? extFromUrl(res.url || job.url) ?? job.container ?? "mp4";

  const partPath = path.join(TMP_DIR, `${job.id}.part`);
  const source = stallGuard(
    Readable.fromWeb(res.body as unknown as NodeWebReadableStream<Uint8Array>),
    BODY_STALL_MS,
    "The download",
  );
  const sink = createWriteStream(partPath);
  let received = 0;

  const guard = setInterval(() => {
    if (rt.canceled) source.destroy(new CanceledError());
  }, 400);

  try {
    source.on("data", (chunk: Buffer) => {
      received += chunk.length;
      recordBytes(rt, received);
      void flush(job.id, rt, {
        downloadedBytes: received,
        totalBytes: total,
        progress: total ? Math.min(99.9, (received / total) * 100) : 0,
        speedBps: rt.speed,
        etaSeconds: etaFor(total ? total - received : null, rt.speed),
      });
    });
    await pipeline(source, sink);
  } finally {
    clearInterval(guard);
  }

  if (rt.canceled) throw new CanceledError();

  const finalPath = finalFilePath(job.id, ext);
  await fsp.rename(partPath, finalPath);
  const stat = await fsp.stat(finalPath);
  const hasThumb = isVideoExt(ext) ? await makeThumbnail(finalPath, job.id) : false;

  await flush(
    job.id,
    rt,
    {
      status: "completed",
      progress: 100,
      downloadedBytes: stat.size,
      totalBytes: stat.size,
      filePath: finalPath,
      container: ext,
      hasThumbnail: hasThumb,
      completedAt: new Date(),
      speedBps: 0,
      etaSeconds: null,
    },
    true,
  );
}

/* ------------------------------------------------------------------ */
/* HLS downloads                                                       */
/* ------------------------------------------------------------------ */

function segFile(index: number): string {
  return `seg-${String(index).padStart(6, "0")}.part`;
}

async function runHls(job: Download, rt: JobRuntime, headers: Record<string, string>): Promise<void> {
  rt.abort = new AbortController();
  const playlistUrl = job.variantUrl || job.url;

  let text = await fetchText(playlistUrl, headers, rt);
  let playlist = parsePlaylist(text, playlistUrl);
  if (playlist.isMaster) {
    const best = playlist.variants[0];
    text = await fetchText(best.url, headers, rt);
    playlist = parsePlaylist(text, best.url);
    if (playlist.isMaster) throw new Error("Nested master playlists are not supported.");
  }

  const segments = playlist.segments;
  const total = segments.length;
  const container = playlist.isFmp4 ? "mp4" : "ts";
  const dir = path.join(TMP_DIR, job.id);
  await fsp.mkdir(dir, { recursive: true });

  await flush(job.id, rt, { status: "downloading", segmentsTotal: total, segmentsDone: 0 }, true);

  const keyCache = new Map<string, Buffer>();
  const shared = { next: 0, done: 0, bytes: 0 };

  const worker = async (): Promise<void> => {
    for (;;) {
      if (rt.canceled) throw new CanceledError();
      const index = shared.next++;
      if (index >= total) return;
      const seg = segments[index];
      const bytes = await downloadSegment(seg, headers, rt, keyCache, path.join(dir, segFile(index)));
      if (rt.canceled) throw new CanceledError();
      shared.done += 1;
      shared.bytes += bytes;
      recordBytes(rt, shared.bytes);
      const estimatedTotal = (shared.bytes / shared.done) * total;
      void flush(job.id, rt, {
        segmentsDone: shared.done,
        downloadedBytes: shared.bytes,
        progress: (shared.done / total) * 100,
        speedBps: rt.speed,
        etaSeconds: etaFor(estimatedTotal - shared.bytes, rt.speed),
      });
    }
  };

  const results = await Promise.allSettled(
    Array.from({ length: Math.min(HLS_WORKERS, total) }, () => worker()),
  );
  let firstError: Error | null = null;
  for (const r of results) {
    if (r.status === "rejected") {
      firstError = r.reason instanceof Error ? r.reason : new Error(String(r.reason));
      break;
    }
  }

  if (rt.canceled) throw new CanceledError();
  if (firstError) throw firstError;

  // init segment (fMP4) - honor its BYTERANGE so we never fetch a whole
  // media file just to get the 700-byte init section
  if (playlist.initSegment) {
    await downloadMediaFile(
      playlist.initSegment,
      headers,
      rt,
      keyCache,
      path.join(dir, "init.part"),
      { key: null, sequence: 0, byterange: playlist.initByterange },
      "init segment",
    );
  }

  // assemble in order
  const assemblePath = path.join(TMP_DIR, `${job.id}.assemble`);
  const out = createWriteStream(assemblePath);
  if (playlist.initSegment) await appendFileTo(out, path.join(dir, "init.part"));
  for (let i = 0; i < total; i++) {
    if (rt.canceled) throw new CanceledError();
    await appendFileTo(out, path.join(dir, segFile(i)));
  }
  await streamEnd(out);

  let finalExt = container;
  let finalPath = finalFilePath(job.id, finalExt);
  await fsp.rename(assemblePath, finalPath);

  // mpegts is not playable in browsers: remux to mp4 with ffmpeg when available
  if (finalExt === "ts" && (await ffmpegAvailable())) {
    const mp4Path = finalFilePath(job.id, "mp4");
    const ok = await remuxToMp4(finalPath, mp4Path);
    if (ok) {
      await fsp.unlink(finalPath).catch(() => undefined);
      finalPath = mp4Path;
      finalExt = "mp4";
    }
  }

  const stat = await fsp.stat(finalPath);
  const hasThumb = await makeThumbnail(finalPath, job.id);
  await fsp.rm(dir, { recursive: true, force: true }).catch(() => undefined);

  await flush(
    job.id,
    rt,
    {
      status: "completed",
      progress: 100,
      downloadedBytes: stat.size,
      totalBytes: stat.size,
      filePath: finalPath,
      container: finalExt,
      hasThumbnail: hasThumb,
      completedAt: new Date(),
      speedBps: 0,
      etaSeconds: null,
      segmentsDone: total,
      segmentsTotal: total,
    },
    true,
  );
}

async function fetchText(url: string, headers: Record<string, string>, rt: JobRuntime): Promise<string> {
  const res = await fetchWithTimeout(url, { headers, signal: rt.abort?.signal, redirect: "follow" }, 20000);
  if (!res.ok) throw new Error(`Could not fetch playlist (HTTP ${res.status}).`);
  // playlists are tiny; cap defensively so a misbehaving server can't balloon memory
  const text = await readTextCapped(res, 4_000_000);
  if (!text) throw new Error("The playlist response was empty.");
  return text;
}

interface MediaFetchOptions {
  key: HlsKey | null;
  sequence: number;
  byterange: { length: number; offset: number } | null;
}

/**
 * Guards a response body against stalls: if no bytes arrive for `ms`
 * (including the case where headers arrived but the body never starts),
 * the source is destroyed with an error so the surrounding retry logic
 * can take over. Without this a server that stops sending but never
 * closes the connection would hang the download forever.
 */
function stallGuard(src: NodeJS.ReadableStream, ms: number, label: string): NodeJS.ReadableStream {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  const arm = () => {
    clear();
    timer = setTimeout(() => {
      src.destroy(new Error(`${label} stalled (no data for ${Math.round(ms / 1000)}s).`));
    }, ms);
  };
  src.on("data", arm);
  src.once("end", clear);
  src.once("error", clear);
  src.once("close", clear);
  arm(); // covers body-never-starts after headers
  return src;
}

const BODY_STALL_MS = 30_000;

/**
 * Streams a media body to disk (never buffering it fully in memory) and
 * returns the number of bytes written. AES-128 segments are decrypted
 * in-flight through a cipher stream.
 */
async function downloadMediaFile(
  url: string,
  headers: Record<string, string>,
  rt: JobRuntime,
  keyCache: Map<string, Buffer>,
  destPath: string,
  opts: MediaFetchOptions,
  label: string,
): Promise<number> {
  const h = { ...headers };
  if (opts.byterange) {
    h["Range"] = `bytes=${opts.byterange.offset}-${opts.byterange.offset + opts.byterange.length - 1}`;
  }
  const res = await fetchWithTimeout(url, { headers: h, signal: rt.abort?.signal, redirect: "follow" }, 30000);
  if (!res.ok && !(opts.byterange && res.status === 206)) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (!res.body) throw new Error(`The ${label} response had no body.`);

  const sink = createWriteStream(destPath);
  const source = stallGuard(
    Readable.fromWeb(res.body as unknown as NodeWebReadableStream<Uint8Array>),
    BODY_STALL_MS,
    `The ${label}`,
  );
  try {
    if (opts.key?.method === "AES-128") {
      const keyBuf = await fetchKey(opts.key, headers, rt, keyCache);
      const iv = ivBuffer(opts.key.iv, opts.sequence);
      const decipher = createDecipheriv("aes-128-cbc", keyBuf, iv);
      await pipeline(source, decipher, sink);
    } else {
      await pipeline(source, sink);
    }
  } catch (err) {
    sink.destroy();
    await fsp.unlink(destPath).catch(() => undefined);
    throw err;
  }
  const stat = await fsp.stat(destPath);
  return stat.size;
}

async function downloadSegment(
  seg: HlsSegmentRef,
  headers: Record<string, string>,
  rt: JobRuntime,
  keyCache: Map<string, Buffer>,
  destPath: string,
): Promise<number> {
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (rt.canceled) throw new CanceledError();
    try {
      return await downloadMediaFile(
        seg.url,
        headers,
        rt,
        keyCache,
        destPath,
        { key: seg.key, sequence: seg.sequence, byterange: seg.byterange },
        "video segment",
      );
    } catch (err) {
      if (rt.canceled || isCanceledError(err)) throw new CanceledError();
      lastErr = err;
      await fsp.unlink(destPath).catch(() => undefined);
      await sleep(600 * attempt);
    }
  }
  throw new Error(`A video segment failed to download after 3 attempts: ${errMessage(lastErr)}`);
}

async function fetchKey(
  key: HlsKey,
  headers: Record<string, string>,
  rt: JobRuntime,
  cache: Map<string, Buffer>,
): Promise<Buffer> {
  const cached = cache.get(key.uri);
  if (cached) return cached;
  const buf = await fetchBinary(key.uri, headers, rt);
  if (buf.length !== 16) {
    throw new Error("Unsupported HLS key size (expected 16 bytes for AES-128).");
  }
  cache.set(key.uri, buf);
  return buf;
}

function ivBuffer(ivHex: string | null, sequence: number): Buffer {
  if (ivHex) {
    const hex = ivHex.startsWith("0x") || ivHex.startsWith("0X") ? ivHex.slice(2) : ivHex;
    const buf = Buffer.from(hex, "hex");
    if (buf.length !== 16) throw new Error("Invalid AES-128 IV length.");
    return buf;
  }
  const buf = Buffer.alloc(16);
  buf.writeBigUInt64BE(BigInt(sequence), 8);
  return buf;
}

/* ------------------------------------------------------------------ */
/* ffmpeg helpers                                                      */
/* ------------------------------------------------------------------ */

function runFfmpeg(args: string[], timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    let stderr = "";
    let settled = false;
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };
    proc.stderr?.on("data", (d: Buffer) => {
      stderr += d.toString();
      if (stderr.length > 4000) stderr = stderr.slice(-4000);
    });
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      done(false);
    }, timeoutMs);
    proc.on("error", () => {
      clearTimeout(timer);
      done(false);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 && stderr) console.error("[ffmpeg]", stderr.slice(-600));
      done(code === 0);
    });
  });
}

export async function ffmpegAvailable(): Promise<boolean> {
  const st = state();
  if (st.ffmpegOk !== null) return st.ffmpegOk;
  st.ffmpegOk = await new Promise<boolean>((resolve) => {
    execFile("ffmpeg", ["-version"], { timeout: 10000 }, (err) => resolve(!err));
  });
  return st.ffmpegOk;
}

async function remuxToMp4(input: string, output: string): Promise<boolean> {
  return runFfmpeg(
    ["-y", "-hide_banner", "-loglevel", "error", "-i", input, "-c", "copy", "-movflags", "+faststart", output],
    180000,
  );
}

async function makeThumbnail(file: string, id: string): Promise<boolean> {
  if (!(await ffmpegAvailable())) return false;
  const out = thumbnailPath(id);
  const ok =
    (await runFfmpeg(["-y", "-ss", "2", "-i", file, "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", out], 45000)) ||
    (await runFfmpeg(["-y", "-ss", "0", "-i", file, "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", out], 45000));
  if (!ok) return false;
  try {
    const stat = await fsp.stat(out);
    return stat.size > 0;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Progress + persistence helpers                                      */
/* ------------------------------------------------------------------ */

function recordBytes(rt: JobRuntime, bytes: number): void {
  const now = Date.now();
  rt.samples.push({ t: now, b: bytes });
  const cutoff = now - 5000;
  while (rt.samples.length > 2 && rt.samples[0].t < cutoff) rt.samples.shift();
  const first = rt.samples[0];
  const last = rt.samples[rt.samples.length - 1];
  const dt = (last.t - first.t) / 1000;
  if (dt >= 1) {
    const instant = Math.max(0, (last.b - first.b) / dt);
    rt.speed = rt.speed ? rt.speed * 0.7 + instant * 0.3 : instant;
  }
}

function etaFor(remainingBytes: number | null, speed: number): number | null {
  if (remainingBytes === null || !Number.isFinite(remainingBytes) || remainingBytes <= 0) return null;
  if (speed > 1024) return Math.max(1, Math.round(remainingBytes / speed));
  return null;
}

async function flush(id: string, rt: JobRuntime, data: Record<string, unknown>, force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - rt.lastFlush < FLUSH_INTERVAL_MS) return;
  rt.lastFlush = now;
  try {
    await db.download.update({ where: { id }, data: data as Record<string, never> });
  } catch {
    // row may have been deleted while downloading - ignore
  }
}

async function appendFileTo(target: import("node:fs").WriteStream, file: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const rs = createReadStream(file);
    rs.on("error", reject);
    rs.on("end", () => resolve());
    rs.pipe(target, { end: false });
  });
}

function streamEnd(stream: import("node:fs").WriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.end(() => resolve());
  });
}

async function cleanupJobFiles(id: string): Promise<void> {
  const job = await db.download
    .findUnique({ where: { id }, select: { filePath: true } })
    .catch(() => null);
  if (job?.filePath) await fsp.unlink(job.filePath).catch(() => undefined);
  for (const ext of ["mp4", "ts", "mkv", "webm"]) {
    await fsp.unlink(finalFilePath(id, ext)).catch(() => undefined);
  }
  await fsp.unlink(thumbnailPath(id)).catch(() => undefined);
  await fsp.unlink(path.join(TMP_DIR, `${id}.part`)).catch(() => undefined);
  await fsp.unlink(path.join(TMP_DIR, `${id}.assemble`)).catch(() => undefined);
  await fsp.rm(path.join(TMP_DIR, id), { recursive: true, force: true }).catch(() => undefined);
}

function safeParseHeaders(json: string): Record<string, string> {
  try {
    return sanitizeHeaders(JSON.parse(json));
  } catch {
    return {};
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
