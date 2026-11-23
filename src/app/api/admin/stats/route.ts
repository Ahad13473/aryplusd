import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { dayKey } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/admin/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Headline totals plus a breakdown of the chosen range (defaults to the last 30 days).
 */
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const now = new Date();
  const to = DAY.test(req.nextUrl.searchParams.get("to") ?? "") ? (req.nextUrl.searchParams.get("to") as string) : dayKey(now);
  const from = DAY.test(req.nextUrl.searchParams.get("from") ?? "")
    ? (req.nextUrl.searchParams.get("from") as string)
    : dayKey(new Date(now.getTime() - 29 * 86400_000));
  if (from > to) return NextResponse.json({ error: "Start date is after end date." }, { status: 400 });

  const since24h = new Date(now.getTime() - 86400_000);
  const since30d = new Date(now.getTime() - 30 * 86400_000);
  const range = { day: { gte: from, lte: to } };

  const [total, last24h, last30d, rangeViews, visitorsByDay, viewsByDay, pages, langs, devices, refs] = await Promise.all([
    db.pageView.count(),
    db.pageView.count({ where: { createdAt: { gte: since24h } } }),
    db.pageView.count({ where: { createdAt: { gte: since30d } } }),
    db.pageView.count({ where: range }),
    db.pageView.groupBy({ by: ["day", "visitor"], where: range }),
    db.pageView.groupBy({ by: ["day"], where: range, _count: { _all: true } }),
    db.pageView.groupBy({ by: ["path"], where: range, _count: { _all: true }, orderBy: { _count: { path: "desc" } }, take: 15 }),
    db.pageView.groupBy({ by: ["lang"], where: range, _count: { _all: true }, orderBy: { _count: { lang: "desc" } } }),
    db.pageView.groupBy({ by: ["device"], where: range, _count: { _all: true }, orderBy: { _count: { device: "desc" } } }),
    db.pageView.groupBy({
      by: ["referrer"],
      where: { ...range, referrer: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 10,
    }),
  ]);

  // Unique visitors per day (a visitor is counted once per day).
  const uniq = new Map<string, number>();
  for (const v of visitorsByDay) uniq.set(v.day, (uniq.get(v.day) ?? 0) + 1);
  const views = new Map(viewsByDay.map((d) => [d.day, d._count._all]));

  // Every day in the range, including days with zero views.
  const daily: { day: string; views: number; visitors: number }[] = [];
  for (let d = new Date(`${from}T00:00:00Z`); dayKey(d) <= to; d = new Date(d.getTime() + 86400_000)) {
    const k = dayKey(d);
    daily.push({ day: k, views: views.get(k) ?? 0, visitors: uniq.get(k) ?? 0 });
    if (daily.length > 731) break; // two years max
  }

  return NextResponse.json({
    total,
    last24h,
    last30d,
    range: {
      from,
      to,
      views: rangeViews,
      visitors: [...uniq.values()].reduce((a, b) => a + b, 0),
      daily,
      pages: pages.map((p) => ({ path: p.path, views: p._count._all })),
      langs: langs.map((l) => ({ lang: l.lang, views: l._count._all })),
      devices: devices.map((d) => ({ device: d.device, views: d._count._all })),
      referrers: refs.map((r) => ({ host: r.referrer as string, views: r._count._all })),
    },
  });
}
