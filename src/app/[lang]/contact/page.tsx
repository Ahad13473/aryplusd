import { ContentPage, Section } from "@/components/site/content-page";
import { fmt } from "@/i18n";
import { localePath } from "@/i18n/config";
import { pageContext, type LangParams } from "@/i18n/page";
import { Rich } from "@/i18n/rich";
import { pageMetadata } from "@/i18n/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/contact", dict.pages.contact.title, dict.pages.contact.description);
}

export default async function ContactPage({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const p = dict.pages.contact;
  return (
    <ContentPage
      lang={lang}
      dict={dict}
      path="/contact"
      title={p.title}
      intro={p.intro}
      schema={[{ "@context": "https://schema.org", "@type": "ContactPage", name: p.title, url: `${site.url}${localePath(lang, "/contact")}`, inLanguage: lang }]}
    >
      <Section title={p.emailHeading}>
        <p>
          <a href={`mailto:${site.contactEmail}`} className="text-lg font-medium text-emerald-500 hover:underline" dir="ltr">
            {site.contactEmail}
          </a>
        </p>
      </Section>
      <Section title={p.helpHeading}>
        <ul className="list-disc space-y-1.5 ps-5">
          {p.help.map((h) => (
            <li key={h.slice(0, 40)}>
              <Rich text={fmt(h, { name: site.name })} lang={lang} />
            </li>
          ))}
        </ul>
      </Section>
    </ContentPage>
  );
}
