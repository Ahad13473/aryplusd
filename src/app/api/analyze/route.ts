import { NextResponse, type NextRequest } from "next/server";
import { AnalyzeError, analyzeUrl } from "@/lib/downloader/analyze";
import {
  AryPlusError,
  isAryPlusPageUrl,
  resolveAryPlusUrl,
  toAryPlusAnalysis,
} from "@/lib/downloader/aryplus";
import { resolveInputUrl, sealAnalysis, sealAryAnalysis } from "@/lib/downloader/stream-ref";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      url?: unknown;
      headers?: unknown;
    };
    const url = resolveInputUrl(String(body.url ?? ""));

    // ARY Plus (aryplus.tv / ARY ZAP) page links are resolved into a series
    // view with per-episode streams before the generic analyzer runs.
    if (isAryPlusPageUrl(url)) {
      const result = await resolveAryPlusUrl(url);
      return NextResponse.json(sealAryAnalysis(toAryPlusAnalysis(result, url)));
    }

    const result = await analyzeUrl(url, body.headers);
    return NextResponse.json(sealAnalysis(result));
  } catch (err) {
    const message =
      err instanceof AryPlusError || err instanceof AnalyzeError || err instanceof Error
        ? err.message
        : "Analysis failed for an unknown reason.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
