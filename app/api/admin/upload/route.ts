import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { isDriveConfigured, uploadFileToDrive } from "@/lib/google-drive";
import { isSupabaseConfigured, uploadFileToSupabase } from "@/lib/supabase-storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  console.log("[upload] request received", {
    method: request.method,
    url: request.url,
    driveConfigured: isDriveConfigured(),
    supabaseConfigured: isSupabaseConfigured(),
  });

  if (!session) {
    console.error("[upload] unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDriveConfigured() && !isSupabaseConfigured()) {
    console.error("[upload] no storage backend configured");
    return NextResponse.json(
      { error: "No media storage backend is configured. Set either Google Drive or Supabase env vars." },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    console.log("[upload] parsed form data", { fileType: file instanceof File ? file.type : null });

    if (!(file instanceof File)) {
      console.error("[upload] invalid file payload", { file });
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isSupportedImage = [
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ].includes(file.type);
    const isSupportedVideo = ["video/mp4", "video/quicktime", "video/webm"].includes(
      file.type,
    );
    const isSupportedAudio = [
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
      "audio/wav",
      "audio/webm",
    ].includes(file.type);
    const mediaType = isSupportedImage
      ? "IMAGE"
      : isSupportedVideo
        ? "VIDEO"
        : isSupportedAudio
          ? "AUDIO"
          : file.type === "application/pdf"
            ? "DOCUMENT"
            : null;

    if (!mediaType) {
      return NextResponse.json(
        { error: "Upload a supported image, video, audio file, or PDF" },
        { status: 400 },
      );
    }

    const altText = formData.get("altText");
    const caption = formData.get("caption");
    if (
      (typeof altText === "string" && altText.length > 500) ||
      (typeof caption === "string" && caption.length > 1000)
    ) {
      return NextResponse.json({ error: "Media description is too long" }, { status: 400 });
    }

    const maxFileSize = mediaType === "VIDEO" ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size === 0 || file.size > maxFileSize) {
      return NextResponse.json(
        {
          error:
            mediaType === "VIDEO"
              ? "Video files must be smaller than 100 MB"
              : "Files must be smaller than 25 MB",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageProvider = isSupabaseConfigured() ? "SUPABASE" : "GOOGLE_DRIVE";
    const result = storageProvider === "SUPABASE"
      ? await uploadFileToSupabase(buffer, file.name, file.type)
      : await uploadFileToDrive(buffer, file.name, file.type);

    const asset = await prisma.mediaAsset.create({
      data: {
        fileId: result.fileId,
        fileName: result.fileName,
        mimeType: file.type,
        mediaType,
        storageProvider,
        altText: typeof altText === "string" ? altText.trim() || null : null,
        caption: typeof caption === "string" ? caption.trim() || null : null,
      },
    });

    console.log("[upload] upload success", { mediaAssetId: asset.id });
    return NextResponse.json({
      fileId: result.fileId,
      fileName: result.fileName,
      asset,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload file";
    console.error("[upload] exception", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
