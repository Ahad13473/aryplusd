import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { dayKey, deviceOf, isBot, visitorHash } from "@/lib/analytics";
import { isLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/track - record one page view (bots and odd paths are ignored). */
export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new NextResponse(null, { status: 204 });
  const body = (await req.json().catch(() => null)) as { path?: unknown; lang?: unknown; ref?: unknown } | null;
  const path = typeof body?.path === "string" ? body.path.slice(0, 200) : "";
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return new NextResponse(null, { status: 204 });
  }
  const lang = typeof body?.lang === "string" && isLocale(body.lang) ? body.lang : "en";
  let referrer: string | null = null;
  if (typeof body?.ref === "string") {
    try {
      const host = new URL(body.ref).hostname;
      if (host && host !== req.nextUrl.hostname) referrer = host.slice(0, 100);
    } catch {
      /* not a URL */
    }
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const day = dayKey();
  await db.pageView
    .create({ data: { path, lang, day, visitor: visitorHash(ip, ua, day), referrer, device: deviceOf(ua) } })
    .catch(() => undefined);
  return new NextResponse(null, { status: 204 });
}
