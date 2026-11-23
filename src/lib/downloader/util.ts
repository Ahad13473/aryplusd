/**
 * Shared utilities for the download engine: URL guards, header
 * sanitization, extension/mime helpers and fetch helpers.
 */
import path from "node:path";

export const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

export class CanceledError extends Error {
  constructor() {
    super("Download canceled");
    this.name = "CanceledError";
  }
}

export function isCanceledError(err: unknown): boolean {
  return (
    err instanceof CanceledError ||
    (err instanceof Error && err.name === "AbortError" && err.message === "Download canceled") ||
    (err instanceof Error && err.message === "Download canceled")
  );
}

const PRIVATE_V4 = (octets: number[]): boolean => {
  const [a, b] = octets;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
};

/**
 * Basic SSRF guard: only allow public http(s) URLs.
 * Returns the normalized URL string, throws on violation.
 */
export function assertPublicUrl(raw: string): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) throw new Error("Please provide a URL.");
  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    throw new Error("That does not look like a valid URL.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http:// and https:// URLs are supported.");
  }
  let host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  // IPv4-mapped IPv6 (e.g. ::ffff:10.0.0.1)
  const mapped = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) host = mapped[1];
  if (host === "localhost" || host === "::1" || host === "::" || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("Local addresses are not allowed.");
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const octets = host.split(".").map((n) => parseInt(n, 10));
    if (PRIVATE_V4(octets)) throw new Error("Private network addresses are not allowed.");
  }
  if (host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80")) {
    throw new Error("Private network addresses are not allowed.");
  }
  return u.toString();
}

const SAFE_HEADER_NAME = /^[a-zA-Z0-9-]+$/;
const BLOCKED_HEADERS = new Set(["host", "content-length", "connection", "accept-encoding", "range"]);

/** Sanitize user supplied headers into a plain Record. */
export function sanitizeHeaders(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input || typeof input !== "object") return out;
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof v !== "string") continue;
    const name = k.trim();
    if (!SAFE_HEADER_NAME.test(name) || BLOCKED_HEADERS.has(name.toLowerCase())) continue;
    if (v.length > 4096) continue;
    out[name] = v;
    if (Object.keys(out).length >= 20) break;
  }
  return out;
}

export function mergeHeaders(custom: Record<string, string>): Record<string, string> {
  const merged = { ...custom };
  if (!Object.keys(merged).some((k) => k.toLowerCase() === "user-agent")) {
    merged["User-Agent"] = DEFAULT_UA;
  }
  return merged;
}

export function extFromUrl(url: string): string | null {
  try {
    const p = new URL(url).pathname;
    const ext = path.extname(p).replace(".", "").toLowerCase();
    return ext && ext.length <= 5 ? ext : null;
  } catch {
    return null;
  }
}

const CONTENT_TYPE_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/x-matroska": "mkv",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/mpeg": "mpeg",
  "video/3gpp": "3gp",
  "audio/mp4": "m4a",
  "audio/mpeg": "mp3",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};

export function extFromContentType(ct: string): string | null {
  const base = (ct || "").split(";")[0].trim().toLowerCase();
  return CONTENT_TYPE_EXT[base] ?? null;
}

const MIME_BY_EXT: Record<string, string> = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  ts: "video/mp2t",
  m2t: "video/mp2t",
  avi: "video/x-msvideo",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  "3gp": "video/3gpp",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  wav: "audio/wav",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

export function mimeForExt(ext: string | null | undefined): string {
  if (!ext) return "application/octet-stream";
  return MIME_BY_EXT[ext.toLowerCase()] ?? "application/octet-stream";
}

const VIDEO_EXTS = new Set(["mp4", "m4v", "webm", "mkv", "mov", "ts", "avi", "mpeg", "mpg", "3gp"]);

export function isVideoExt(ext: string | null | undefined): boolean {
  return !!ext && VIDEO_EXTS.has(ext.toLowerCase());
}

/** Derive a human friendly title from URL / headers. */
export function deriveTitle(url: string, contentDisposition?: string | null, contentType?: string | null): string {
  void contentType;
  // 1) Content-Disposition filename
  if (contentDisposition) {
    const m =
      /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition) ??
      /filename="?([^";]+)"?/i.exec(contentDisposition);
    if (m?.[1]) {
      const name = decodeURIComponent(m[1]).trim().replace(/\.[a-z0-9]{1,5}$/i, "");
      if (name) return name.slice(0, 120);
    }
  }
  // 2) URL path
  try {
    const u = new URL(url);
    const seg = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() ?? "");
    const cleaned = seg.replace(/\.(m3u8|mpd)$/i, "").replace(/\.[a-z0-9]{1,5}$/i, "").trim();
    if (cleaned && cleaned.length > 1 && /[a-z0-9]/i.test(cleaned)) return cleaned.slice(0, 120);
    // 3) hostname + timestamp
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    return `${u.hostname} video ${stamp}`;
  } catch {
    return `video-${Date.now()}`;
  }
}

/**
 * fetch with an abort signal + a hard timeout that is cleared once headers arrive.
 * The external abort signal stays bridged for the entire body lifetime, so an
 * aborted job also kills in-flight body reads.
 */
export async function fetchWithTimeout(
  url: string,
  opts: { headers?: Record<string, string>; signal?: AbortSignal; method?: string } | undefined,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s`)),
    timeoutMs,
  );
  const external = opts?.signal;
  const onExternalAbort = () => controller.abort(external?.reason);
  if (external) {
    if (external.aborted) controller.abort(external.reason);
    else external.addEventListener("abort", onExternalAbort);
  }
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function errMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "AbortError" || err.name === "TimeoutError") return "The server took too long to respond.";
    return err.message || "Unknown error";
  }
  return "Unknown error";
}

/** Read the body as text, capped at `cap` bytes (then cancels the stream). */
export async function readTextCapped(res: Response, cap: number): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false });
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      text += decoder.decode(value, { stream: true });
      if (text.length >= cap) break;
    }
    return text.slice(0, cap);
  } catch {
    return text;
  } finally {
    reader.cancel().catch(() => undefined);
  }
}
