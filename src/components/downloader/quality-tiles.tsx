"use client";

import { useI18n } from "@/i18n/client";
import { Check } from "lucide-react";
import { formatBytes } from "@/lib/format";

/** Fallback only: rough size from the peak bitrate when the server could not measure one. */
export function estimateSize(bandwidth: number, seconds: number | null | undefined): number | null {
  if (!bandwidth || !seconds) return null;
  return (bandwidth / 8) * seconds;
}

export function qualityName(label: string, ui: Record<"q4k" | "q2k" | "qFullHd" | "qHd" | "qStandard" | "qSaver" | "qStream", string>): string {
  const h = parseInt(label, 10);
  if (h >= 2160) return ui.q4k;
  if (h >= 1440) return ui.q2k;
  if (h >= 1080) return ui.qFullHd;
  if (h >= 720) return ui.qHd;
  if (h >= 480) return ui.qStandard;
  if (h > 0) return ui.qSaver;
  return ui.qStream;
}

export interface QualityOption {
  value: string;
  label: string;
  /** Second line under the label; defaults to the quality name. */
  name?: string;
  sizeBytes: number | null;
}

/** Selectable quality cards: resolution, friendly name and (estimated) size. */
export function QualityTiles({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: QualityOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  const { ui } = useI18n();
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((o, i) => {
        const active = value === o.value;
        return (
          <button
            key={`${o.value}-${i}`}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative flex min-h-[72px] flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-start transition-colors ${
              active
                ? "border-emerald-500 bg-emerald-600/10 ring-1 ring-emerald-500"
                : "border-border/70 hover:border-emerald-600/40 hover:bg-accent/50"
            }`}
          >
            <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
              {active && <Check className="size-3.5 text-emerald-500" />}
              {o.label}
              {i === 0 && options.length > 1 && (
                <span className="rounded bg-emerald-600 px-1.5 py-px text-[9px] font-semibold uppercase text-white">
                  {ui.best}
                </span>
              )}
            </span>
            <span className="text-[11px] text-muted-foreground">{o.name ?? qualityName(o.label, ui)}</span>
            <span className="text-xs font-medium text-foreground/80">
              {o.sizeBytes ? `~${formatBytes(o.sizeBytes)}` : ui.sizeUnknown}
            </span>
          </button>
        );
      })}
    </div>
  );
}
