/**
 * ARY Plus (aryplus.tv - formerly ARY ZAP) integration.
 *
 * Resolves public series / episode / movie page links into downloadable
 * HLS streams using the platform's web-app API. DRM-protected (premium)
 * titles are detected and reported - they cannot be downloaded.
 *
 * Supported link shapes:
 *   https://aryplus.tv/series/v1/{seriesId}          (also v2 / v3)
 *   https://aryplus.tv/watch/v1/{seriesId}
 *   https://aryplus.tv/sharer/series/{seriesId}
 *   https://aryplus.tv/video/v2/3/{epId}/{seriesId}  (also /video/v2/drm/3/...)
 *   https://web.aryzap.com/... and https://digital.aryzap.com/... (legacy hosts)
 *
 * Direct stream URLs (vod.aryzap.com/*.m3u8) are intentionally NOT handled
 * here - the generic HLS analyzer covers those already.
 */
import { DEFAULT_UA, errMessage, fetchWithTimeout } from "./util";
import type {
  AryPlusAnalysis,
  AryPlusEpisode,
  AryPlusSearchItem,
  AryPlusSeriesInfo,
} from "@/lib/types";

const ARY_API_BASE = "https://be.aryplus.tv";
const ARY_IMAGE_BASE = "https://images.aryplus.tv";
// Public credentials shipped inside the aryplus.tv web app bundle.
const ARY_APP_TOKEN =
  "IKIDIKIDLFk25sRpztYyA6lcEagXKy9A4nHYdV8fLFk25sRpzLRJvwlLfkZ9UhhTzF6kALGwNYUBdpl25tYyA6lcEagXKy9A4nHYdV8fLRJvwlLfkZ9UhhTzF6kALGwNYUBdpl25";
const ARY_APP_KEY = "ak_37515186786306625012043079404171";
const ARY_CLIENT_ID = "webapp-v2.0";

export class AryPlusError extends Error {}

const OBJECT_ID = /^[0-9a-f]{24}$/i;
const MAX_EPISODE_PAGES = 8; // 100 episodes per page -> up to 800 episodes

/* ------------------------------------------------------------------ */
/* Link parsing                                                        */
/* ------------------------------------------------------------------ */

export interface AryPlusLink {
  episodeId: string | null;
  seriesId: string | null;
}

function isAryHost(host: string): boolean {
  return (
    host === "aryplus.tv" ||
    host.endsWith(".aryplus.tv") ||
    host === "aryzap.com" ||
    host.endsWith(".aryzap.com")
  );
}

/** True when the URL points at an ARY Plus web page (not a raw stream / API host). */
export function isAryPlusPageUrl(rawUrl: string): boolean {
  let u: URL;
  try {
    u = new URL((rawUrl ?? "").trim());
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  if (!isAryHost(host)) return false;
  const blocked = ["vod.", "be.", "images.", "api.", "feedback.", "social.", "analytics."];
  return !blocked.some((p) => host.startsWith(p));
}

/** Extract series / episode ids from an ARY Plus page URL (handles hash routes too). */
export function parseAryPlusLink(rawUrl: string): AryPlusLink | null {
  let u: URL;
  try {
    u = new URL((rawUrl ?? "").trim());
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase();
  if (!isAryHost(host)) return null;
  if (["vod.", "be.", "images.", "api.", "feedback.", "social.", "analytics."].some((p) => host.startsWith(p))) {
    return null;
  }

  const path = `${u.pathname.replace(/\/+$/, "")}/${u.hash.replace(/^#\/?/, "").replace(/\/+$/, "")}`;

  // /video/v2/3/{episodeId}/{seriesId} (also /video/v2/drm/3/...)
  let m = /\/video\/v2\/(?:drm\/)?3\/([0-9a-f]{24})\/([0-9a-f]{24})/i.exec(path);
  if (m) return { episodeId: m[1], seriesId: m[2] };

  // /watch/v1/{seriesId}
  m = /\/watch\/v1\/([0-9a-f]{24})/i.exec(path);
  if (m) return { episodeId: null, seriesId: m[1] };

  // /series/v1/{seriesId} (also v2 / v3)
  m =
    /\/series\/v\d+\/([0-9a-f]{24})/i.exec(path) ??
    // /sharer/series/{seriesId}
    /\/sharer\/series\/([0-9a-f]{24})/i.exec(path) ??
    // /shorts/{videoId} - handled as a standalone video
    /\/shorts\/([0-9a-f]{24})/i.exec(path);
  if (m) return { episodeId: null, seriesId: m[1] };

  return null;
}

/* ------------------------------------------------------------------ */
/* API client                                                          */
/* ------------------------------------------------------------------ */

interface AryApiSeries {
  _id: string;
  title: string;
  description?: string | null;
  seriesType?: string | null;
  episodeCount?: number | null;
  drmEnabled?: boolean;
  isDM?: boolean;
  imagePoster?: string | null;
  logo?: string | null;
  duration?: string | null;
  status?: string | null;
  /** Direct stream of standalone videos / OSTs. */
  ost?: string | null;
  seiresCDN?: string | null;
  seiresCDNWebLink?: string | null;
}

interface AryApiEpisode {
  _id: string;
  seriesId?: string;
  title?: string | null;
  videoEpNumber?: number | null;
  videoSource?: string | null;
  videoLength?: number | null;
  videoType?: string | null;
  imagePath?: string | null;
  imagePathV2?: string | null;
  drmEnabled?: boolean;
  published?: boolean;
  status?: string | null;
}

interface AryApiSearchResponse {
  match_type?: string;
  series?: AryApiSeries[];
  episodes?: AryApiEpisode[];
  cast?: unknown[];
}

interface AryApiEpisodePage {
  episode: AryApiEpisode[];
  currentPage?: number;
  totalEpisodes?: number;
  totalPages?: number;
  hasNextPage?: boolean;
}

async function aryApi<T>(
  path: string,
  init: { method?: string; body?: string } = {},
  timeoutMs = 20_000,
): Promise<T> {
  let res: Response;
  try {
    res = await fetchWithTimeout(
      `${ARY_API_BASE}${path}`,
      {
        method: init.method ?? "GET",
        body: init.body,
        redirect: "follow",
        headers: {
          "User-Agent": DEFAULT_UA,
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${ARY_APP_TOKEN}`,
          "X-API-Key": ARY_APP_KEY,
          "X-Client-Id": ARY_CLIENT_ID,
        },
      },
      timeoutMs,
    );
  } catch (err) {
    if (errMessage(err).includes("timed out")) {
      throw new AryPlusError("ARY Plus did not respond in time. Please try again.");
    }
    throw new AryPlusError("Could not reach ARY Plus. Check your internet connection and try again.");
  }

  if (!res.ok) {
    let apiMessage = "";
    try {
      const body = (await res.json()) as { message?: string; error?: string };
      apiMessage = body.message || body.error || "";
    } catch {
      // ignore body parse failures
    }
    if (res.status === 404) {
      throw new AryPlusError(
        "ARY Plus does not recognize this content (404). Double-check the link - it may have expired or point to a removed title.",
      );
    }
    if (res.status === 401 || res.status === 403) {
      throw new AryPlusError("ARY Plus refused the request (auth rejected). Try again in a moment.");
    }
    throw new AryPlusError(apiMessage || `ARY Plus request failed (HTTP ${res.status}).`);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new AryPlusError("ARY Plus returned a response that could not be parsed.");
  }
}

function imageUrl(rel: string | null | undefined): string | null {
  if (!rel || typeof rel !== "string") return null;
  if (/^https?:\/\//i.test(rel)) return rel;
  return `${ARY_IMAGE_BASE}/${rel.replace(/^\/+/, "")}`;
}

function parseDurationSeconds(raw: string | null | undefined): number | null {
  if (!raw) return null;
  // "00:05:21" -> 321
  const m = /^(?:(\d+):)?(\d{1,2}):(\d{2})$/.exec(String(raw).trim());
  if (!m) return null;
  const h = m[1] ? parseInt(m[1], 10) : 0;
  const min = parseInt(m[2], 10);
  const sec = parseInt(m[3], 10);
  return h * 3600 + min * 60 + sec;
}

/* ------------------------------------------------------------------ */
/* Resolution                                                          */
/* ------------------------------------------------------------------ */

function mapEpisode(ep: AryApiEpisode): AryPlusEpisode {
  const drm = !!ep.drmEnabled;
  const playable =
    !drm && ep.published !== false && ep.status !== "unpublished" && !!ep.videoSource;
  return {
    id: ep._id,
    title: ep.title?.trim() || `Episode ${ep.videoEpNumber ?? ""}`.trim(),
    episodeNumber:
      typeof ep.videoEpNumber === "number"
        ? ep.videoEpNumber
        : typeof ep.videoEpNumber === "string" && /^\d+$/.test(ep.videoEpNumber)
          ? parseInt(ep.videoEpNumber, 10)
          : null,
    imageUrl: imageUrl(ep.imagePathV2 || ep.imagePath),
    durationSeconds:
      typeof ep.videoLength === "number" && ep.videoLength > 0
        ? ep.videoLength
        : typeof ep.videoLength === "string" && /^\d+$/.test(ep.videoLength)
          ? parseInt(ep.videoLength, 10)
          : null,
    streamUrl: playable ? ep.videoSource! : null,
    drm,
  };
}

function mapSeriesInfo(s: AryApiSeries): AryPlusSeriesInfo {
  return {
    id: s._id,
    title: s.title?.trim() || "Untitled",
    description: s.description || null,
    seriesType: s.seriesType || null,
    posterUrl: imageUrl(s.imagePoster || s.logo),
    drm: !!s.drmEnabled || !!s.isDM,
    sourceUrl: `https://aryplus.tv/series/v1/${s._id}`,
  };
}

/**
 * Loads a series (and all its episodes) by id. Standalone videos / OSTs
 * (seriesType "singleVideo" with no episode list) are surfaced as a
 * single synthetic "movie-<id>" episode pointing at their direct stream.
 */
export async function resolveAryPlusSeries(
  seriesId: string,
  episodeId: string | null = null,
): Promise<{ series: AryPlusSeriesInfo; episodes: AryPlusEpisode[] }> {
  if (!seriesId || !OBJECT_ID.test(seriesId)) {
    throw new AryPlusError(
      "That does not look like a valid ARY Plus id (expected a 24-character hex id).",
    );
  }
  if (episodeId && !OBJECT_ID.test(episodeId)) {
    throw new AryPlusError("The episode id embedded in this link looks malformed.");
  }

  const raw = await aryApi<AryApiSeries>(`/api/series/${seriesId}`);
  if (!raw || !raw._id || !raw.title) {
    throw new AryPlusError("ARY Plus returned no details for this title.");
  }
  const series = mapSeriesInfo(raw);

  // Paginated episode list (100 per page, capped at MAX_EPISODE_PAGES).
  const episodes: AryPlusEpisode[] = [];
  for (let page = 1; page <= MAX_EPISODE_PAGES; page++) {
    const pageData = await aryApi<AryApiEpisodePage>(
      `/api/cdn/${seriesId}?page=${page}&limit=100`,
    );
    const list = Array.isArray(pageData.episode) ? pageData.episode : [];
    episodes.push(...list.map(mapEpisode));
    if (pageData.hasNextPage === false || list.length === 0) break;
  }

  if (episodes.length === 0) {
    // Standalone video / OST: the stream lives on the series record itself.
    const direct =
      raw.seiresCDNWebLink || raw.seiresCDN || raw.ost || null;
    const drm = !!raw.drmEnabled || !!raw.isDM;
    if (!direct) {
      throw new AryPlusError(
        drm
          ? "This title is premium (DRM protected) and cannot be downloaded."
          : "This title has no downloadable stream available on ARY Plus.",
      );
    }
    episodes.push({
      id: `movie-${raw._id}`,
      title: raw.title,
      episodeNumber: null,
      imageUrl: imageUrl(raw.imagePoster || raw.logo),
      durationSeconds: parseDurationSeconds(raw.duration),
      streamUrl: drm ? null : direct,
      drm,
    });
  }

  if (episodeId) {
    const wanted = episodes.filter((e) => e.id === episodeId);
    if (wanted.length === 0) {
      throw new AryPlusError(
        "This episode could not be found in the series. It may have been removed.",
      );
    }
    return { series, episodes: wanted };
  }

  // Stable order by episode number when available.
  episodes.sort((a, b) => {
    const an = a.episodeNumber ?? Number.MAX_SAFE_INTEGER;
    const bn = b.episodeNumber ?? Number.MAX_SAFE_INTEGER;
    return an - bn;
  });

  return { series, episodes };
}

/** Resolves a full ARY Plus page URL into series + episode streams. */
export async function resolveAryPlusUrl(
  rawUrl: string,
): Promise<{ series: AryPlusSeriesInfo; episodes: AryPlusEpisode[] }> {
  const link = parseAryPlusLink(rawUrl);
  if (!link || (!link.seriesId && !link.episodeId)) {
    throw new AryPlusError(
      "This does not look like an ARY Plus (aryplus.tv / ARY ZAP) series, episode or watch link.",
    );
  }
  if (!link.seriesId && link.episodeId) {
    throw new AryPlusError(
      "This link only contains an episode id. Please paste the series or watch link instead.",
    );
  }
  return resolveAryPlusSeries(link.seriesId!, link.episodeId);
}

/** Maps a resolved series into the JSON shape consumed by the frontend. */
export function toAryPlusAnalysis(
  result: { series: AryPlusSeriesInfo; episodes: AryPlusEpisode[] },
  sourceUrl: string,
): AryPlusAnalysis {
  return {
    series: { ...result.series, sourceUrl: sourceUrl || result.series.sourceUrl },
    episodes: result.episodes,
  };
}

/* ------------------------------------------------------------------ */
/* Catalog search                                                      */
/* ------------------------------------------------------------------ */

/** Searches the ARY Plus catalog by title (free + premium, DRM is flagged). */
export async function searchAryPlus(query: string): Promise<AryPlusSearchItem[]> {
  const q = (query ?? "").trim().slice(0, 120);
  if (!q) {
    throw new AryPlusError("Type a drama, show or movie name to search.");
  }
  const data = await aryApi<AryApiSearchResponse>("/api/v2/search", {
    method: "POST",
    body: JSON.stringify({ query: q }),
  });
  const list = Array.isArray(data.series) ? data.series : [];
  return list.map((s) => ({
    id: s._id,
    title: s.title?.trim() || "Untitled",
    seriesType: s.seriesType || null,
    posterUrl: imageUrl(s.imagePoster || s.logo),
    episodeCount: typeof s.episodeCount === "number" ? s.episodeCount : null,
    description: s.description || null,
    drm: !!s.drmEnabled || !!s.isDM,
  }));
}
