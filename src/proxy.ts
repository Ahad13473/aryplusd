import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Language routing:
 *  - "/ur/faq" etc. are served as-is.
 *  - English has no prefix: "/faq" is served from "/en/faq" internally.
 *  - "/en/faq" redirects to "/faq" so each page has one English URL.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];

  if (first === defaultLocale) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, the admin panel and any file with an extension.
  matcher: ["/((?!api|_next|admin|.*\\..*).*)"],
};
