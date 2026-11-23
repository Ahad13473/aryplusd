import Image from "next/image";
import { ContentPage, Section, Sections } from "@/components/site/content-page";
import { VideoGuide } from "@/components/site/video-guide";
import { fmt } from "@/i18n";
import { localePath } from "@/i18n/config";
import { pageContext, type LangParams } from "@/i18n/page";
import { Rich } from "@/i18n/rich";
import { pageMetadata } from "@/i18n/seo";
import { site, stepImages } from "@/lib/site";
import { videoSchema } from "@/lib/video";

export async function generateMetadata({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  return pageMetadata(lang, "/how-to-use", dict.pages.howTo.title, dict.pages.howTo.description);
}

export default async function HowToUsePage({ params }: LangParams) {
  const { lang, dict } = await pageContext(params);
  const p = dict.pages.howTo;
  const pageUrl = `${site.url}${localePath(lang, "/how-to-use")}`;
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: p.title,
    description: p.description,
    inLanguage: lang,
    totalTime: "PT2M",
    tool: { "@type": "HowToTool", name: site.name },
    step: dict.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.text,
      image: `${site.url}${stepImages[i]}`,
      url: `${pageUrl}#step-${i + 1}`,
    })),
  };
  return (
    <ContentPage
      lang={lang}
      dict={dict}
      path="/how-to-use"
      title={p.title}
      intro={fmt(p.intro, { name: site.name })}
      schema={[howTo, videoSchema(localePath(lang, "/how-to-use"), "en"), videoSchema(localePath(lang, "/how-to-use"), "ur")]}
    >
      <Section title={p.videoHeading}>
        <p>
          <Rich text={p.videoText} lang={lang} />
        </p>
      </Section>
      <VideoGuide />

      <ol className="space-y-10">
        {dict.steps.map((s, i) => (
          <li key={s.title} id={`step-${i + 1}`} className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight">{fmt(p.stepLabel, { n: i + 1, title: s.title })}</h2>
            <Image src={stepImages[i]} alt={s.alt} width={480} height={300} className="h-auto w-full max-w-xl rounded-xl border border-border/60" />
            <p className="text-[15px] leading-relaxed text-foreground/85">{s.text}</p>
          </li>
        ))}
      </ol>

      <Sections sections={p.sections} lang={lang} />
    </ContentPage>
  );
}
