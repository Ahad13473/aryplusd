import { NextResponse, type NextRequest } from "next/server";
import { createReadStream, promises as fsp } from "node:fs";
import { Readable } from "node:stream";
import { db } from "@/lib/db";
import { finalFilePath, removeJobFiles } from "@/lib/downloader/engine";
import { mimeForExt } from "@/lib/downloader/util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toWebStream(stream: import("node:fs").ReadStream): ReadableStream<Uint8Array> {
  return Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>;
}

/**
 * Once the last byte of a device download has been handed to the client,
 * remove the video, its thumbnail and the DB record from the server.
 * An aborted download (client cancel) never reaches flush(), so it is kept.
 */
function deleteWhenSent(body: ReadableStream<Uint8Array>, id: string): ReadableStream<Uint8Array> {
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      async flush() {
        try {
          await removeJobFiles(id);
          await db.download.delete({ where: { id } });
        } catch (err) {
          console.error(`[file] could not clean up ${id} after download`, err);
        }
      },
    }),
  );
}

function safeFileName(title: string, ext: string): string {
  const clean = title.replace(/[\r\n"\\/]+/g, " ").trim().slice(0, 150) || "video";
  return `${clean}.${ext || "mp4"}`;
}

/**
 * GET /api/downloads/:id/file?mode=download|inline
 * Streams the stored file with HTTP Range support. In download mode the file
 * is deleted from the server once it has been fully sent to the device.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const job = await db.download.findUnique({ where: { id } });
  if (!job || !job.filePath) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const ext = job.container ?? "mp4";
  const expectedPath = finalFilePath(job.id, ext);
  const filePath = job.filePath;
  let stat;
  try {
    stat = await fsp.stat(filePath);
  } catch {
    return NextResponse.json({ error: "The file no longer exists on disk." }, { status: 404 });
  }

  const mode = req.nextUrl.searchParams.get("mode") ?? "inline";
  const isDownload = mode === "download";
  const fileName = safeFileName(job.title, ext);
  const asciiFallback = `download-${job.id.slice(-8)}.${ext}`;

  const baseHeaders: Record<string, string> = {
    "Content-Type": mimeForExt(ext),
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
    "Content-Disposition": isDownload
      ? `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
      : "inline",
  };

  const rangeHeader = req.headers.get("range");
  const rangeMatch = rangeHeader ? /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim()) : null;

  if (rangeMatch && (rangeMatch[1] !== "" || rangeMatch[2] !== "")) {
    const size = stat.size;
    let start: number;
    let end: number;
    if (rangeMatch[1] === "") {
      // suffix range: bytes=-N
      const suffix = parseInt(rangeMatch[2], 10);
      start = Math.max(0, size - suffix);
      end = size - 1;
    } else {
      start = parseInt(rangeMatch[1], 10);
      end = rangeMatch[2] === "" ? size - 1 : Math.min(parseInt(rangeMatch[2], 10), size - 1);
    }
    if (isNaN(start) || start >= size || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    const stream = toWebStream(createReadStream(filePath, { start, end }));
    // A resumed download that reaches the end of the file finishes the save.
    const body = isDownload && end === size - 1 ? deleteWhenSent(stream, job.id) : stream;
    return new Response(body, {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      },
    });
  }

  const stream = toWebStream(createReadStream(filePath));
  return new Response(isDownload ? deleteWhenSent(stream, job.id) : stream, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(stat.size) },
  });
}
