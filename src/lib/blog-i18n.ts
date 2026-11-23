import type { Locale } from "@/i18n/config";
import type { Post, PostSection } from "@/lib/blog";

/**
 * A built-in article translated into another language. Date, category, cover
 * and link target come from the English original in lib/blog.ts; only the text
 * is translated. Section, list and FAQ counts mirror the original.
 */
export interface PostText {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  keywords: string;
  sections: PostSection[];
  faqs?: { q: string; a: string }[];
  ctaLabel?: string;
}

type Part = { default: PostText[] };
const both = (a: Promise<Part>, b: Promise<Part>) => Promise.all([a, b]).then(([x, y]) => [...x.default, ...y.default]);

// Each language is split in two files (articles 1-8 and 9-16) to keep them editable.
const loaders: Record<Exclude<Locale, "en">, () => Promise<PostText[]>> = {
  ur: () => both(import("./blog-translations/ur-a"), import("./blog-translations/ur-b")),
  ar: () => both(import("./blog-translations/ar-a"), import("./blog-translations/ar-b")),
  hi: () => both(import("./blog-translations/hi-a"), import("./blog-translations/hi-b")),
  bn: () => both(import("./blog-translations/bn-a"), import("./blog-translations/bn-b")),
  pa: () => both(import("./blog-translations/pa-a"), import("./blog-translations/pa-b")),
  ps: () => both(import("./blog-translations/ps-a"), import("./blog-translations/ps-b")),
  fa: () => both(import("./blog-translations/fa-a"), import("./blog-translations/fa-b")),
  tr: () => both(import("./blog-translations/tr-a"), import("./blog-translations/tr-b")),
  id: () => both(import("./blog-translations/id-a"), import("./blog-translations/id-b")),
};

const cache = new Map<Locale, Promise<Map<string, PostText>>>();

/** All translated built-in articles for a language, by slug (empty for English). */
export function translationsFor(lang: Locale): Promise<Map<string, PostText>> {
  if (lang === "en") return Promise.resolve(new Map());
  let hit = cache.get(lang);
  if (!hit) {
    hit = loaders[lang]().then((list) => new Map(list.map((t) => [t.slug, t])));
    cache.set(lang, hit);
  }
  return hit;
}

/** The English article with its text swapped for the translation. */
export function applyTranslation(post: Post, t: PostText): Post {
  return {
    ...post,
    title: t.title,
    metaTitle: t.metaTitle,
    description: t.description,
    excerpt: t.excerpt,
    keywords: t.keywords,
    sections: t.sections,
    faqs: t.faqs ?? post.faqs,
    cta: post.cta && t.ctaLabel ? { ...post.cta, label: t.ctaLabel } : post.cta,
  };
}
