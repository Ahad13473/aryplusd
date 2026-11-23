import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentPage } from "@/components/site/content-page";
import { localePath } from "@/i18n/config";
import { pageContext, type LangParams } from "@/i18n/page";
import { pageMetadata } from "@/i18n/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/guides", dict.pages.guides.title, dict.pages.guides.description);
}

export default async function GuidesPage({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: dict.guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}${localePath(lang, `/${g.slug}`)}`, name: g.h1 })),
  };
  return (
    <ContentPage lang={lang} dict={dict} path="/guides" title={dict.pages.guides.title} intro={dict.pages.guides.intro} schema={[list]}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {dict.guides.map((g) => (
          <li key={g.slug}>
            <Link href={localePath(lang, `/${g.slug}`)} className="block h-full space-y-2 rounded-xl border border-border/60 bg-card/60 p-5 hover:border-emerald-600/50">
              <h2 className="font-semibold">{g.h1}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{g.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-emerald-500">
                {dict.common.readMore} <ArrowRight className="size-3.5 rtl:rotate-180" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
