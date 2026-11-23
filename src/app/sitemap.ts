import type { MetadataRoute } from "next";
import { localePath, locales } from "@/i18n/config";
import { listPosts } from "@/lib/blog-store";
import { guideSlugs } from "@/lib/guides";
import { site } from "@/lib/site";
import { tutorialVideos, uploadDate } from "@/lib/video";

export const revalidate = 3600;

const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/how-to-use", priority: 0.9, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  ...guideSlugs.map((s) => ({ path: `/${s}`, priority: 0.8, changeFrequency: "monthly" as const })),
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

const abs = (lang: (typeof locales)[number], path: string) => `${site.url}${localePath(lang, path)}`;

/** Every page in all 10 languages, each entry listing its translations (hreflang). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date(site.lastUpdated);
  const videos = Object.values(tutorialVideos).map((v) => ({
    title: v.title,
    thumbnail_loc: `${site.url}${v.poster}`,
    description: v.description,
    content_loc: `${site.url}${v.src}`,
    duration: v.seconds,
    publication_date: uploadDate,
  }));

  const pages = PAGES.flatMap((p) =>
    locales.map((lang) => ({
      url: abs(lang, p.path),
      lastModified,
      changeFrequency: p.changeFrequency,
      priority: lang === "en" ? p.priority : Math.round(p.priority * 90) / 100,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, abs(l, p.path)])) },
      ...(p.path === "/" || p.path === "/how-to-use" ? { videos } : {}),
    })),
  );

  // Articles are listed once, in the language they are written in.
  const seen = new Set<string>();
  const articles = (await Promise.all(locales.map((l) => listPosts(l))))
    .flat()
    .filter((p) => !seen.has(`${p.lang}/${p.slug}`) && (seen.add(`${p.lang}/${p.slug}`), true))
    .map((p) => ({
      url: abs(p.lang, `/blog/${p.slug}`),
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [`${abs(p.lang, `/blog/${p.slug}`)}/opengraph-image`],
      ...(p.langs.length > 1 ? { alternates: { languages: Object.fromEntries(p.langs.map((l) => [l, abs(l, `/blog/${p.slug}`)])) } } : {}),
    }));

  return [...pages, ...articles];
}
