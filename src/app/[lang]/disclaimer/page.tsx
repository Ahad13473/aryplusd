import { ContentPage, Sections } from "@/components/site/content-page";
import { fmt } from "@/i18n";
import { pageContext, type LangParams } from "@/i18n/page";
import { pageMetadata } from "@/i18n/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/disclaimer", dict.pages.disclaimer.title, dict.pages.disclaimer.description);
}

export default async function Page({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const p = dict.pages.disclaimer;
  const intro = fmt(dict.common.lastUpdated, { date: site.lastUpdated });
  return (
    <ContentPage lang={lang} dict={dict} path="/disclaimer" title={p.title} intro={intro}>
      <Sections sections={p.sections} lang={lang} />
    </ContentPage>
  );
}
