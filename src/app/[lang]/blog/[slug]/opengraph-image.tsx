import { ImageResponse } from "next/og";
import { BlogCoverArt } from "@/components/site/blog-cover";
import { isLocale } from "@/i18n/config";
import { getPost, posts } from "@/lib/blog";
import { findPost } from "@/lib/blog-store";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ARYPlusD blog article cover";
export const revalidate = 60;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/** Cover image for each post - also used as its share card. */
export default async function Cover({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const post = isLocale(lang) ? await findPost(lang, slug) : undefined;
  // Cover text is drawn with a Latin font: non-Latin titles use the English original's title.
  const latin = (s: string) => /^[\u0000-\u024F–—‘’“”]*$/.test(s);
  const english = getPost(slug)?.title;
  const title = post && latin(post.title) ? post.title : (english ?? "ARYPlusD Blog");
  return new ImageResponse(
    <BlogCoverArt kicker={post && latin(post.coverKicker) ? post.coverKicker : "BLOG"} title={title} category={post && latin(post.category) ? post.category : ""} />,
    size,
  );
}
