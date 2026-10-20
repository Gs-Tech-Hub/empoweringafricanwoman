import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const updateLocationSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  address: z.string().trim().min(1).max(1000).optional(),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  region: z.enum(["africa", "canada", "us", "global"]).optional(),
  mediaAssetId: z.string().trim().optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  mapEmbedUrl: z.string().trim().url().max(2000).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const parsed = updateLocationSchema.parse(await request.json());
    if (parsed.mediaAssetId) {
      const media = await prisma.mediaAsset.findFirst({
        where: { id: parsed.mediaAssetId, mediaType: "IMAGE" },
        select: { id: true },
      });
      if (!media) {
        return NextResponse.json({ error: "Choose an image from the media library" }, { status: 400 });
      }
    }
    if (parsed.mapEmbedUrl) {
      const mapUrl = new URL(parsed.mapEmbedUrl);
      if (
        mapUrl.protocol !== "https:" ||
        mapUrl.hostname !== "www.google.com" ||
        !mapUrl.pathname.startsWith("/maps/embed")
      ) {
        return NextResponse.json({ error: "Use a secure Google Maps embed URL" }, { status: 400 });
      }
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(parsed.name !== undefined ? { name: parsed.name } : {}),
        ...(parsed.address !== undefined ? { address: parsed.address } : {}),
        ...(parsed.phone !== undefined ? { phone: parsed.phone || null } : {}),
        ...(parsed.email !== undefined ? { email: parsed.email || null } : {}),
        ...(parsed.region !== undefined ? { region: parsed.region } : {}),
        ...(parsed.latitude !== undefined ? { latitude: parsed.latitude } : {}),
        ...(parsed.longitude !== undefined ? { longitude: parsed.longitude } : {}),
        ...(parsed.mapEmbedUrl !== undefined ? { mapEmbedUrl: parsed.mapEmbedUrl || null } : {}),
        ...(parsed.mediaAssetId !== undefined
          ? { mediaAssetId: parsed.mediaAssetId || null }
          : {}),
        ...(parsed.sortOrder !== undefined ? { sortOrder: parsed.sortOrder } : {}),
        ...(parsed.published !== undefined ? { published: parsed.published } : {}),
      },
    });
    return NextResponse.json(branch);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin locations] Failed to update location", { id, error });
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}
