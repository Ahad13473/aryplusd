"use client";

import { tf, useI18n } from "@/i18n/client";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Download,
  Gauge,
  ListVideo,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/format";
import type { JobDto } from "@/lib/types";

function StatusBadge({ status }: { status: JobDto["status"] }) {
  const { ui } = useI18n();
  const map: Record<JobDto["status"], { label: string; className: string }> = {
    queued: { label: ui.statusQueued, className: "bg-muted text-muted-foreground" },
    downloading: { label: ui.statusDownloading, className: "bg-emerald-600 text-white" },
    failed: { label: ui.statusFailed, className: "bg-destructive text-white" },
    canceled: { label: ui.statusCanceled, className: "bg-muted text-muted-foreground" },
    completed: { label: ui.statusSaving, className: "bg-emerald-600/20 text-emerald-500" },
  };
  const cfg = map[status];
  return <Badge className={`gap-1 border-transparent ${cfg.className}`}>{cfg.label}</Badge>;
}

function IndeterminateBar() {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full w-1/3 animate-progress-slide rounded-full bg-emerald-500" />
    </div>
  );
}

export function JobsList({ jobs }: { jobs: JobDto[] }) {
  const { ui } = useI18n();
  const queryClient = useQueryClient();
  const [pendingCancel, setPendingCancel] = useState<JobDto | null>(null);
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["downloads"] });
  }, [queryClient]);

  const cancelJob = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/downloads/${id}/cancel`, { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error || ui.couldNotCancel);
        return;
      }
      toast.info(ui.canceled, { description: ui.canceledHint });
      refresh();
    },
    [refresh, ui],
  );

  const retryJob = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/downloads/${id}/retry`, { method: "POST" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error || ui.couldNotRetry);
        return;
      }
      toast.success(ui.requeued);
      refresh();
    },
    [refresh, ui],
  );

  const deleteJob = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/downloads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error || ui.couldNotDelete);
        return;
      }
      toast.success(ui.removed);
      refresh();
    },
    [refresh, ui],
  );

  if (jobs.length === 0) {
    return (
      // Same height as one download card, so the page does not jump when a
      // download starts or finishes.
      <div className="flex h-[var(--job-card-h)] items-center gap-4 rounded-xl border border-dashed border-border/70 bg-card/40 px-4 [--job-card-h:122px]">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
          <ListVideo className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{ui.noDownloads}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {ui.noDownloadsHint}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="scrollbar-thin max-h-[520px] w-full overflow-y-auto pe-1">
      <div className="space-y-3">
        {jobs.map((job) => {
          const running = job.status === "downloading";
          const indeterminate = running && !job.totalBytes && job.progress === 0 && job.kind === "direct";
          return (
            <Card key={job.id} className="border-border/60 py-3">
              <CardContent className="space-y-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium" title={job.title}>
                      {job.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={job.status} />
                      {job.qualityLabel && (
                        <Badge variant="secondary" className="text-[10px]">
                          {job.qualityLabel}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {(job.status === "queued" || job.status === "downloading") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setPendingCancel(job)}
                        aria-label={`${ui.cancelDownload}: ${job.title}`}
                      >
                        <X className="size-3.5" />
                        {ui.cancel}
                      </Button>
                    )}
                    {(job.status === "failed" || job.status === "canceled") && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-emerald-500"
                          onClick={() => void retryJob(job.id)}
                          aria-label={ui.retry}
                        >
                          <RefreshCw className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => void deleteJob(job.id)}
                          aria-label={ui.removed}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {running && (
                  <div className="space-y-2">
                    {indeterminate ? <IndeterminateBar /> : (
                      <Progress
                        value={Math.min(100, Math.max(0, job.progress))}
                        className="h-2 [&>div]:bg-emerald-500"
                      />
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="size-3" />
                        {formatBytes(job.downloadedBytes)}
                        {job.totalBytes ? ` / ${formatBytes(job.totalBytes)}` : ""}
                      </span>
                      {!job.totalBytes && job.kind === "direct" && (
                        <span className="flex items-center gap-1">
                          <Gauge className="size-3" />
                          {ui.sizeUnknownShort}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Queued and finished cards keep the same bar + line shape as a running one. */}
                {job.status === "queued" && (
                  <div className="space-y-2">
                    <Progress value={0} className="h-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3 animate-pulse" />
                      {ui.waitingSlot}
                    </div>
                  </div>
                )}

                {job.status === "completed" && (
                  <div className="space-y-2">
                    <Progress value={100} className="h-2 [&>div]:bg-emerald-500" />
                    <div className="flex items-center gap-1 text-xs text-emerald-500">
                      <Download className="size-3" />
                      {tf(ui.sendingToDevice, { size: formatBytes(job.downloadedBytes) })}
                    </div>
                  </div>
                )}

                {job.status === "failed" && job.error && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {job.error}
                  </p>
                )}

                {job.status === "canceled" && (
                  <p className="text-xs text-muted-foreground">{ui.stoppedEarly}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>

    <AlertDialog open={!!pendingCancel} onOpenChange={(open) => !open && setPendingCancel(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ui.cancelTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {tf(ui.cancelText, { title: pendingCancel?.title ?? "" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{ui.keepDownloading}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              if (pendingCancel) void cancelJob(pendingCancel.id);
              setPendingCancel(null);
            }}
          >
            <X className="size-4" />
            {ui.cancelDownload}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
