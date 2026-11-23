import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ensureEngine, enqueueJob } from "@/lib/downloader/engine";
import { serializeJob } from "@/lib/downloader/serialize";
import { resolveInputUrl } from "@/lib/downloader/stream-ref";
import { assertPublicUrl, deriveTitle, sanitizeHeaders } from "@/lib/downloader/util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guessKind(url: string): "hls" | "direct" {
  const p = new URL(url).pathname;
  return /\.m3u8$/i.test(p) || !/\.[a-z0-9]{1,5}$/i.test(p) ? "hls" : "direct";
}

function isAryHost(url: string): boolean {
  const host = new URL(url).hostname;
  return /(^|\.)(aryzap\.com|aryplus\.tv)$/i.test(host);
}

/** GET /api/downloads - list all jobs (newest first). */
export async function GET() {
  await ensureEngine();
  const jobs = await db.download.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ jobs: jobs.map(serializeJob) });
}

/** POST /api/downloads - create (enqueue) a download job. */
export async function POST(req: NextRequest) {
  try {
    await ensureEngine();
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    // The browser only ever holds sealed tokens; open them back into real URLs here.
    const url = assertPublicUrl(resolveInputUrl(String(body.url ?? "")));
    const kind =
      body.kind === "hls" ? "hls" : body.kind === "direct" ? "direct" : guessKind(url);

    const headers = sanitizeHeaders(body.headers);
    if (isAryHost(url) && !headers.Referer) headers.Referer = "https://aryplus.tv/";
    const headersJson = JSON.stringify(headers);

    let variantUrl: string | null = null;
    if (kind === "hls" && body.variantUrl) {
      variantUrl = assertPublicUrl(resolveInputUrl(String(body.variantUrl)));
    }

    const fallbackTitle = deriveTitle(variantUrl ?? url);
    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim().slice(0, 200)
        : fallbackTitle;

    const qualityLabel =
      typeof body.qualityLabel === "string" && body.qualityLabel.trim()
        ? body.qualityLabel.trim().slice(0, 40)
        : null;

    const totalBytes =
      typeof body.sizeBytes === "number" && Number.isFinite(body.sizeBytes) && body.sizeBytes > 0
        ? Math.round(body.sizeBytes)
        : null;

    const segmentsTotal =
      kind === "hls" && typeof body.segmentCount === "number" && Number.isFinite(body.segmentCount)
        ? Math.max(0, Math.round(body.segmentCount))
        : 0;

    const job = await db.download.create({
      data: {
        url,
        title,
        kind,
        status: "queued",
        headers: headersJson,
        variantUrl,
        qualityLabel,
        totalBytes,
        segmentsTotal,
      },
    });

    enqueueJob(job.id);
    return NextResponse.json(serializeJob(job), { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create the download.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
