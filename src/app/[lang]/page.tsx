import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, Layers, MonitorSmartphone, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { DownloaderForm, DownloadsPanel } from "@/components/home/home-app";
import { JsonLd } from "@/components/site/json-ld";
import { PostCard } from "@/components/site/post-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { VideoGuide } from "@/components/site/video-guide";
import { fmt } from "@/i18n";
import { localePath } from "@/i18n/config";
import { langParams, pageContext, type LangParams } from "@/i18n/page";
import { listPosts } from "@/lib/blog-store";
import { site, stepImages } from "@/lib/site";
import { videoSchema } from "@/lib/video";

export const generateStaticParams = langParams;
// New admin posts show up in "From the drama blog" within a minute.
export const revalidate = 60;

const FEATURE_ICONS = [Sparkles, Gauge, Layers, MonitorSmartphone, Trash2, ShieldCheck];
const DEVICE_LINKS = ["/download-ary-dramas-on-android", "/download-ary-dramas-on-iphone", "/download-ary-dramas-on-pc"];
const QUALITIES = [
  ["240p", "qSaver", "~55 MB"],
  ["480p", "qStandard", "~120 MB"],
  ["720p", "qHd", "~220 MB"],
  ["1080p", "qFullHd", "~440 MB"],
  ["1440p", "q2k", "~650 MB"],
  ["2160p", "q4k", "~1.4 GB"],
] as const;

export default async function Home({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const h = dict.home;
  const posts = (await listPosts(lang)).slice(0, 3);
  const L = (p: string) => localePath(lang, p);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${site.name} - ${dict.meta.tagline}`,
      url: `${site.url}${L("/")}`,
      description: dict.meta.description,
      inLanguage: lang,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Android, iOS, Windows, macOS, Linux",
      browserRequirements: "Requires a modern web browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: h.features.map((f) => f.title),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: h.howHeading,
      inLanguage: lang,
      totalTime: "PT2M",
      tool: { "@type": "HowToTool", name: site.name },
      step: dict.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.text,
        image: `${site.url}${stepImages[i]}`,
        url: `${site.url}${L("/how-to-use")}#step-${i + 1}`,
      })),
    },
    videoSchema(L("/"), "en"),
    videoSchema(L("/"), "ur"),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: dict.faqs.slice(0, 6).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const sectionTitle = "text-2xl font-bold tracking-tight sm:text-3xl";
  const moreLink = "inline-flex min-h-11 items-center gap-1 text-sm text-emerald-500 hover:underline";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dict={dict} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12">
        {/* Hero + downloader */}
        <section className="relative mt-6 overflow-hidden rounded-2xl border border-border/60">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" aria-hidden />
          <div className="relative z-10 space-y-6 px-3 py-7 sm:px-8 sm:py-10">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">{h.h1}</h1>
              <p className="text-sm text-muted-foreground sm:text-base">{h.intro}</p>
            </div>
            <DownloaderForm />
          </div>
        </section>

        <DownloadsPanel />

        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />

        {/* Video tutorial */}
        <section className="mx-auto mt-16 max-w-3xl space-y-4" aria-labelledby="video-heading">
          <div className="space-y-2 text-center">
            <h2 id="video-heading" className={sectionTitle}>
              {h.videoHeading}
            </h2>
            <p className="text-sm text-muted-foreground">{h.videoText}</p>
          </div>
          <VideoGuide />
        </section>

        {/* How it works */}
        <section className="mt-16 space-y-6" aria-labelledby="how-heading">
          <div className="space-y-2 text-center">
            <h2 id="how-heading" className={sectionTitle}>
              {h.howHeading}
            </h2>
            <p className="text-sm text-muted-foreground">{h.howSub}</p>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {dict.steps.map((s, i) => (
              <li key={s.title} className="overflow-hidden rounded-xl border border-border/60 bg-card/60">
                <Image src={stepImages[i]} alt={s.alt} width={480} height={300} className="h-auto w-full" />
                <div className="space-y-1.5 p-4">
                  <h3 className="font-semibold">
                    {i + 1}. {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-center">
            <Link href={L("/how-to-use")} className={moreLink}>
              {dict.common.fullGuide} <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </p>
        </section>

        {/* Features */}
        <section className="mt-16 space-y-6" aria-labelledby="features-heading">
          <h2 id="features-heading" className={`text-center ${sectionTitle}`}>
            {fmt(h.whyHeading, { name: site.name })}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {h.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Sparkles;
              return (
                <li key={f.title} className="space-y-2 rounded-xl border border-border/60 bg-card/60 p-5">
                  <Icon className="size-5 text-emerald-500" aria-hidden />
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Qualities */}
        <section className="mt-16 grid items-center gap-8 md:grid-cols-2" aria-labelledby="quality-heading">
          <div className="space-y-4">
            <h2 id="quality-heading" className={sectionTitle}>
              {h.qualityHeading}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{fmt(h.qualityText, { name: site.name })}</p>
            <table className="w-full overflow-hidden rounded-lg border border-border/60 text-sm">
              <caption className="sr-only">{h.qualityCaption}</caption>
              <thead className="bg-muted/50 text-start text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-start font-medium">{h.colQuality}</th>
                  <th className="px-3 py-2 text-start font-medium">{h.colName}</th>
                  <th className="px-3 py-2 text-end font-medium">{h.colSize}</th>
                </tr>
              </thead>
              <tbody>
                {QUALITIES.map(([q, key, size]) => (
                  <tr key={q} className="border-t border-border/50">
                    <td className="px-3 py-2 font-semibold" dir="ltr">
                      {q}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{dict.ui[key]}</td>
                    <td className="px-3 py-2 text-end tabular-nums" dir="ltr">
                      {size}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Image src="/images/devices.svg" alt={h.devicesAlt} width={640} height={320} className="h-auto w-full rounded-xl" />
        </section>

        {/* Devices */}
        <section className="mt-16 space-y-6" aria-labelledby="devices-heading">
          <div className="space-y-2 text-center">
            <h2 id="devices-heading" className={sectionTitle}>
              {h.devicesHeading}
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground">{fmt(h.devicesText, { name: site.name })}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {h.deviceGuides.map((d, i) => (
              <li key={d.title}>
                <Link href={L(DEVICE_LINKS[i])} className="block h-full space-y-2 rounded-xl border border-border/60 bg-card/60 p-5 transition-colors hover:border-emerald-600/50">
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{d.text}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-emerald-500">
                    {dict.common.readGuide} <ArrowRight className="size-3.5 rtl:rotate-180" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Long-form explainer */}
        <section className="mx-auto mt-16 max-w-3xl space-y-4" aria-labelledby="about-heading">
          <h2 id="about-heading" className={sectionTitle}>
            {h.aboutHeading}
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
            {h.aboutParagraphs.map((p) => (
              <p key={p.slice(0, 40)}>{fmt(p, { name: site.name })}</p>
            ))}
          </div>
          <h3 className="pt-2 text-lg font-semibold">{h.supportedHeading}</h3>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {h.supportedLinks.map((l) => (
              <li key={l} className="rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
                {l}
              </li>
            ))}
          </ul>
        </section>

        {/* Guides */}
        <section className="mt-16 space-y-6" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className={`text-center ${sectionTitle}`}>
            {h.guidesHeading}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dict.guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={L(`/${g.slug}`)}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium transition-colors hover:border-emerald-600/50"
                >
                  {g.h1}
                  <ArrowRight className="size-4 shrink-0 text-emerald-500 rtl:rotate-180" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Blog */}
        <section className="mt-16 space-y-6" aria-labelledby="blog-heading">
          <div className="flex items-end justify-between gap-3">
            <h2 id="blog-heading" className={sectionTitle}>
              {h.blogHeading}
            </h2>
            <Link href={L("/blog")} className={moreLink}>
              {dict.common.allArticles} <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard lang={lang} post={p} categoryLabel={dict.pages.blog.categories[p.category] ?? p.category} />
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-16 space-y-6" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={`text-center ${sectionTitle}`}>
            {dict.common.faqTitle}
          </h2>
          <div className="mx-auto max-w-3xl divide-y divide-border/60 rounded-xl border border-border/60 bg-card/60">
            {dict.faqs.slice(0, 6).map((f) => (
              <details key={f.q} className="group p-4">
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {f.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center">
            <Link href={L("/faq")} className={moreLink}>
              {dict.common.allQuestions} <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter lang={lang} dict={dict} />
      <JsonLd data={schema} />
    </div>
  );
}
