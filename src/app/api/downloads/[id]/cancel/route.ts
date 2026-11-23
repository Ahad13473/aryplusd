import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { cancelAndDelete } from "@/lib/downloader/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/downloads/:id/cancel - stop a queued or running download and delete its files. */
export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await db.download.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }
  if (job.status !== "queued" && job.status !== "downloading") {
    return NextResponse.json({ error: "This download is not running." }, { status: 400 });
  }
  await cancelAndDelete(id);
  return NextResponse.json({ ok: true });
}
