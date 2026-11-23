import { NextResponse, type NextRequest } from "next/server";
import { AryPlusError, searchAryPlus } from "@/lib/downloader/aryplus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/aryplus/search - search the ARY Plus catalog by title. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { query?: unknown };
    const results = await searchAryPlus(String(body.query ?? ""));
    return NextResponse.json({ results });
  } catch (err) {
    const message =
      err instanceof AryPlusError || err instanceof Error
        ? err.message
        : "ARY Plus search failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
