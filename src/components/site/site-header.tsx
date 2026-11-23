import Link from "next/link";
import type { Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { LogoMark } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = [
    { href: "/", label: dict.nav.downloader },
    { href: "/how-to-use", label: dict.nav.howTo },
    { href: "/guides", label: dict.nav.guides },
    { href: "/blog", label: dict.nav.blog },
    { href: "/faq", label: dict.nav.faq },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-2 px-4">
        <Link href={localePath(lang, "/")} className="flex min-h-11 items-center gap-2.5" aria-label={`${site.name} - ${dict.nav.home}`}>
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight" dir="ltr">
              {site.name}
            </span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">{dict.meta.tagline}</span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(lang, item.href)}
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher lang={lang} label={dict.nav.language} />
          <ThemeToggle label={dict.nav.toggleTheme} />
        </nav>
      </div>
      {/* Compact links for phones */}
      <nav aria-label="Main mobile" className="border-t border-border/40 md:hidden">
        <ul className="mx-auto flex max-w-5xl justify-between overflow-x-auto px-3 text-[13px]">
          {nav.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={localePath(lang, item.href)} className="block whitespace-nowrap px-1.5 py-3 text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
