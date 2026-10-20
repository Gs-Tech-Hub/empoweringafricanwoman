import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const updateStorySchema = z.object({
  title: z.string().trim().max(240).optional(),
  authorName: z.string().trim().min(1).max(120).optional(),
  content: z.string().trim().min(1).max(10000).optional(),
  region: z.enum(["africa", "canada", "us", "global"]).optional(),
  consentConfirmed: z.boolean().optional(),
  published: z.boolean().optional(),
  mediaAssetId: z.string().trim().optional().or(z.literal("")),
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
    const parsed = updateStorySchema.parse(await request.json());
    const current = await prisma.review.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const consentConfirmed = parsed.consentConfirmed ?? current.consentConfirmed;
    const published =
      parsed.consentConfirmed === false
        ? false
        : parsed.published ?? current.published;
    if (published && !consentConfirmed) {
      return NextResponse.json(
        { error: "Confirm participant consent before publishing this story" },
        { status: 400 },
      );
    }

    if (parsed.mediaAssetId) {
      const media = await prisma.mediaAsset.findFirst({
        where: { id: parsed.mediaAssetId, mediaType: "IMAGE" },
        select: { id: true },
      });
      if (!media) {
        return NextResponse.json({ error: "Choose an image from the media library" }, { status: 400 });
      }
    }

    const story = await prisma.review.update({
      where: { id },
      data: {
        ...(parsed.title !== undefined ? { title: parsed.title || null } : {}),
        ...(parsed.authorName !== undefined ? { authorName: parsed.authorName } : {}),
        ...(parsed.content !== undefined ? { content: parsed.content } : {}),
        ...(parsed.region !== undefined ? { region: parsed.region } : {}),
        ...(parsed.consentConfirmed !== undefined ? { consentConfirmed } : {}),
        ...(parsed.published !== undefined ? { published } : {}),
        ...(parsed.mediaAssetId !== undefined
          ? { mediaAssetId: parsed.mediaAssetId || null }
          : {}),
      },
    });
    return NextResponse.json(story);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin stories] Failed to update story", { id, error });
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}
