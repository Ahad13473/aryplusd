import { NextResponse, type NextRequest } from "next/server";
import {
  AryPlusError,
  isAryPlusPageUrl,
  resolveAryPlusSeries,
  resolveAryPlusUrl,
  toAryPlusAnalysis,
} from "@/lib/downloader/aryplus";
import { sealAryAnalysis } from "@/lib/downloader/stream-ref";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/aryplus/resolve
 * Body: { url } (full ARY Plus page link) or { seriesId } (from a search hit).
 * Responds with the series info and every episode's playable stream.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      url?: unknown;
      seriesId?: unknown;
    };

    const rawUrl = String(body.url ?? "").trim();
    const seriesId = String(body.seriesId ?? "").trim();

    if (rawUrl && isAryPlusPageUrl(rawUrl)) {
      const result = await resolveAryPlusUrl(rawUrl);
      return NextResponse.json(sealAryAnalysis(toAryPlusAnalysis(result, rawUrl)));
    }

    if (!seriesId && rawUrl) {
      // Allow pasting a full ARY link even when the host check above failed
      // (e.g. unusual subdomains) - resolution surfaces a clear error if invalid.
      const result = await resolveAryPlusUrl(rawUrl);
      return NextResponse.json(sealAryAnalysis(toAryPlusAnalysis(result, rawUrl)));
    }

    if (!seriesId) {
      return NextResponse.json(
        { error: "Provide either an ARY Plus link (url) or a seriesId." },
        { status: 400 },
      );
    }

    const result = await resolveAryPlusSeries(seriesId);
    const sourceUrl = `https://aryplus.tv/series/v1/${seriesId}`;
    return NextResponse.json(sealAryAnalysis(toAryPlusAnalysis(result, sourceUrl)));
  } catch (err) {
    const message =
      err instanceof AryPlusError || err instanceof Error
        ? err.message
        : "Could not resolve this ARY Plus title.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
