import Image from "next/image";
import { ContentPage, Sections } from "@/components/site/content-page";
import { fmt } from "@/i18n";
import { localePath } from "@/i18n/config";
import { pageContext, type LangParams } from "@/i18n/page";
import { pageMetadata } from "@/i18n/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/about", dict.pages.about.metaTitle, dict.pages.about.description);
}

export default async function AboutPage({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const p = dict.pages.about;
  return (
    <ContentPage
      lang={lang}
      dict={dict}
      path="/about"
      title={p.title}
      intro={fmt(p.intro, { name: site.name })}
      schema={[{ "@context": "https://schema.org", "@type": "AboutPage", name: p.title, url: `${site.url}${localePath(lang, "/about")}`, description: p.description, inLanguage: lang }]}
    >
      <Image src="/images/devices.svg" alt={p.imageAlt} width={640} height={320} className="h-auto w-full rounded-xl border border-border/60" priority />
      <Sections sections={p.sections} lang={lang} />
    </ContentPage>
  );
}
