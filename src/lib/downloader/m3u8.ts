/**
 * Minimal but robust HLS (m3u8) playlist parser.
 * Supports master playlists (variant selection), media playlists with
 * AES-128 encryption, fMP4 init segments and byteranges.
 */

export interface HlsKey {
  method: string; // "AES-128"
  uri: string;
  iv: string | null; // raw hex like 0x... or null -> derive from sequence
}

export interface HlsSegmentRef {
  url: string;
  duration: number;
  index: number;
  sequence: number; // media sequence for IV derivation
  key: HlsKey | null;
  byterange: { length: number; offset: number } | null;
}

export interface HlsVariant {
  url: string;
  bandwidth: number;
  /** AVERAGE-BANDWIDTH (real average bitrate) when the playlist provides it. */
  averageBandwidth: number | null;
  resolution: string | null;
  codecs: string | null;
  label: string;
}

export type ParsedPlaylist =
  | { isMaster: true; variants: HlsVariant[] }
  | {
      isMaster: false;
      initSegment: string | null;
      initByterange: { length: number; offset: number } | null;
      segments: HlsSegmentRef[];
      totalDuration: number;
      encrypted: boolean;
      isFmp4: boolean;
      targetDuration: number;
    };

export function resolveUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).toString();
  } catch {
    return relative;
  }
}

/** Parse EXTINF-style attribute list: KEY="VAL, with quotes",OTHER=val */
function parseAttrs(line: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /([A-Z0-9-]+)=("[^"]*"|[^,]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    let value = m[2];
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    attrs[m[1]] = value;
  }
  return attrs;
}

function variantLabel(bandwidth: number, resolution: string | null): string {
  if (resolution) {
    const height = parseInt(resolution.split("x")[1] ?? "0", 10);
    if (height > 0) return `${height}p`;
  }
  if (bandwidth > 0) return `${Math.round(bandwidth / 1000)} kbps`;
  return "default";
}

export function parsePlaylist(text: string, playlistUrl: string): ParsedPlaylist {
  const clean = text.replace(/^\uFEFF/, "").replace(/\r/g, "");
  const lines = clean.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  if (!clean.includes("#EXTM3U")) {
    throw new Error("The URL did not return a valid HLS playlist (missing #EXTM3U).");
  }

  const isMaster = lines.some((l) => l.startsWith("#EXT-X-STREAM-INF"));

  if (isMaster) {
    const variants: HlsVariant[] = [];
    let pending: Record<string, string> | null = null;
    for (const line of lines) {
      if (line.startsWith("#EXT-X-STREAM-INF")) {
        pending = parseAttrs(line.slice(line.indexOf(":") + 1));
      } else if (!line.startsWith("#")) {
        const bandwidth = parseInt(pending?.["BANDWIDTH"] ?? "0", 10) || 0;
        const resolution = pending?.["RESOLUTION"] ?? null;
        const codecs = pending?.["CODECS"] ?? null;
        variants.push({
          url: resolveUrl(playlistUrl, line),
          bandwidth,
          averageBandwidth: parseInt(pending?.["AVERAGE-BANDWIDTH"] ?? "", 10) || null,
          resolution,
          codecs,
          label: variantLabel(bandwidth, resolution),
        });
        pending = null;
      }
    }
    variants.sort((a, b) => b.bandwidth - a.bandwidth);
    // Some master playlists list the same media playlist URI multiple times
    // (e.g. once per audio rendition group). Keep only the highest-bandwidth
    // entry per unique URI so we never fetch the same file twice.
    const seen = new Set<string>();
    const unique = variants.filter((v) => {
      if (seen.has(v.url)) return false;
      seen.add(v.url);
      return true;
    });
    if (unique.length === 0) throw new Error("Master playlist contained no video variants.");
    return { isMaster: true, variants: unique };
  }

  // ---- media playlist ----
  let mediaSequence = 0;
  let targetDuration = 0;
  let currentKey: HlsKey | null = null;
  let pendingDuration: number | null = null;
  let initSegment: string | null = null;
  let initByterange: { length: number; offset: number } | null = null;
  let pendingByterange: { length: number; offset: number | null } | null = null;
  let byterangeNextOffset = 0;
  let sawMap = false;
  let encrypted = false;

  const segments: HlsSegmentRef[] = [];

  for (const line of lines) {
    if (line.startsWith("#")) {
      if (line.startsWith("#EXTINF:")) {
        const val = parseFloat(line.slice("#EXTINF:".length).split(",")[0]);
        pendingDuration = Number.isFinite(val) ? val : 0;
      } else if (line.startsWith("#EXT-X-MEDIA-SEQUENCE:")) {
        mediaSequence = parseInt(line.split(":")[1] ?? "0", 10) || 0;
      } else if (line.startsWith("#EXT-X-TARGETDURATION:")) {
        targetDuration = parseInt(line.split(":")[1] ?? "0", 10) || 0;
      } else if (line.startsWith("#EXT-X-KEY:")) {
        const attrs = parseAttrs(line.slice("#EXT-X-KEY:".length));
        const method = (attrs["METHOD"] ?? "NONE").toUpperCase();
        if (method === "NONE") {
          currentKey = null;
        } else if (method === "AES-128") {
          if (!attrs["URI"]) throw new Error("AES-128 key entry is missing its URI.");
          encrypted = true;
          currentKey = {
            method,
            uri: resolveUrl(playlistUrl, attrs["URI"]),
            iv: attrs["IV"] ?? null,
          };
        } else {
          throw new Error(
            `This stream uses "${method}" content protection (DRM), which cannot be downloaded.`,
          );
        }
      } else if (line.startsWith("#EXT-X-MAP:")) {
        const attrs = parseAttrs(line.slice("#EXT-X-MAP:".length));
        if (attrs["URI"]) {
          initSegment = resolveUrl(playlistUrl, attrs["URI"]);
          initByterange = null;
          const br = attrs["BYTERANGE"];
          if (br) {
            const m = /^(\d+)(?:@(\d+))?$/.exec(br);
            if (m) {
              initByterange = {
                length: parseInt(m[1], 10),
                offset: m[2] !== undefined ? parseInt(m[2], 10) : 0,
              };
            }
          }
          sawMap = true;
        }
      } else if (line.startsWith("#EXT-X-BYTERANGE:")) {
        const m = /^#EXT-X-BYTERANGE:(\d+)(?:@(\d+))?/.exec(line);
        if (m) {
          pendingByterange = {
            length: parseInt(m[1], 10),
            offset: m[2] !== undefined ? parseInt(m[2], 10) : null,
          };
        }
      }
      continue;
    }

    // URI line
    const url = resolveUrl(playlistUrl, line);
    const index = segments.length;
    let byterange: { length: number; offset: number } | null = null;
    if (pendingByterange) {
      const offset = pendingByterange.offset ?? byterangeNextOffset;
      byterange = { length: pendingByterange.length, offset };
      byterangeNextOffset = offset + pendingByterange.length;
      pendingByterange = null;
    }
    segments.push({
      url,
      duration: pendingDuration ?? 0,
      index,
      sequence: mediaSequence + index,
      key: currentKey ? { ...currentKey } : null,
      byterange,
    });
    pendingDuration = null;
  }

  if (segments.length === 0) {
    throw new Error("The media playlist contained no video segments.");
  }

  const firstPath = segments[0].url.split("?")[0].toLowerCase();
  const isFmp4 = sawMap || firstPath.endsWith(".m4s") || firstPath.endsWith(".mp4");
  const totalDuration = segments.reduce((acc, s) => acc + s.duration, 0);

  return {
    isMaster: false,
    initSegment,
    initByterange,
    segments,
    totalDuration,
    encrypted,
    isFmp4,
    targetDuration,
  };
}
