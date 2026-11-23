"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { tutorialVideos, type VideoLang } from "@/lib/video";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Narrated tutorial with an English/Urdu switch, subtitles, chapters and the steps as text. */
export function VideoGuide() {
  const ref = useRef<HTMLVideoElement>(null);
  const i18n = useI18n();
  // Urdu pages default to the Urdu voice; everything else starts in English.
  const [lang, setLang] = useState<VideoLang>(i18n.lang === "ur" ? "ur" : "en");
  const v = tutorialVideos[lang];

  const seek = (t: number) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = t;
    void el.play().catch(() => undefined);
  };

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label={i18n.ui.videoLanguage} className="inline-flex rounded-lg bg-muted p-1">
        {(Object.keys(tutorialVideos) as VideoLang[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={lang === key}
            onClick={() => setLang(key)}
            className={`min-h-10 rounded-md px-4 text-sm font-medium transition-colors ${
              lang === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tutorialVideos[key].label}
          </button>
        ))}
      </div>

      <video
        key={lang}
        ref={ref}
        controls
        playsInline
        preload="metadata"
        poster={v.poster}
        width={1280}
        height={720}
        className="aspect-video h-auto w-full rounded-xl border border-border/60 bg-black"
        aria-label={v.title}
      >
        <source src={v.src} type="video/mp4" />
        <track kind="subtitles" src={v.captions} srcLang={lang} label={v.label} />
      </video>

      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label={i18n.ui.videoChapters}>
        {v.chapters.map((c, i) => (
          <li key={c.start}>
            <button
              type="button"
              onClick={() => seek(c.start)}
              className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-start text-xs hover:border-emerald-600/50"
            >
              <Play className="size-3.5 shrink-0 text-emerald-500 rtl:rotate-180" />
              <span className="font-mono text-muted-foreground" dir="ltr">
                {fmt(c.start)}
              </span>
              <span className="font-medium">{i18n.videoChapters[i] ?? c.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <details className="group rounded-xl border border-border/60 bg-card/60 p-4" open>
        <summary className="cursor-pointer list-none font-semibold">
          {i18n.ui.stepsHeading}
        </summary>
        <ol
          className="mt-3 list-decimal space-y-2 ps-5 text-sm leading-relaxed text-foreground/85"
        >
          {i18n.videoSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
