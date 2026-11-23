import { ContentPage, Sections } from "@/components/site/content-page";
import { fmt } from "@/i18n";
import { pageContext, type LangParams } from "@/i18n/page";
import { pageMetadata } from "@/i18n/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/terms", dict.pages.terms.title, dict.pages.terms.description);
}

export default async function Page({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const p = dict.pages.terms;
  const intro = fmt(p.intro, { date: site.lastUpdated, domain: site.domain, name: site.name });
  return (
    <ContentPage lang={lang} dict={dict} path="/terms" title={p.title} intro={intro}>
      <Sections sections={p.sections} lang={lang} />
    </ContentPage>
  );
}
