"use client";

import { tf, useI18n } from "@/i18n/client";
import { useQuery } from "@tanstack/react-query";
import { AnalyzeCard } from "@/components/downloader/analyze-card";
import { JobsList } from "@/components/downloader/jobs-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useAutoSave } from "@/hooks/use-auto-save";
import type { JobDto } from "@/lib/types";

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  );
}

/** Link box + quality picker (sits inside the hero). */
export function DownloaderForm() {
  return <AnalyzeCard onStarted={() => undefined} />;
}

/** Live downloads; finished files are saved straight to the device. */
export function DownloadsPanel() {
  const { ui } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["downloads"],
    queryFn: async () => {
      const res = await fetch("/api/downloads");
      if (!res.ok) throw new Error("Failed to load downloads");
      return (await res.json()) as { jobs: JobDto[] };
    },
    refetchInterval: (query) => {
      const jobs = query.state.data?.jobs ?? [];
      // Poll only while something is in flight; stay silent when idle.
      if (jobs.some((j) => j.status === "queued" || j.status === "downloading")) return 2000;
      if (jobs.some((j) => j.status === "completed")) return 4000;
      return false;
    },
  });

  const jobs = data?.jobs ?? [];
  const liveCount = jobs.filter((j) => j.status === "downloading").length;
  useAutoSave(jobs);

  return (
    <section className="mt-8 space-y-4" aria-labelledby="downloads-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="downloads-heading" className="text-lg font-semibold tracking-tight">
            {ui.downloads}
          </h2>
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              {tf(ui.liveActive, { count: liveCount })}
            </span>
          )}
        </div>
      {isLoading ? <LoadingSkeleton /> : <JobsList jobs={jobs} />}
    </section>
  );
}
