import { ContentPage } from "@/components/site/content-page";
import { pageContext, type LangParams } from "@/i18n/page";
import { pageMetadata } from "@/i18n/seo";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/faq", dict.pages.faq.title, dict.pages.faq.description);
}

export default async function FaqPage({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: dict.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <ContentPage lang={lang} dict={dict} path="/faq" title={dict.pages.faq.title} intro={dict.pages.faq.intro} schema={[schema]}>
      <div className="space-y-6">
        {dict.faqs.map((f) => (
          <section key={f.q} className="space-y-2 border-b border-border/50 pb-5">
            <h2 className="text-lg font-semibold">{f.q}</h2>
            <p className="text-[15px] leading-relaxed text-foreground/85">{f.a}</p>
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
