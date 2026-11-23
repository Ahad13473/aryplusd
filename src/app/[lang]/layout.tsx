import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Gurmukhi,
} from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/site/json-ld";
import { getDictionary } from "@/i18n";
import { I18nProvider } from "@/i18n/client";
import { isLocale, localeInfo, locales, type Locale } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { site } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Script fonts: the browser only downloads the one the page actually uses.
const nastaliq = Noto_Nastaliq_Urdu({ variable: "--font-nastaliq", subsets: ["arabic"], weight: ["400", "700"] });
const naskh = Noto_Naskh_Arabic({ variable: "--font-naskh", subsets: ["arabic"], weight: ["400", "700"] });
const devanagari = Noto_Sans_Devanagari({ variable: "--font-devanagari", subsets: ["devanagari"] });
const bengali = Noto_Sans_Bengali({ variable: "--font-bengali", subsets: ["bengali"] });
const gurmukhi = Noto_Sans_Gurmukhi({ variable: "--font-gurmukhi", subsets: ["gurmukhi"] });

/** Which font stack each language uses (Latin text inside falls back to Geist). */
const scriptFont: Partial<Record<Locale, string>> = {
  ur: "var(--font-nastaliq)",
  ar: "var(--font-naskh)",
  fa: "var(--font-naskh)",
  ps: "var(--font-naskh)",
  hi: "var(--font-devanagari)",
  bn: "var(--font-bengali)",
  pa: "var(--font-gurmukhi)",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s | ${site.name}` },
    description: dict.meta.description,
    keywords: [...site.keywords],
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "Video downloader",
    alternates: alternatesFor(lang, "/"),
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: localeInfo[lang].og,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeInfo[l].og),
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    verification: {
      google: site.googleVerification || undefined,
      other: site.bingVerification ? { "msvalidate.01": site.bingVerification } : undefined,
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function LangLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { dir } = localeInfo[lang];

  const orgSchema = [
    { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url, logo: `${site.url}/icon.svg`, email: site.contactEmail },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      alternateName: [dict.meta.tagline, "ARY Plus Downloader", site.domain],
      url: site.url,
      inLanguage: locales,
    },
  ];

  const fonts = [geistSans, geistMono, nastaliq, naskh, devanagari, bengali, gurmukhi].map((f) => f.variable).join(" ");
  const family = scriptFont[lang];

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body
        className={`${fonts} antialiased bg-background text-foreground min-h-screen`}
        style={family ? { fontFamily: `${family}, var(--font-geist-sans), sans-serif`, lineHeight: lang === "ur" ? 1.9 : undefined } : undefined}
      >
        <I18nProvider value={{ lang, dir, ui: dict.ui, videoSteps: dict.video.steps, videoChapters: dict.video.chapters }}>
          <Providers dir={dir}>{children}</Providers>
        </I18nProvider>
        <PageViewTracker lang={lang} />
        <JsonLd data={orgSchema} />
        {site.adsenseClient && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`}
          />
        )}
      </body>
    </html>
  );
}
