import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import type { BlogEntry } from "@/lib/blog-store";

/** Blog post teaser with its generated cover image. */
export function PostCard({ lang, post, categoryLabel, showExcerpt = true }: { lang: Locale; post: BlogEntry; categoryLabel: string; showExcerpt?: boolean }) {
  const href = localePath(lang, `/blog/${post.slug}`);
  return (
    <Link href={href} className="group block h-full overflow-hidden rounded-xl border border-border/60 bg-card/60 hover:border-emerald-600/50">
      { }
      <img src={`${href}/opengraph-image`} alt="" width={1200} height={630} loading="lazy" className="h-auto w-full" />
      <div className="space-y-1.5 p-4" lang={post.lang}>
        <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-500">{categoryLabel}</p>
        <h3 className="text-sm font-semibold leading-snug group-hover:text-emerald-500">{post.title}</h3>
        {showExcerpt && <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
