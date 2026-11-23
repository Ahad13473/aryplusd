"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

interface I18nValue {
  lang: Locale;
  dir: "ltr" | "rtl";
  ui: Dictionary["ui"];
  videoSteps: string[];
  videoChapters: string[];
}

const I18nContext = createContext<I18nValue | null>(null);

/** Gives client components their language and interface strings (only the small `ui` part is sent). */
export function I18nProvider({ value, children }: { value: I18nValue; children: ReactNode }) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(I18nContext);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}

/** Client-side {placeholder} filler (same rules as fmt on the server). */
export function tf(text: string, vars: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
