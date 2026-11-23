"use client";

import { tf, useI18n } from "@/i18n/client";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Search, Tv } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useOnSaved } from "@/hooks/use-auto-save";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AryPlusPanel } from "@/components/downloader/aryplus-panel";
import type { AryPlusAnalysis, AryPlusSearchItem } from "@/lib/types";

interface AryPlusSearchProps {
  onStarted?: () => void;
}

export function AryPlusSearch({ onStarted }: AryPlusSearchProps) {
  const { ui } = useI18n();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AryPlusSearchItem[] | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AryPlusAnalysis | null>(null);
  const [posterRetries, setPosterRetries] = useState<Record<string, number>>({});
  const [posterFailed, setPosterFailed] = useState<Record<string, boolean>>({});

  // Once the video is on the device, clear the search for the next one.
  const reset = useCallback(() => {
    setQuery("");
    setResults(null);
    setAnalysis(null);
    setError(null);
  }, []);
  useOnSaved(reset);

  const posterSrcFor = useCallback(
    (item: AryPlusSearchItem) => {
      if (!item.posterUrl || posterFailed[item.id]) return null;
      const n = posterRetries[item.id] ?? 0;
      if (n === 0) return item.posterUrl;
      const sep = item.posterUrl.includes("?") ? "&" : "?";
      return `${item.posterUrl}${sep}r=${n}`;
    },
    [posterRetries, posterFailed],
  );

  const onPosterError = useCallback(
    (item: AryPlusSearchItem) => {
      const n = posterRetries[item.id] ?? 0;
      if (n < 1) {
        setPosterRetries((prev) => ({ ...prev, [item.id]: n + 1 }));
      } else {
        setPosterFailed((prev) => ({ ...prev, [item.id]: true }));
      }
    },
    [posterRetries],
  );

  const runSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      setError(ui.searchFirst);
      return;
    }
    setSearching(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/aryplus/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = (await res.json()) as { results?: AryPlusSearchItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || ui.searchFailed);
      setResults(data.results ?? []);
      if ((data.results?.length ?? 0) === 0) {
        toast.info(ui.noMatches, { description: ui.noMatchesHint });
      }
    } catch (err) {
      setResults(null);
      const message = err instanceof Error ? err.message : ui.searchFailed;
      setError(message);
      toast.error(message);
    } finally {
      setSearching(false);
    }
  }, [query, ui]);

  const pick = useCallback(async (item: AryPlusSearchItem) => {
    setResolvingId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/aryplus/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: item.id }),
      });
      const data = (await res.json()) as AryPlusAnalysis & { error?: string };
      if (!res.ok) throw new Error(data.error || ui.loadFailed);
      setAnalysis(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : ui.loadFailed;
      setError(message);
      toast.error(message);
    } finally {
      setResolvingId(null);
    }
  }, [ui]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !searching) void runSearch();
          }}
          placeholder={ui.searchPlaceholder}
          className="text-sm"
          aria-label={ui.searchLabel}
        />
        <Button
          onClick={() => void runSearch()}
          disabled={searching || !query.trim()}
          className="bg-emerald-600 text-white hover:bg-emerald-500 sm:w-36"
        >
          {searching ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {ui.searching}
            </>
          ) : (
            <>
              <Search className="size-4" />
              {ui.search}
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {analysis ? (
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground"
            onClick={() => setAnalysis(null)}
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            {ui.backToResults}
          </Button>
          <AryPlusPanel key={analysis.series.id} analysis={analysis} onStarted={onStarted} />
        </div>
      ) : searching ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
          ))}
        </div>
      ) : results && results.length > 0 ? (
        <div className="scrollbar-thin max-h-96 w-full overflow-y-auto pe-1">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void pick(item)}
                disabled={resolvingId === item.id}
                className="group overflow-hidden rounded-lg border border-border/60 bg-card/60 text-start transition-colors hover:border-emerald-600/50 hover:bg-accent focus-visible:border-emerald-600"
                aria-label={`Load ${item.title}`}
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted/60">
                  {posterSrcFor(item) ? (
                    <img
                      src={posterSrcFor(item) as string}
                      alt={`Poster of ${item.title}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => onPosterError(item)}
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-muted-foreground/50">
                      <Tv className="size-7" />
                    </div>
                  )}
                  {resolvingId === item.id && (
                    <div className="absolute inset-0 grid place-items-center bg-background/70">
                      <Loader2 className="size-6 animate-spin text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-2">
                  <p className="line-clamp-2 min-h-[2rem] text-xs font-medium leading-snug">
                    {item.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1">
                    {item.seriesType && (
                      <Badge variant="outline" className="px-1.5 py-0 text-[10px] capitalize">
                        {item.seriesType}
                      </Badge>
                    )}
                    {item.episodeCount ? (
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                        {tf(ui.episodesShort, { count: item.episodeCount })}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : results && results.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
          {ui.noMatches}
        </p>
      ) : null}
    </div>
  );
}
