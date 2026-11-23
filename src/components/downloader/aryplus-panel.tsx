"use client";

import { tf, useI18n } from "@/i18n/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Download as DownloadIcon,
  ExternalLink,
  Loader2,
  Lock,
  RotateCcw,
  Tv,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { estimateSize, QualityTiles } from "@/components/downloader/quality-tiles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatDuration } from "@/lib/format";
import type { AnalysisResult, AnalysisVariant, AryPlusAnalysis, AryPlusEpisode } from "@/lib/types";

interface AryPlusPanelProps {
  analysis: AryPlusAnalysis;
  onStarted?: () => void;
  onDismiss?: () => void;
}

type EpisodeState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready"; result: AnalysisResult; variants: AnalysisVariant[] };

function EpisodeThumb({
  src,
  alt,
  number,
  duration,
  large,
}: {
  src?: string | null;
  alt: string;
  number: number;
  duration: number | null;
  large: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative aspect-video shrink-0 overflow-hidden rounded-lg bg-muted/60 transition-all ${
        large ? "w-full sm:w-56" : "w-28 sm:w-36"
      }`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="grid size-full place-items-center text-muted-foreground/50">
          <Tv className="size-6" />
        </div>
      )}
      <span className="absolute start-1.5 top-1.5 rounded bg-black/70 px-1.5 py-px text-[10px] font-semibold text-white">
        EP {number}
      </span>
      {duration ? (
        <span className="absolute bottom-1.5 end-1.5 rounded bg-black/70 px-1.5 py-px font-mono text-[10px] text-white">
          {formatDuration(duration)}
        </span>
      ) : null}
    </div>
  );
}

export function AryPlusPanel({ analysis, onStarted, onDismiss }: AryPlusPanelProps) {
  const { ui } = useI18n();
  const queryClient = useQueryClient();
  const { series, episodes } = analysis;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [epStates, setEpStates] = useState<Record<string, EpisodeState>>({});
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [startingId, setStartingId] = useState<string | null>(null);
  const [posterFailed, setPosterFailed] = useState(false);
  const [posterRetryCount, setPosterRetryCount] = useState(0);

  const posterSrc = useMemo(() => {
    if (!series.posterUrl) return null;
    if (posterRetryCount === 0) return series.posterUrl;
    const sep = series.posterUrl.includes("?") ? "&" : "?";
    return `${series.posterUrl}${sep}r=${posterRetryCount}`;
  }, [series.posterUrl, posterRetryCount]);

  const downloadable = useMemo(() => episodes.filter((e) => e.streamUrl), [episodes]);
  const drmCount = episodes.length - downloadable.length;
  const allProtected = downloadable.length === 0;

  const analyzeEpisode = useCallback(
    async (ep: AryPlusEpisode, force = false) => {
      if (!ep.streamUrl) return;
      setEpStates((prev) => {
        const cur = prev[ep.id];
        if (!force && cur && (cur.phase === "ready" || cur.phase === "loading")) return prev;
        return { ...prev, [ep.id]: { phase: "loading" } };
      });
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: ep.streamUrl }),
        });
        const data = (await res.json()) as AnalysisResult & { error?: string };
        if (!res.ok) throw new Error(data.error || ui.streamFailed);
        const variants = data.isMaster ? (data.variants ?? []) : [];
        setEpStates((prev) => ({
          ...prev,
          [ep.id]: { phase: "ready", result: data, variants },
        }));
        if (variants.length > 0) {
          setPicks((prev) => ({ ...prev, [ep.id]: variants[0].url }));
        }
      } catch (err) {
        setEpStates((prev) => ({
          ...prev,
          [ep.id]: {
            phase: "error",
            message: err instanceof Error ? err.message : ui.streamFailed,
          },
        }));
      }
    },
    [],
  );

  const toggleEpisode = useCallback(
    (ep: AryPlusEpisode) => {
      if (!ep.streamUrl) return;
      if (expandedId === ep.id) {
        setExpandedId(null);
        return;
      }
      setExpandedId(ep.id);
      void analyzeEpisode(ep);
    },
    [expandedId, analyzeEpisode],
  );

  // A link to one episode opens its quality options straight away.
  useEffect(() => {
    if (downloadable.length === 1 && episodes.length === 1) {
      setExpandedId(downloadable[0].id);
      void analyzeEpisode(downloadable[0]);
    }
  }, []);

  const startDownload = useCallback(
    async (ep: AryPlusEpisode) => {
      if (!ep.streamUrl) return;
      const state = epStates[ep.id];
      const result = state.phase === "ready" ? state.result : null;
      const variantUrl = picks[ep.id] || undefined;
      const variant = result?.variants?.find((v) => v.url === variantUrl);
      const payload = {
        url: ep.streamUrl,
        kind: result?.kind,
        title: `${series.title} - ${ep.title}`.slice(0, 200),
        variantUrl,
        qualityLabel: variant?.label,
        sizeBytes: result?.kind === "direct" ? (result.sizeBytes ?? undefined) : undefined,
        segmentCount: result?.kind === "hls" ? result.segmentCount : undefined,
      };
      setStartingId(ep.id);
      try {
        const res = await fetch("/api/downloads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || ui.couldNotStart);
        toast.success(ui.downloadStarted, {
          description: `${series.title} - ${ep.title}`,
        });
        queryClient.invalidateQueries({ queryKey: ["downloads"] });
        onStarted?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : ui.couldNotStart);
      } finally {
        setStartingId(null);
      }
    },
    [epStates, picks, series.title, queryClient, onStarted, ui],
  );


  return (
    <div className="animate-in fade-in slide-in-from-top-2 space-y-4 rounded-lg border border-emerald-600/30 bg-emerald-500/5 p-3 sm:p-4">
      {/* Series header */}
      <div className="flex gap-4">
        <div className="relative hidden w-24 shrink-0 overflow-hidden rounded-md border bg-muted/60 sm:block">
          {posterSrc && !posterFailed ? (
            <img
              src={posterSrc}
              alt={`Poster of ${series.title}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="size-full object-cover"
              onError={() => {
                if (posterRetryCount < 1) setPosterRetryCount(1);
                else setPosterFailed(true);
              }}
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground/50">
              <Tv className="size-7" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold leading-tight">
              <Tv className="size-4 shrink-0 text-emerald-500" />
              <span className="line-clamp-2">{series.title}</span>
            </h3>
            {onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground"
                onClick={onDismiss}
                aria-label={ui.dismiss}
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
          {series.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {series.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {series.seriesType && <Badge variant="outline" className="capitalize">{series.seriesType}</Badge>}
            <Badge variant="secondary">
              {tf(ui.episodes, { count: episodes.length })}
            </Badge>
            {drmCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="size-3" />
                {tf(ui.premiumCount, { count: drmCount })}
              </Badge>
            )}
            <a
              href={series.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="ms-1 inline-flex items-center gap-1 text-[11px] text-emerald-500 hover:underline"
            >
              {ui.openOnAry}
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {allProtected ? (
        <Alert>
          <Lock className="size-4" />
          <AlertTitle>{ui.premiumTitle}</AlertTitle>
          <AlertDescription>
            {ui.premiumText}
          </AlertDescription>
        </Alert>
      ) : (
        <p className="text-xs text-muted-foreground">
          {ui.pickEpisode}
        </p>
      )}

      {/* Episode cards */}
      {!allProtected && (
        <>
          <Separator className="opacity-60" />
          <div className="scrollbar-thin max-h-[640px] w-full overflow-y-auto pe-1">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Episodes">
              {episodes.map((ep, idx) => {
                const isOpen = expandedId === ep.id;
                const locked = ep.drm || !ep.streamUrl;
                const st = epStates[ep.id] ?? { phase: "idle" as const };
                const duration =
                  ep.durationSeconds ?? (st.phase === "ready" ? st.result.totalDuration : null) ?? null;
                const picked =
                  st.phase === "ready"
                    ? (st.variants.find((v) => v.url === picks[ep.id]) ?? st.variants[0])
                    : undefined;
                const pickedSize = picked ? (picked.sizeBytes ?? estimateSize(picked.bandwidth, duration)) : null;
                return (
                  <li key={ep.id} className={isOpen ? "sm:col-span-2" : undefined}>
                    <div
                      className={`overflow-hidden rounded-xl border bg-card/70 transition-colors ${
                        isOpen
                          ? "border-emerald-600/50 shadow-lg shadow-emerald-900/10"
                          : "border-border/60 hover:border-emerald-600/30"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleEpisode(ep)}
                        disabled={locked}
                        aria-expanded={isOpen}
                        className={`flex w-full gap-3 p-2 text-start disabled:cursor-not-allowed disabled:opacity-60 ${isOpen ? "flex-col sm:flex-row sm:items-center" : "items-center"}`}
                      >
                        <EpisodeThumb
                          src={ep.imageUrl}
                          alt={ep.title}
                          number={ep.episodeNumber ?? idx + 1}
                          duration={duration}
                          large={isOpen}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="line-clamp-2 text-sm font-medium leading-snug" title={ep.title}>
                            {ep.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{series.title}</p>
                          {locked ? (
                            <Badge variant="secondary" className="gap-1 text-[10px]">
                              <Lock className="size-3" />
                              {ui.premium}
                            </Badge>
                          ) : picked ? (
                            <div className="flex flex-wrap gap-1">
                              <Badge className="bg-emerald-600/15 text-[10px] text-emerald-500">
                                {picked.label}
                              </Badge>
                              {pickedSize ? (
                                <Badge variant="secondary" className="text-[10px]">
                                  ~{formatBytes(pickedSize)}
                                </Badge>
                              ) : null}
                            </div>
                          ) : (
                            <p className="text-[11px] text-emerald-500">
                              {isOpen ? ui.loadingQualities : ui.tapToChoose}
                            </p>
                          )}
                        </div>
                        {!locked && (
                          <ChevronDown
                            className={`me-1 size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>

                      {isOpen && !locked && (
                        <div className="space-y-3 border-t border-border/60 bg-background/40 p-3">
                          {st.phase === "loading" || st.phase === "idle" ? (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {[0, 1, 2].map((k) => (
                                <Skeleton key={k} className="h-[68px] rounded-lg" />
                              ))}
                            </div>
                          ) : st.phase === "error" ? (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-xs text-destructive">{st.message}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 text-xs"
                                onClick={() => void analyzeEpisode(ep, true)}
                              >
                                <RotateCcw className="size-3" />
                                {ui.retry}
                              </Button>
                            </div>
                          ) : (
                            <>
                              {st.variants.length > 0 ? (
                                <QualityTiles
                                  ariaLabel={`${ui.quality} - ${ep.title}`}
                                  value={picked?.url}
                                  onChange={(v) => setPicks((prev) => ({ ...prev, [ep.id]: v }))}
                                  options={st.variants.map((v) => ({
                                    value: v.url,
                                    label: v.label,
                                    sizeBytes: v.sizeBytes ?? estimateSize(v.bandwidth, duration),
                                  }))}
                                />
                              ) : (
                                <p className="text-xs text-muted-foreground">{ui.standardQuality}</p>
                              )}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {picked
                                    ? `${picked.label}${pickedSize ? ` - ${tf(ui.about, { size: formatBytes(pickedSize) })}` : ""}`
                                    : ""}
                                  {duration ? ` - ${formatDuration(duration)}` : ""}
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() => void startDownload(ep)}
                                  disabled={startingId === ep.id}
                                  className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500"
                                >
                                  {startingId === ep.id ? (
                                    <>
                                      <Loader2 className="size-3.5 animate-spin" />
                                      {ui.starting}
                                    </>
                                  ) : (
                                    <>
                                      <DownloadIcon className="size-3.5" />
                                      {picked ? tf(ui.downloadQuality, { quality: picked.label }) : ui.download}
                                    </>
                                  )}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
