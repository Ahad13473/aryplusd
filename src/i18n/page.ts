import { notFound } from "next/navigation";
import { getDictionary } from "./index";
import { isLocale, locales } from "./config";

/** Resolve the [lang] route param and load its dictionary (404 for unknown languages). */
export async function pageContext(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang, dict: await getDictionary(lang) };
}

/** Pre-render every page in every language. */
export function langParams() {
  return locales.map((lang) => ({ lang }));
}

export type LangParams = { params: Promise<{ lang: string }> };
