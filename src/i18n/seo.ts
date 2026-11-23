import type { Metadata } from "next";
import { site } from "@/lib/site";
import { localeInfo, localePath, locales, type Locale } from "./config";

/** Canonical URL for this language plus hreflang links to every language version. */
export function alternatesFor(lang: Locale, path: string, onlyLangs: readonly Locale[] = locales): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of onlyLangs) languages[l] = `${site.url}${localePath(l, path)}`;
  languages["x-default"] = `${site.url}${localePath("en", path)}`;
  return { canonical: `${site.url}${localePath(lang, path)}`, languages };
}

/** Title, description, canonical/hreflang and social cards for a page. */
export function pageMetadata(lang: Locale, path: string, title: string, description: string): Metadata {
  const url = `${site.url}${localePath(lang, path)}`;
  return {
    title,
    description,
    alternates: alternatesFor(lang, path),
    openGraph: { title: `${title} | ${site.name}`, description, url, type: "article", locale: localeInfo[lang].og },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}
