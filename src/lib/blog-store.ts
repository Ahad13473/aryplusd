import { db } from "@/lib/db";
import { getPost as getStaticPost, posts as staticPosts, type Post, type PostSection } from "@/lib/blog";
import { locales, type Locale } from "@/i18n/config";
import { applyTranslation, translationsFor } from "@/lib/blog-i18n";

/** A blog article from either source: built-in (lib/blog.ts, English) or written in the admin panel. */
export interface BlogEntry extends Post {
  /** Language the article text is written in. */
  lang: Locale;
  /** Languages this article exists in (for hreflang). */
  langs: Locale[];
  keywords?: string;
  source: "static" | "db";
}

const CATEGORIES = ["Drama lists", "Drama guides", "Watching tips"] as const;

/** Admin articles use a tiny Markdown: "## Heading", "- list item", blank line between paragraphs. */
export function contentToSections(content: string): PostSection[] {
  const sections: PostSection[] = [];
  let cur: PostSection = { h2: "", body: [] };
  for (const block of content.replace(/\r/g, "").split(/\n{2,}/)) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines[0].startsWith("## ")) {
      if (cur.h2 || cur.body.length || cur.list?.length) sections.push(cur);
      cur = { h2: lines[0].slice(3).trim(), body: [] };
      lines.shift();
      if (!lines.length) continue;
    }
    if (lines.every((l) => l.startsWith("- "))) {
      cur.list = [...(cur.list ?? []), ...lines.map((l) => l.slice(2).trim())];
    } else {
      cur.body.push(lines.join(" "));
    }
  }
  if (cur.h2 || cur.body.length || cur.list?.length) sections.push(cur);
  return sections;
}

type DbPost = Awaited<ReturnType<typeof db.blogPost.findMany>>[number];

function fromDb(p: DbPost): BlogEntry {
  return {
    slug: p.slug,
    title: p.title,
    metaTitle: p.metaTitle || p.title,
    description: p.description,
    excerpt: p.excerpt || p.description,
    category: (CATEGORIES as readonly string[]).includes(p.category) ? (p.category as Post["category"]) : "Drama guides",
    date: p.createdAt.toISOString().slice(0, 10),
    coverKicker: p.coverKicker || "NEW",
    sections: contentToSections(p.content),
    keywords: p.keywords,
    lang: p.lang as Locale,
    langs: [p.lang as Locale],
    source: "db",
  };
}

/** Built-in articles are translated into every language that has a translation file entry. */
async function staticEntry(p: Post, lang: Locale): Promise<BlogEntry> {
  const all = await Promise.all(locales.map(async (l) => [l, (await translationsFor(l)).get(p.slug)] as const));
  const langs = all.filter(([l, t]) => l === "en" || t).map(([l]) => l);
  const t = all.find(([l]) => l === lang)?.[1];
  return t ? { ...applyTranslation(p, t), lang, langs, source: "static" } : { ...p, lang: "en", langs, source: "static" };
}

async function dbPosts(where: { lang?: string; slug?: string }): Promise<DbPost[]> {
  try {
    return await db.blogPost.findMany({ where: { published: true, ...where }, orderBy: { createdAt: "desc" } });
  } catch {
    return []; // database not ready (e.g. first build) - built-in articles still work
  }
}

/** Newest first: articles written in this language, then the English built-in ones. */
export async function listPosts(lang: Locale): Promise<BlogEntry[]> {
  const own = (await dbPosts({ lang })).map(fromDb);
  // Other languages also list English admin articles until they are translated.
  const english = lang === "en" ? [] : (await dbPosts({ lang: "en" })).map(fromDb);
  const builtIn = await Promise.all(staticPosts.map((p) => staticEntry(p, lang)));
  const seen = new Set(own.map((o) => o.slug));
  const all = [...own, ...[...english, ...builtIn].filter((b) => !seen.has(b.slug) && (seen.add(b.slug), true))];
  return all.sort((a, b) => b.date.localeCompare(a.date));
}

/** An article for this language, falling back to the English built-in article with the same slug. */
export async function findPost(lang: Locale, slug: string): Promise<BlogEntry | undefined> {
  const [own] = await dbPosts({ lang, slug });
  if (own) return fromDb(own);
  if (lang !== "en") {
    const [en] = await dbPosts({ lang: "en", slug });
    if (en) return fromDb(en);
  }
  const s = getStaticPost(slug);
  return s ? staticEntry(s, lang) : undefined;
}

export function readingMinutes(post: Pick<Post, "sections">): number {
  const words = post.sections.flatMap((s) => [s.h2, ...s.body, ...(s.list ?? [])]).join(" ").split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}
