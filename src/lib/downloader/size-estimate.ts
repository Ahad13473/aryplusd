/**
 * Predicts the size of the file the user will actually receive for an HLS
 * quality, not the stream's peak bitrate.
 *
 * 1. Stream bytes: AVERAGE-BANDWIDTH x length when the playlist publishes it,
 *    otherwise measured by sampling real segment sizes.
 * 2. Remux: MPEG-TS carries per-packet overhead that disappears when the
 *    segments are merged into MP4. Measured on real ARY Plus segments
 *    (240p: 0.79 of the .ts size, 1080p: 0.95) it fits
 *        mp4 = 0.98 * ts - 4400 B/s * seconds
 *    which predicted a real 240p episode within 0.3%.
 */
import { ffmpegAvailable } from "./engine";
import { parsePlaylist } from "./m3u8";
import { fetchWithTimeout } from "./util";

const TS_TO_MP4_RATIO = 0.98;
const TS_OVERHEAD_BYTES_PER_SEC = 4400;
const SAMPLE_SEGMENTS = 4;

interface SegmentLike {
  url: string;
  duration: number;
  byterange: { length: number } | null;
}

/** Final file size from the raw stream size (bytes) and length (seconds). */
export async function toFinalSize(
  streamBytes: number,
  seconds: number,
  isFmp4: boolean,
): Promise<number> {
  // fMP4 segments copy into MP4 almost 1:1; without ffmpeg the .ts is kept as is.
  if (isFmp4 || !(await ffmpegAvailable())) return Math.round(streamBytes);
  const mp4 = TS_TO_MP4_RATIO * streamBytes - TS_OVERHEAD_BYTES_PER_SEC * seconds;
  return Math.round(Math.max(mp4, streamBytes * 0.5));
}

async function segmentBytes(url: string, headers: Record<string, string>): Promise<number | null> {
  try {
    const head = await fetchWithTimeout(url, { method: "HEAD", headers }, 8000);
    const len = Number(head.headers.get("content-length"));
    if (head.ok && len > 0) return len;
    // Some CDNs omit the length on HEAD: ask for one byte and read the total.
    const ranged = await fetchWithTimeout(url, { headers: { ...headers, Range: "bytes=0-0" } }, 8000);
    const total = Number(/\/(\d+)$/.exec(ranged.headers.get("content-range") ?? "")?.[1]);
    void ranged.body?.cancel();
    return total > 0 ? total : null;
  } catch {
    return null;
  }
}

/** Raw stream bytes for a media playlist's segments, from a spread-out sample. */
export async function sampleStreamBytes(
  segments: SegmentLike[],
  headers: Record<string, string>,
): Promise<number | null> {
  const total = segments.reduce((a, s) => a + s.duration, 0);
  if (segments.length === 0 || total <= 0) return null;
  if (segments.every((s) => s.byterange)) {
    return segments.reduce((a, s) => a + (s.byterange?.length ?? 0), 0);
  }
  const picks = [...new Set(
    Array.from({ length: SAMPLE_SEGMENTS }, (_, i) =>
      Math.floor(((i + 0.5) / SAMPLE_SEGMENTS) * segments.length),
    ),
  )].map((i) => segments[i]);
  const sizes = await Promise.all(picks.map((s) => segmentBytes(s.url, headers)));
  let bytes = 0;
  let secs = 0;
  sizes.forEach((b, i) => {
    if (b) {
      bytes += b;
      secs += picks[i].duration;
    }
  });
  return secs > 0 ? (bytes / secs) * total : null;
}

/** Final file size for one master-playlist quality. */
export async function variantFinalSize(
  variant: { url: string; averageBandwidth: number | null },
  seconds: number | undefined,
  isFmp4: boolean,
  headers: Record<string, string>,
): Promise<number | null> {
  try {
    if (variant.averageBandwidth && seconds) {
      return await toFinalSize((variant.averageBandwidth / 8) * seconds, seconds, isFmp4);
    }
    const res = await fetchWithTimeout(variant.url, { headers }, 10000);
    if (!res.ok) return null;
    const parsed = parsePlaylist(await res.text(), res.url || variant.url);
    if (parsed.isMaster) return null;
    const bytes = await sampleStreamBytes(parsed.segments, headers);
    return bytes ? await toFinalSize(bytes, parsed.totalDuration, parsed.isFmp4) : null;
  } catch {
    return null;
  }
}
