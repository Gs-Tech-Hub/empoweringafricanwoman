import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const locationSchema = z.object({
  name: z.string().trim().min(1).max(160),
  address: z.string().trim().min(1).max(1000),
  phone: z.string().trim().max(80).optional(),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  region: z.enum(["africa", "canada", "us", "global"]),
  mediaAssetId: z.string().trim().optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  mapEmbedUrl: z.string().trim().url().max(2000).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(10000),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = locationSchema.parse(await request.json());
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

    const branch = await prisma.branch.create({
      data: {
        name: parsed.name,
        address: parsed.address,
        phone: parsed.phone || null,
        email: parsed.email || null,
        latitude: parsed.latitude ?? null,
        longitude: parsed.longitude ?? null,
        mapEmbedUrl: parsed.mapEmbedUrl || null,
        region: parsed.region,
        mediaAssetId: parsed.mediaAssetId || null,
        sortOrder: parsed.sortOrder,
        published: false,
      },
    });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin locations] Failed to create location", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
