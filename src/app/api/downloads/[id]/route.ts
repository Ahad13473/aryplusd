import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { removeJobFiles } from "@/lib/downloader/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DELETE /api/downloads/:id - cancel (if running) and delete a job with its files. */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await db.download.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: "Download not found." }, { status: 404 });
  }
  await removeJobFiles(id);
  await db.download.delete({ where: { id } }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
