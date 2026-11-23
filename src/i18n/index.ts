import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

/** Each language is loaded only by the pages that need it. */
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./dictionaries/en"),
  ur: () => import("./dictionaries/ur"),
  ar: () => import("./dictionaries/ar"),
  hi: () => import("./dictionaries/hi"),
  bn: () => import("./dictionaries/bn"),
  pa: () => import("./dictionaries/pa"),
  ps: () => import("./dictionaries/ps"),
  fa: () => import("./dictionaries/fa"),
  tr: () => import("./dictionaries/tr"),
  id: () => import("./dictionaries/id"),
};

export async function getDictionary(lang: Locale): Promise<Dictionary> {
  return (await loaders[lang]()).default;
}

/** Fill {placeholders}: fmt("Hi {name}", { name: "A" }). */
export function fmt(text: string, vars: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export type { Dictionary };
