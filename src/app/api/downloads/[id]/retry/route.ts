import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { enqueueJob, ensureEngine } from "@/lib/downloader/engine";
import { serializeJob } from "@/lib/downloader/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/downloads/:id/retry - re-enqueue a failed or canceled job. */
export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await db.download.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }
  if (job.status !== "failed" && job.status !== "canceled") {
    return NextResponse.json(
      { error: "Only failed or canceled downloads can be retried." },
      { status: 400 },
    );
  }
  const updated = await db.download.update({
    where: { id },
    data: {
      status: "queued",
      progress: 0,
      error: null,
      downloadedBytes: 0,
      segmentsDone: 0,
      speedBps: 0,
      etaSeconds: null,
      completedAt: null,
    },
  });
  await ensureEngine();
  enqueueJob(id);
  return NextResponse.json(serializeJob(updated));
}
