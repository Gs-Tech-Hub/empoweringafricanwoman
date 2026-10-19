import { NextResponse } from "next/server";
import { Readable } from "stream";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFileStreamFromDrive } from "@/lib/google-drive";
import { getFileStreamFromSupabase } from "@/lib/supabase-storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: { _count: { select: { contentEntries: true } } },
  });

  if (!asset) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  if (asset._count.contentEntries === 0 && !(await requireAdminSession())) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  try {
    const stream =
      asset.storageProvider === "SUPABASE"
        ? await getFileStreamFromSupabase(asset.fileId)
        : await getFileStreamFromDrive(asset.fileId);

    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Disposition":
          asset.mediaType === "DOCUMENT"
            ? `attachment; filename*=UTF-8''${encodeURIComponent(asset.fileName)}`
            : `inline; filename*=UTF-8''${encodeURIComponent(asset.fileName)}`,
        "Cache-Control":
          asset._count.contentEntries > 0
            ? "public, max-age=86400, stale-while-revalidate=604800"
            : "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[media] Failed to load stored media", { id, error });
    return NextResponse.json({ error: "Media is temporarily unavailable" }, { status: 502 });
  }
}
