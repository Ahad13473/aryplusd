import { listPosts } from "@/lib/blog-store";
import { site } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** RSS feed so readers, aggregators and search engines pick up new posts quickly. */
export const revalidate = 300;

export async function GET() {
  const items = (await listPosts("en"))
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}${p.lang === "en" ? "" : `/${p.lang}`}/blog/${p.slug}</link>
      <guid>${site.url}${p.lang === "en" ? "" : `/${p.lang}`}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name} Blog</title>
    <link>${site.url}/blog</link>
    <description>ARY drama lists, guides and tips for watching offline.</description>
    <language>en</language>
    <atom:link href="${site.url}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
