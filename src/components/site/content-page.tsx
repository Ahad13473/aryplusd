import Link from "next/link";
import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { fmt, type Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import type { Section as SectionText } from "@/i18n/dictionaries/en";
import { Rich } from "@/i18n/rich";
import { site } from "@/lib/site";

/** Layout for text pages (guides, about, legal): header, breadcrumbs, article, footer. */
export function ContentPage({
  lang,
  dict,
  path,
  title,
  intro,
  children,
  schema,
  parent,
}: {
  lang: Locale;
  dict: Dictionary;
  path: string;
  title: string;
  intro?: string;
  children: ReactNode;
  schema?: Record<string, unknown>[];
  /** Optional middle breadcrumb, e.g. { href: "/blog", label: "Blog" }. */
  parent?: { href: string; label: string };
}) {
  const url = (p: string) => `${site.url}${localePath(lang, p)}`;
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: url("/") },
      ...(parent ? [{ "@type": "ListItem", position: 2, name: parent.label, item: url(parent.href) }] : []),
      { "@type": "ListItem", position: parent ? 3 : 2, name: title, item: url(path) },
    ],
  };
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dict={dict} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href={localePath(lang, "/")} className="inline-block py-3 hover:text-foreground">
                {dict.nav.home}
              </Link>
            </li>
            <li aria-hidden>/</li>
            {parent && (
              <>
                <li>
                  <Link href={localePath(lang, parent.href)} className="inline-block py-3 hover:text-foreground">
                    {parent.label}
                  </Link>
                </li>
                <li aria-hidden>/</li>
              </>
            )}
            <li aria-current="page" className="line-clamp-1 text-foreground">
              {title}
            </li>
          </ol>
        </nav>
        <article className="space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>
            {intro && (
              <p className="text-base leading-relaxed text-muted-foreground">
                <Rich text={intro} lang={lang} />
              </p>
            )}
          </header>
          {children}
        </article>
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT} />
      </main>
      <SiteFooter lang={lang} dict={dict} />
      <JsonLd data={[breadcrumbs, ...(schema ?? [])]} />
    </div>
  );
}

/** Section heading + body used inside content pages. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

/** Renders translated sections (paragraphs, bullet and numbered lists) with {name}/{email}/... filled in. */
export function Sections({ sections, lang, vars = {} }: { sections: SectionText[]; lang: Locale; vars?: Record<string, string> }) {
  const v = { name: site.name, domain: site.domain, email: site.contactEmail, date: site.lastUpdated, ...vars };
  const t = (s: string) => <Rich text={fmt(s, v)} lang={lang} />;
  return (
    <>
      {sections.map((s) => (
        <Section key={s.h2} title={fmt(s.h2, v)}>
          {s.body?.map((p) => <p key={p.slice(0, 48)}>{t(p)}</p>)}
          {s.list && (
            <ul className="list-disc space-y-1.5 ps-5">
              {s.list.map((li) => (
                <li key={li.slice(0, 48)}>{t(li)}</li>
              ))}
            </ul>
          )}
          {s.ordered && (
            <ol className="list-decimal space-y-1.5 ps-5">
              {s.ordered.map((li) => (
                <li key={li.slice(0, 48)}>{t(li)}</li>
              ))}
            </ol>
          )}
          {s.after?.map((p) => <p key={p.slice(0, 48)}>{t(p)}</p>)}
        </Section>
      ))}
    </>
  );
}
