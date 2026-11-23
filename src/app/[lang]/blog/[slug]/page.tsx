import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { ContentPage, Section } from "@/components/site/content-page";
import { PostCard } from "@/components/site/post-card";
import { fmt } from "@/i18n";
import { localePath } from "@/i18n/config";
import { pageContext } from "@/i18n/page";
import { Rich } from "@/i18n/rich";
import { alternatesFor, pageMetadata } from "@/i18n/seo";
import { posts } from "@/lib/blog";
import { findPost, listPosts, readingMinutes } from "@/lib/blog-store";
import { site } from "@/lib/site";

type Params = { params: Promise<{ lang: string; slug: string }> };

// Built-in articles are pre-rendered; admin articles render on first visit and refresh every minute.
export const revalidate = 60;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

async function load(params: Params["params"]) {
  const { slug } = await params;
  const { lang, dict } = await pageContext(params);
  const post = await findPost(lang, slug);
  if (!post) notFound();
  return { lang, dict, post };
}

export async function generateMetadata({ params }: Params) {
  const { lang, post } = await load(params);
  const meta = pageMetadata(lang, `/blog/${post.slug}`, post.metaTitle, post.description);
  return {
    ...meta,
    // Point search engines at every language this article is written in.
    alternates: alternatesFor(post.lang, `/blog/${post.slug}`, post.langs),
    ...(post.keywords ? { keywords: post.keywords.split(",").map((k) => k.trim()).filter(Boolean) } : {}),
    openGraph: { ...meta.openGraph, type: "article" as const, publishedTime: post.date, section: post.category },
  };
}

export default async function PostPage({ params }: Params) {
  const { lang, dict, post } = await load(params);
  const b = dict.pages.blog;
  const cat = (c: string) => b.categories[c as keyof typeof b.categories] ?? c;
  const href = localePath(lang, `/blog/${post.slug}`);
  const canonical = `${site.url}${localePath(post.lang, `/blog/${post.slug}`)}`;
  const minutes = readingMinutes(post);
  const related = (await listPosts(lang)).filter((p) => p.slug !== post.slug).slice(0, 3);
  const date = new Date(post.date).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" });

  const schema: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      inLanguage: post.lang,
      url: canonical,
      mainEntityOfPage: canonical,
      image: `${canonical}/opengraph-image`,
      datePublished: post.date,
      dateModified: post.date,
      articleSection: post.category,
      ...(post.keywords ? { keywords: post.keywords } : {}),
      wordCount: minutes * 200,
      author: { "@type": "Organization", name: `${site.name} Editorial`, url: site.url },
      publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
    },
  ];
  if (post.faqs?.length) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: post.lang,
      mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }

  return (
    <ContentPage lang={lang} dict={dict} path={`/blog/${post.slug}`} parent={{ href: "/blog", label: dict.nav.blog }} title={post.title} intro={post.excerpt} schema={schema}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="rounded-full bg-emerald-600/15 px-2.5 py-0.5 font-medium text-emerald-500">{cat(post.category)}</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3.5" />
          <time dateTime={post.date}>{date}</time>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {fmt(b.minRead, { n: minutes })}
        </span>
      </div>

      {post.lang !== lang && <p className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">{b.englishNote}</p>}

      { }
      <img src={`${href}/opengraph-image`} alt={post.title} width={1200} height={630} className="h-auto w-full rounded-xl border border-border/60" />

      <div className="space-y-8" lang={post.lang} dir={post.lang === lang ? undefined : "auto"}>
        {post.sections.map((s, i) => (
          <Section key={`${i}-${s.h2}`} title={s.h2}>
            {s.body.map((p) => (
              <p key={p.slice(0, 40)}>
                <Rich text={p} lang={lang} />
              </p>
            ))}
            {s.list && (
              <ul className="list-disc space-y-1.5 ps-5">
                {s.list.map((li) => (
                  <li key={li}>
                    <Rich text={li} lang={lang} />
                  </li>
                ))}
              </ul>
            )}
          </Section>
        ))}

        {post.faqs?.length ? (
          <Section title={dict.common.faqTitle}>
            <div className="space-y-4">
              {post.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="mt-1 text-foreground/80">{f.a}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}
      </div>

      {post.cta && (
        <Link
          href={localePath(lang, post.cta.href)}
          className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-emerald-600/40 bg-emerald-600/10 px-4 py-3 text-sm font-semibold hover:bg-emerald-600/15"
        >
          <span lang={post.lang}>{post.cta.label}</span>
          <ArrowRight className="size-4 shrink-0 text-emerald-500 rtl:rotate-180" />
        </Link>
      )}

      <Section title={b.keepReading}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {related.map((p) => (
            <li key={p.slug}>
              <PostCard lang={lang} post={p} categoryLabel={cat(p.category)} showExcerpt={false} />
            </li>
          ))}
        </ul>
      </Section>
    </ContentPage>
  );
}
