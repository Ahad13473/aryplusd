import type { Download } from "@prisma/client";

/** Shape returned to the frontend for a download job. */
export function serializeJob(job: Download) {
  return {
    id: job.id,
    title: job.title,
    kind: job.kind,
    status: job.status,
    progress: job.progress,
    downloadedBytes: job.downloadedBytes,
    totalBytes: job.totalBytes,
    container: job.container,
    qualityLabel: job.qualityLabel,
    error: job.error,
    hasThumbnail: job.hasThumbnail,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  };
}

export type JobDto = ReturnType<typeof serializeJob>;
