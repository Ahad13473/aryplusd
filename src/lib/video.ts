import { site } from "@/lib/site";

/**
 * Narrated step-by-step tutorial (recorded from the real app), in English and
 * Urdu. Timings come from the narration build: each segment is stretched to
 * fit its voice line, so the two languages have slightly different lengths.
 */

export type VideoLang = "en" | "ur";

export interface TutorialVideo {
  lang: VideoLang;
  /** Language switch label. */
  label: string;
  src: string;
  captions: string;
  poster: string;
  title: string;
  description: string;
  seconds: number;
  chapters: { label: string; start: number; end: number }[];
  /** The narration, shown under the player as numbered steps. */
  steps: string[];
}

const poster = "/videos/how-to-download-ary-dramas-poster.jpg";

export const tutorialVideos: Record<VideoLang, TutorialVideo> = {
  en: {
    lang: "en",
    label: "English",
    src: "/videos/how-to-download-ary-dramas-en.mp4",
    captions: "/videos/how-to-download-ary-dramas-en.vtt",
    poster,
    title: "How to Download ARY Dramas Free in 4K - Paste a Link or Search All Episodes",
    description:
      "Narrated step-by-step guide: paste an ARY Plus link, pick any quality up to 4K Ultra HD and save the MP4 to your device - or search a drama by name, see every episode and download several at the same time. Free, no sign-in.",
    seconds: 76,
    chapters: [
      { label: "Paste the ARY Plus link", start: 12, end: 19 },
      { label: "Pick a quality - up to 4K", start: 19, end: 31 },
      { label: "Download & save to device", start: 31, end: 42 },
      { label: "Search a drama by name", start: 42, end: 50 },
      { label: "See all episodes", start: 50, end: 59 },
      { label: "Download several at once", start: 59, end: 76 },
    ],
    steps: [
      "Open aryplusd.com in any browser, on your phone or computer.",
      "Copy the episode link from ARY Plus, paste it in the box and press Analyze.",
      "Every available quality appears, up to 4K Ultra HD, with the real file size.",
      "Tap the quality you want, then press Download.",
      "Watch the live progress while your video is prepared.",
      "When it's ready, the MP4 is saved to your Downloads folder automatically.",
      "No link? Switch to Search and type the drama name, then pick it from the results.",
      "Every episode appears with its thumbnail and length.",
      "Open an episode, choose a quality and press Download.",
      "Start as many episodes as you like - three download at the same time.",
      "Each one is saved to your device as soon as it's ready.",
    ],
  },
  ur: {
    lang: "ur",
    label: "اردو",
    src: "/videos/how-to-download-ary-dramas-ur.mp4",
    captions: "/videos/how-to-download-ary-dramas-ur.vtt",
    poster,
    title: "اے آر وائی ڈرامے مفت ڈاؤن لوڈ کرنے کا طریقہ - فور کے تک، بغیر سائن اِن",
    description:
      "اردو میں مکمل طریقہ: اے آر وائی پلس کا لنک پیسٹ کریں یا ڈرامے کا نام سرچ کریں، فور کے تک کوالٹی منتخب کریں اور کئی اقساط ایک ساتھ ڈاؤن لوڈ کریں - بالکل مفت، بغیر سائن اِن۔",
    seconds: 88,
    chapters: [
      { label: "لنک پیسٹ کریں", start: 13, end: 21 },
      { label: "کوالٹی منتخب کریں - فور کے تک", start: 21, end: 35 },
      { label: "ڈاؤن لوڈ اور محفوظ کریں", start: 35, end: 48 },
      { label: "ڈرامے کا نام سرچ کریں", start: 48, end: 58 },
      { label: "تمام اقساط دیکھیں", start: 58, end: 68 },
      { label: "کئی اقساط ایک ساتھ", start: 68, end: 88 },
    ],
    steps: [
      "کسی بھی براؤزر میں aryplusd.com کھولیں، موبائل یا کمپیوٹر پر۔",
      "اے آر وائی پلس سے قسط کا لنک کاپی کریں، باکس میں پیسٹ کریں اور اینالائز دبائیں۔",
      "تمام دستیاب کوالٹیز سامنے آ جاتی ہیں، فور کے الٹرا ایچ ڈی تک، اصل فائل سائز کے ساتھ۔",
      "اپنی پسند کی کوالٹی منتخب کریں اور ڈاؤن لوڈ دبائیں۔",
      "ویڈیو تیار ہوتے وقت اس کی پیش رفت دیکھیں۔",
      "تیار ہوتے ہی ایم پی فور فائل خود بخود ڈاؤن لوڈز فولڈر میں محفوظ ہو جاتی ہے۔",
      "لنک نہیں ہے؟ سرچ پر جائیں، ڈرامے کا نام لکھیں اور نتائج میں سے منتخب کریں۔",
      "تمام اقساط تصویر اور دورانیے کے ساتھ سامنے آ جاتی ہیں۔",
      "کوئی بھی قسط کھولیں، کوالٹی منتخب کریں اور ڈاؤن لوڈ دبائیں۔",
      "جتنی چاہیں اقساط شروع کریں - تین اقساط ایک ساتھ ڈاؤن لوڈ ہوتی ہیں۔",
      "ہر قسط تیار ہوتے ہی آپ کے ڈیوائس میں محفوظ ہو جاتی ہے۔",
    ],
  },
};

export const uploadDate = "2026-11-23";

/** VideoObject schema (with key-moment clips) for one language version. */
export function videoSchema(pagePath: string, lang: VideoLang = "en") {
  const v = tutorialVideos[lang];
  const pageUrl = `${site.url}${pagePath}`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    inLanguage: lang,
    thumbnailUrl: [`${site.url}${v.poster}`],
    uploadDate: `${uploadDate}T00:00:00+05:00`,
    duration: `PT${v.seconds}S`,
    contentUrl: `${site.url}${v.src}`,
    embedUrl: pageUrl,
    transcript: v.steps.join(" "),
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
    hasPart: v.chapters.map((c) => ({
      "@type": "Clip",
      name: c.label,
      startOffset: c.start,
      endOffset: c.end,
      url: `${pageUrl}#t=${c.start}`,
    })),
  };
}
