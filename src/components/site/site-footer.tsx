import Link from "next/link";
import { fmt, type Dictionary } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import { LogoMark } from "@/components/site/logo";
import { site } from "@/lib/site";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const links = [
    { href: "/blog", label: dict.nav.blog },
    { href: "/about", label: dict.nav.about },
    { href: "/how-to-use", label: dict.nav.howTo },
    { href: "/faq", label: dict.nav.faq },
    { href: "/contact", label: dict.nav.contact },
    { href: "/privacy", label: dict.nav.privacy },
    { href: "/terms", label: dict.nav.terms },
    { href: "/disclaimer", label: dict.nav.disclaimer },
  ];
  const linkCls = "block py-2.5 text-muted-foreground hover:text-foreground sm:py-1";
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60">
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8 text-sm">
        <div className="grid gap-6 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm space-y-2">
            <Link href={localePath(lang, "/")} className="flex min-h-11 items-center gap-2 font-semibold">
              <LogoMark className="size-6" />
              <span dir="ltr">{site.name}</span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">{dict.footer.about}</p>
          </div>
          <nav aria-label={dict.footer.guides}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{dict.footer.guides}</p>
            <ul className="text-sm sm:text-xs">
              {dict.guides.map((g) => (
                <li key={g.slug}>
                  <Link href={localePath(lang, `/${g.slug}`)} className={linkCls}>
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={dict.footer.site}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{dict.footer.site}</p>
            <ul className="grid grid-cols-2 gap-x-6 text-sm sm:text-xs">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={localePath(lang, item.href)} className={linkCls}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="border-t border-border/40 pt-4 text-[11px] leading-relaxed text-muted-foreground">
          {fmt(dict.footer.legal, { name: site.name })} © {new Date().getFullYear()} {site.domain}
        </p>
      </div>
    </footer>
  );
}
