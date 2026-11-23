"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { isLocale, localeInfo, localePath, locales, type Locale } from "@/i18n/config";

/** Switches language while staying on the same page. */
export function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  // Strip the current language prefix (English has none).
  const first = pathname.split("/")[1];
  const basePath = isLocale(first) ? pathname.slice(first.length + 1) || "/" : pathname;

  return (
    <label className="relative flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
      <Globe className="size-4 shrink-0" aria-hidden />
      <span className="sr-only">{label}</span>
      <select
        value={lang}
        onChange={(e) => router.push(localePath(e.target.value as Locale, basePath))}
        className="cursor-pointer appearance-none bg-transparent pe-1 text-sm outline-none"
        aria-label={label}
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-background text-foreground">
            {localeInfo[l].native}
          </option>
        ))}
      </select>
    </label>
  );
}
