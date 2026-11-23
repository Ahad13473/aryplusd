import Link from "next/link";
import { ContentPage } from "@/components/site/content-page";
import { PostCard } from "@/components/site/post-card";
import { localePath } from "@/i18n/config";
import { pageContext, type LangParams } from "@/i18n/page";
import { pageMetadata } from "@/i18n/seo";
import { listPosts } from "@/lib/blog-store";
import { site } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const meta = pageMetadata(lang, "/blog", dict.pages.blog.title, dict.pages.blog.description);
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": `${site.url}/blog/rss.xml` } } };
}

export default async function BlogIndex({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const b = dict.pages.blog;
  const posts = await listPosts(lang);
  const [featured, ...rest] = posts;
  const cat = (c: string) => b.categories[c as keyof typeof b.categories] ?? c;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} ${b.title}`,
    url: `${site.url}${localePath(lang, "/blog")}`,
    description: b.description,
    inLanguage: lang,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      inLanguage: p.lang,
      url: `${site.url}${localePath(p.lang, `/blog/${p.slug}`)}`,
      datePublished: p.date,
    })),
  };
  return (
    <ContentPage lang={lang} dict={dict} path="/blog" title={b.title} intro={b.intro} schema={[schema]}>
      {featured && (
        <Link
          href={localePath(lang, `/blog/${featured.slug}`)}
          className="group grid overflow-hidden rounded-xl border border-border/60 bg-card/60 hover:border-emerald-600/50 md:grid-cols-2"
        >
          { }
          <img src={`${localePath(lang, `/blog/${featured.slug}`)}/opengraph-image`} alt="" width={1200} height={630} className="h-auto w-full" />
          <div className="space-y-2 p-5" lang={featured.lang}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-500">
              {b.latest} · {cat(featured.category)}
            </p>
            <h2 className="text-lg font-semibold leading-snug group-hover:text-emerald-500">{featured.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
          </div>
        </Link>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {rest.map((p) => (
          <li key={p.slug}>
            <PostCard lang={lang} post={p} categoryLabel={cat(p.category)} />
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
