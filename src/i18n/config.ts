/** Supported languages. English is the default and lives at the root URL (no prefix). */
export const locales = ["en", "ur", "ar", "hi", "bn", "pa", "ps", "fa", "tr", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeInfo: Record<Locale, { name: string; native: string; dir: "ltr" | "rtl"; og: string }> = {
  en: { name: "English", native: "English", dir: "ltr", og: "en_US" },
  ur: { name: "Urdu", native: "اردو", dir: "rtl", og: "ur_PK" },
  ar: { name: "Arabic", native: "العربية", dir: "rtl", og: "ar_AR" },
  hi: { name: "Hindi", native: "हिन्दी", dir: "ltr", og: "hi_IN" },
  bn: { name: "Bengali", native: "বাংলা", dir: "ltr", og: "bn_BD" },
  pa: { name: "Punjabi", native: "ਪੰਜਾਬੀ", dir: "ltr", og: "pa_IN" },
  ps: { name: "Pashto", native: "پښتو", dir: "rtl", og: "ps_AF" },
  fa: { name: "Persian", native: "فارسی", dir: "rtl", og: "fa_IR" },
  tr: { name: "Turkish", native: "Türkçe", dir: "ltr", og: "tr_TR" },
  id: { name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", og: "id_ID" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** URL path for a page in a language: "/how-to-use" -> "/ur/how-to-use" (English stays unprefixed). */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  return lang === defaultLocale ? clean || "/" : `/${lang}${clean}`;
}
