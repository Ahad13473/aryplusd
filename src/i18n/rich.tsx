import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { localePath, type Locale } from "./config";

/**
 * Renders translated text that may contain **bold** and [label](href).
 * Internal links ("/faq") get the current language prefix automatically.
 */
export function Rich({ text, lang }: { text: string; lang: Locale }) {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) {
      parts.push(<strong key={i++}>{m[1]}</strong>);
    } else {
      const href = m[3];
      const cls = "text-emerald-500 hover:underline";
      parts.push(
        href.startsWith("/") ? (
          <Link key={i++} href={localePath(lang, href)} className={cls}>
            {m[2]}
          </Link>
        ) : (
          <a key={i++} href={href} className={cls} {...(href.startsWith("http") ? { rel: "nofollow noopener", target: "_blank" } : {})}>
            {m[2]}
          </a>
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}
