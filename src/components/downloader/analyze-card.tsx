"use client";

import { tf, useI18n } from "@/i18n/client";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Download,
  FileVideo,
  Clipboard,
  Loader2,
  Search,
  Tv,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AryPlusPanel } from "@/components/downloader/aryplus-panel";
import { AryPlusSearch } from "@/components/downloader/aryplus-search";
import { estimateSize, QualityTiles, type QualityOption } from "@/components/downloader/quality-tiles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOnSaved } from "@/hooks/use-auto-save";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes, formatDuration } from "@/lib/format";
import type { AnalysisResult, AnalyzeResponse, AryPlusAnalysis } from "@/lib/types";
import { isAryPlusAnalysis } from "@/lib/types";

interface AnalyzeCardProps {
  onStarted?: () => void;
}

export function AnalyzeCard({ onStarted }: AnalyzeCardProps) {
  const { ui } = useI18n();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [ary, setAry] = useState<AryPlusAnalysis | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [title, setTitle] = useState("");


  // Once the video is on the device, start fresh for the next one.
  const reset = useCallback(() => {
    setUrl("");
    setAnalysis(null);
    setAry(null);
    setError(null);
    setTitle("");
  }, []);
  useOnSaved(reset);

  const runAnalyze = useCallback(async () => {
    if (!url.trim()) {
      setError(ui.pasteFirst);
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = (await res.json()) as AnalyzeResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || ui.analysisFailed);
      }
      setAnalysis(null);
      setAry(null);
      if (isAryPlusAnalysis(data)) {
        setAry(data);
        toast.success(tf(ui.foundSeries, { title: data.series.title, count: data.episodes.length }));
      } else {
        setAnalysis(data);
        setSelectedVariant(data.variants?.[0]?.url ?? "");
        setTitle(data.title);
        toast.success(ui.videoFound);
      }
    } catch (err) {
      setAnalysis(null);
      setAry(null);
      const message = err instanceof Error ? err.message : ui.analysisFailed;
      setError(message);
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  }, [url, ui]);

  const startDownload = useCallback(async () => {
    if (!analysis) return;
    setStarting(true);
    try {
      const payload = {
        url: analysis.finalUrl,
        kind: analysis.kind,
        title,
        variantUrl: selectedVariant || undefined,
        qualityLabel:
          analysis.kind === "hls"
            ? (analysis.variants?.find((v) => v.url === selectedVariant)?.label ?? undefined)
            : undefined,
        sizeBytes: analysis.kind === "direct" ? analysis.sizeBytes : undefined,
        segmentCount: analysis.kind === "hls" ? analysis.segmentCount : undefined,
      };
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || ui.couldNotStart);
      // Keep the result on screen until the file is saved (see reset) so the page does not jump.
      toast.success(ui.downloadStarted, { description: title || ui.downloadStartedHint });
      queryClient.invalidateQueries({ queryKey: ["downloads"] });
      onStarted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : ui.couldNotStart);
    } finally {
      setStarting(false);
    }
  }, [analysis, title, selectedVariant, queryClient, onStarted, ui]);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      toast.error(ui.clipboardDenied);
    }
  }, [ui]);

  return (
    <Card className="w-full border-border/60 bg-card/80 shadow-xl shadow-black/20 backdrop-blur">
      <CardHeader className="px-4 pb-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="size-4 text-emerald-500" />
          {ui.findVideo}
        </CardTitle>
        <CardDescription>
          {ui.findVideoHint}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-3 sm:px-6">
        <Tabs defaultValue="link">
          <TabsList className="h-11 w-full sm:h-9 sm:w-fit">
            <TabsTrigger value="link" className="flex-1 gap-1.5 sm:flex-none">
              <Clipboard className="size-3.5" />
              {ui.tabPaste}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1 gap-1.5 sm:flex-none">
              <Tv className="size-3.5" />
              {ui.tabSearch}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !analyzing) void runAnalyze();
              }}
              placeholder={ui.linkPlaceholder}
              className="h-11 pe-11 font-mono text-sm sm:h-9" dir="ltr"
              aria-label={ui.linkLabel}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={pasteFromClipboard}
              className="absolute end-1 top-1/2 size-10 -translate-y-1/2 sm:size-8 text-muted-foreground hover:text-foreground"
              aria-label={ui.pasteClipboard}
            >
              <Clipboard className="size-4" />
            </Button>
          </div>
          <Button
            onClick={() => void runAnalyze()}
            disabled={analyzing || !url.trim()}
            className="h-11 bg-emerald-600 text-white hover:bg-emerald-500 sm:h-9 sm:w-36"
          >
            {analyzing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {ui.analyzing}
              </>
            ) : (
              ui.analyze
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
            <AlertTriangle className="size-4" />
            <AlertTitle>{ui.analysisFailed}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {ary && (
          <AryPlusPanel
            key={ary.series.id}
            analysis={ary}
            onStarted={onStarted}
            onDismiss={() => {
              setAry(null);
              setUrl("");
            }}
          />
        )}

        {analysis && (() => {
          const duration = analysis.totalDuration ?? null;
          const variants = analysis.isMaster ? (analysis.variants ?? []) : [];
          const options: QualityOption[] =
            variants.length > 0
              ? variants.map((v) => ({
                  value: v.url,
                  label: v.label,
                  sizeBytes: v.sizeBytes ?? estimateSize(v.bandwidth, duration),
                }))
              : [
                  {
                    value: "",
                    label: ui.original,
                    name: analysis.ext ? analysis.ext.toUpperCase() : ui.video,
                    sizeBytes: analysis.sizeBytes ?? null,
                  },
                ];
          const picked = options.find((o) => o.value === selectedVariant) ?? options[0];
          return (
            <div className="animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-xl border border-emerald-600/50 bg-card/70 shadow-lg shadow-emerald-900/10">
              <div className="flex items-center gap-3 p-2">
                <div className="relative grid aspect-video w-32 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-700/40 to-muted/60 sm:w-40">
                  <FileVideo className="size-8 text-emerald-400/80" />
                  {duration ? (
                    <span className="absolute bottom-1.5 end-1.5 rounded bg-black/70 px-1.5 py-px font-mono text-[10px] text-white">
                      {formatDuration(duration)}
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="dl-title" className="text-[11px] text-muted-foreground">
                    {ui.saveAs}
                  </Label>
                  <Input
                    id="dl-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-8 font-medium"
                  />
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-emerald-600/15 text-[10px] text-emerald-500">{picked.label}</Badge>
                    {picked.sizeBytes ? (
                      <Badge variant="secondary" className="text-[10px]">
                        ~{formatBytes(picked.sizeBytes)}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 self-start text-muted-foreground"
                  onClick={() => setAnalysis(null)}
                  aria-label={ui.dismiss}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="space-y-3 border-t border-border/60 bg-background/40 p-3">
                <QualityTiles
                  ariaLabel={ui.quality}
                  value={picked.value}
                  onChange={setSelectedVariant}
                  options={options}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {picked.label}
                    {picked.sizeBytes ? ` - ${tf(ui.about, { size: formatBytes(picked.sizeBytes) })}` : ""}
                    {duration ? ` - ${formatDuration(duration)}` : ""}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => void startDownload()}
                    disabled={starting}
                    className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        {ui.starting}
                      </>
                    ) : (
                      <>
                        <Download className="size-3.5" />
                        {tf(ui.downloadQuality, { quality: picked.label })}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
          </TabsContent>

          <TabsContent value="search" className="mt-4">
            <AryPlusSearch onStarted={onStarted} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
