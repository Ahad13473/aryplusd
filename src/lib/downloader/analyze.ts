/**
 * Analyzes a media URL: detects direct files vs HLS streams, collects
 * size/format metadata and (for master playlists) quality variants.
 */
import {
  assertPublicUrl,
  deriveTitle,
  errMessage,
  extFromContentType,
  extFromUrl,
  fetchWithTimeout,
  mergeHeaders,
  readTextCapped,
  sanitizeHeaders,
} from "./util";
import { parsePlaylist, type HlsVariant } from "./m3u8";
import { sampleStreamBytes, toFinalSize, variantFinalSize } from "./size-estimate";

export interface AnalysisVariant {
  url: string;
  bandwidth: number;
  resolution: string | null;
  codecs: string | null;
  label: string;
  /** Predicted size of the saved file for this quality. */
  sizeBytes: number | null;
}

export interface AnalysisResult {
  kind: "direct" | "hls";
  finalUrl: string;
  title: string;
  contentType: string;
  sizeBytes: number | null;
  ext: string | null;
  isMaster?: boolean;
  variants?: AnalysisVariant[];
  segmentCount?: number;
  totalDuration?: number;
  encrypted?: boolean;
  isFmp4?: boolean;
}

export class AnalyzeError extends Error {}

const SNIFF_CAP = 2_000_000; // bytes to read when content type is ambiguous

/** Length and segment format of a master playlist, read from its lightest variant. */
async function masterInfo(
  variants: HlsVariant[],
  headers: Record<string, string>,
): Promise<{ duration?: number; isFmp4: boolean }> {
  const lightest = [...variants].sort((a, b) => a.bandwidth - b.bandwidth)[0];
  if (!lightest) return { isFmp4: false };
  try {
    const res = await fetchWithTimeout(lightest.url, { headers }, 10000);
    if (!res.ok) return { isFmp4: false };
    const parsed = parsePlaylist(await res.text(), res.url || lightest.url);
    if (parsed.isMaster) return { isFmp4: false };
    return {
      duration: parsed.totalDuration > 0 ? Math.round(parsed.totalDuration) : undefined,
      isFmp4: parsed.isFmp4,
    };
  } catch {
    return { isFmp4: false };
  }
}

/** Qualities with the predicted size of the file each one produces. */
async function toVariants(
  variants: HlsVariant[],
  headers: Record<string, string>,
): Promise<{ variants: AnalysisVariant[]; duration?: number }> {
  const info = await masterInfo(variants, headers);
  const sizes = await Promise.all(
    variants.map((v) => variantFinalSize(v, info.duration, info.isFmp4, headers)),
  );
  return {
    duration: info.duration,
    variants: variants.map((v, i) => ({
      url: v.url,
      bandwidth: v.bandwidth,
      resolution: v.resolution,
      codecs: v.codecs,
      label: v.label,
      sizeBytes: sizes[i],
    })),
  };
}

/** Predicted saved-file size for a single-quality (media) playlist. */
async function mediaFinalSize(
  parsed: Extract<ReturnType<typeof parsePlaylist>, { isMaster: false }>,
  headers: Record<string, string>,
): Promise<number | null> {
  const bytes = await sampleStreamBytes(parsed.segments, headers);
  return bytes ? toFinalSize(bytes, parsed.totalDuration, parsed.isFmp4) : null;
}

export async function analyzeUrl(rawUrl: string, rawHeaders?: unknown): Promise<AnalysisResult> {
  const url = assertPublicUrl(rawUrl);
  const headers = mergeHeaders(sanitizeHeaders(rawHeaders));

  let res: Response;
  try {
    res = await fetchWithTimeout(url, { headers, redirect: "follow" }, 20000);
  } catch (err) {
    throw new AnalyzeError(`Could not reach the URL: ${errMessage(err)}`);
  }

  try {
    if (!res.ok) {
      const status = res.status;
      const hint =
        status === 403 || status === 401
          ? " Access to this video was refused."
          : status === 404
            ? " The server returned 404 - the link may have expired."
            : "";
      throw new AnalyzeError(`The server responded with HTTP ${status}.${hint}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    const contentLengthRaw = res.headers.get("content-length");
    const contentLength = contentLengthRaw ? Number(contentLengthRaw) : NaN;
    const disposition = res.headers.get("content-disposition");
    const finalUrl = res.url || url;
    const ctBase = contentType.split(";")[0].trim().toLowerCase();
    const pathName = filenameFromUrl(finalUrl) ?? "";

    // --- HLS manifest ---
    if (
      ctBase.includes("mpegurl") ||
      /\.m3u8$/i.test(pathName) ||
      (ctBase.startsWith("text/") && /\.m3u8(\?|$)/i.test(pathName))
    ) {
      const text = await res.text().catch(() => "");
      if (!text.includes("#EXTM3U")) {
        throw new AnalyzeError("The URL points to an m3u8 playlist but the content is not a valid HLS manifest.");
      }
      const parsed = parsePlaylist(text, finalUrl);
      const title = deriveTitle(finalUrl, disposition, contentType);
      if (parsed.isMaster) {
        const master = await toVariants(parsed.variants, headers);
        return {
          kind: "hls",
          finalUrl,
          title,
          contentType,
          sizeBytes: null,
          ext: "mp4",
          isMaster: true,
          variants: master.variants,
          totalDuration: master.duration,
        };
      }
      return {
        kind: "hls",
        finalUrl,
        title,
        contentType,
        sizeBytes: await mediaFinalSize(parsed, headers),
        ext: "mp4",
        isMaster: false,
        segmentCount: parsed.segments.length,
        totalDuration: Math.round(parsed.totalDuration),
        encrypted: parsed.encrypted,
        isFmp4: parsed.isFmp4,
      };
    }

    // --- DASH manifest (not supported) ---
    if (ctBase.includes("dash+xml") || /\.mpd$/i.test(pathName)) {
      throw new AnalyzeError(
        "DASH (.mpd) manifests are not supported yet. Try locating the HLS (.m3u8) version of the stream instead.",
      );
    }

    // --- Known media content types: direct download ---
    if (ctBase.startsWith("video/") || ctBase.startsWith("audio/")) {
      const ext = extFromContentType(contentType) ?? extFromUrl(finalUrl) ?? "mp4";
      return {
        kind: "direct",
        finalUrl,
        title: deriveTitle(finalUrl, disposition, contentType),
        contentType,
        sizeBytes: Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null,
        ext,
      };
    }

    // --- Ambiguous content: sniff bytes ---
    // Large known-size payloads are binary -> treat as direct download.
    if (Number.isFinite(contentLength) && contentLength > SNIFF_CAP) {
      const ext = extFromUrl(finalUrl) ?? extFromContentType(contentType) ?? "mp4";
      return {
        kind: "direct",
        finalUrl,
        title: deriveTitle(finalUrl, disposition, contentType),
        contentType,
        sizeBytes: contentLength,
        ext,
      };
    }

    const text = await readTextCapped(res, SNIFF_CAP);
    const head = text.trimStart();
    const headLower = head.slice(0, 1024).toLowerCase();

    if (head.startsWith("#EXTM3U")) {
      const parsed = parsePlaylist(text, finalUrl);
      const title = deriveTitle(finalUrl, disposition, contentType);
      if (parsed.isMaster) {
        const master = await toVariants(parsed.variants, headers);
        return {
          kind: "hls",
          finalUrl,
          title,
          contentType,
          sizeBytes: null,
          ext: "mp4",
          isMaster: true,
          variants: master.variants,
          totalDuration: master.duration,
        };
      }
      return {
        kind: "hls",
        finalUrl,
        title,
        contentType,
        sizeBytes: await mediaFinalSize(parsed, headers),
        ext: "mp4",
        isMaster: false,
        segmentCount: parsed.segments.length,
        totalDuration: Math.round(parsed.totalDuration),
        encrypted: parsed.encrypted,
        isFmp4: parsed.isFmp4,
      };
    }

    if (/^\s*(<!doctype|<html|<head|<body|<script)/i.test(headLower)) {
      throw new AnalyzeError(
        "That link is not a supported video link.",
      );
    }

    if (
      (Number.isFinite(contentLength) && contentLength > 0) ||
      (ctBase === "application/octet-stream" && extFromUrl(finalUrl))
    ) {
      const ext = extFromUrl(finalUrl) ?? extFromContentType(contentType) ?? "mp4";
      return {
        kind: "direct",
        finalUrl,
        title: deriveTitle(finalUrl, disposition, contentType),
        contentType,
        sizeBytes: Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null,
        ext,
      };
    }

    throw new AnalyzeError(
      "Could not detect a downloadable video at this URL. Supported: direct video/audio files (mp4, webm, mp3...) and HLS streams (.m3u8).",
    );
  } finally {
    res.body?.cancel().catch(() => undefined);
  }
}

function filenameFromUrl(url: string): string | null {
  try {
    const p = new URL(url).pathname;
    return p.split("/").filter(Boolean).pop() ?? null;
  } catch {
    return null;
  }
}
