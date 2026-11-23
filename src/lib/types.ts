/** Shared types between API and frontend (mirror of the backend DTOs). */

export type JobStatus = "queued" | "downloading" | "completed" | "failed" | "canceled";

export interface JobDto {
  id: string;
  title: string;
  kind: "direct" | "hls";
  status: JobStatus;
  progress: number;
  downloadedBytes: number;
  totalBytes: number | null;
  container: string | null;
  qualityLabel: string | null;
  error: string | null;
  hasThumbnail: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface AnalysisVariant {
  url: string;
  bandwidth: number;
  resolution: string | null;
  codecs: string | null;
  label: string;
  /** Predicted size of the saved file for this quality. */
  sizeBytes?: number | null;
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

/* ------------------------------------------------------------------ */
/* ARY Plus (aryplus.tv / ARY ZAP)                                     */
/* ------------------------------------------------------------------ */

export interface AryPlusSeriesInfo {
  id: string;
  title: string;
  description?: string | null;
  seriesType?: string | null;
  posterUrl?: string | null;
  /** Original page URL the user provided (or the canonical series page). */
  sourceUrl: string;
  drm?: boolean;
}

export interface AryPlusEpisode {
  id: string;
  title: string;
  episodeNumber?: number | null;
  imageUrl?: string | null;
  durationSeconds?: number | null;
  /** Opaque server-sealed stream token - null for premium titles. */
  streamUrl?: string | null;
  drm?: boolean;
}

export interface AryPlusAnalysis {
  series: AryPlusSeriesInfo;
  episodes: AryPlusEpisode[];
}

export interface AryPlusSearchItem {
  id: string;
  title: string;
  seriesType?: string | null;
  posterUrl?: string | null;
  episodeCount?: number | null;
  description?: string | null;
  drm?: boolean;
}

export type AnalyzeResponse = AnalysisResult | AryPlusAnalysis;

/** Runtime discriminator between a plain stream analysis and an ARY Plus title. */
export function isAryPlusAnalysis(value: unknown): value is AryPlusAnalysis {
  return (
    typeof value === "object" &&
    value !== null &&
    "series" in value &&
    "episodes" in value &&
    !("kind" in value)
  );
}
