import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";
import { ContentPage, Section, Sections } from "@/components/site/content-page";
import type { Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import { pageContext } from "@/i18n/page";
import { Rich } from "@/i18n/rich";
import { pageMetadata } from "@/i18n/seo";
import { guideMeta, guideSlugs } from "@/lib/guides";
import { site } from "@/lib/site";

type Params = { params: Promise<{ lang: string; slug: string }> };

// Only the guides in lib/guides.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

async function load(params: Params["params"]) {
  const { slug } = await params;
  const { lang, dict } = await pageContext(params);
  const guide = dict.guides.find((g) => g.slug === slug);
  if (!guide) notFound();
  return { lang, dict, guide, image: guideMeta.find((g) => g.slug === slug)?.image };
}

export async function generateMetadata({ params }: Params) {
  const { lang, guide } = await load(params);
  return pageMetadata(lang, `/${guide.slug}`, guide.metaTitle, guide.description);
}

export default async function GuidePage({ params }: Params) {
  const { lang, dict, guide, image } = await load(params);
  const url = `${site.url}${localePath(lang, `/${guide.slug}`)}`;
  const related = dict.guides.filter((g) => g.slug !== guide.slug).slice(0, 4);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.h1,
      description: guide.description,
      inLanguage: lang,
      url,
      mainEntityOfPage: url,
      image: image ? `${site.url}${image}` : `${site.url}/opengraph-image`,
      datePublished: site.lastUpdated,
      dateModified: site.lastUpdated,
      author: { "@type": "Organization", name: site.name, url: site.url },
      publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: guide.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <ContentPage lang={lang} dict={dict} path={`/${guide.slug}`} title={guide.h1} intro={guide.intro} schema={schema}>
      {image && (
        <Image src={image} alt={guide.imageAlt ?? guide.h1} width={480} height={300} priority className="h-auto w-full max-w-xl rounded-xl border border-border/60" />
      )}
      <CtaBox lang={lang} dict={dict} />
      <Sections sections={guide.sections} lang={lang} />
      <Section title={dict.common.faqTitle}>
        <div className="space-y-4">
          {guide.faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1 text-foreground/80">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBox lang={lang} dict={dict} />
      <Section title={dict.common.moreGuides}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((g) => (
            <li key={g.slug}>
              <Link
                href={localePath(lang, `/${g.slug}`)}
                className="flex min-h-12 items-center justify-between gap-2 rounded-lg border border-border/60 px-4 py-3 text-sm hover:border-emerald-600/50"
              >
                {g.label}
                <ArrowRight className="size-4 shrink-0 text-emerald-500 rtl:rotate-180" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </ContentPage>
  );
}

function CtaBox({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-600/40 bg-emerald-600/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm">
        <Rich text={dict.common.ready} lang={lang} />
      </p>
      <Link
        href={localePath(lang, "/")}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        <Download className="size-4" />
        {dict.common.openDownloader}
      </Link>
    </div>
  );
}
