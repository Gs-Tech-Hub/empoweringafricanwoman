import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const storySchema = z.object({
  title: z.string().trim().max(240).optional(),
  authorName: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(10000),
  region: z.enum(["africa", "canada", "us", "global"]),
  consentConfirmed: z.boolean(),
  mediaAssetId: z.string().trim().nullable().optional(),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = storySchema.parse(await request.json());
    if (parsed.mediaAssetId) {
      const media = await prisma.mediaAsset.findFirst({
        where: { id: parsed.mediaAssetId, mediaType: { in: ["IMAGE", "VIDEO"] } },
        select: { id: true },
      });
      if (!media) {
        return NextResponse.json(
          { error: "Choose an image or video from the media library" },
          { status: 400 },
        );
      }
    }

    const story = await prisma.review.create({
      data: {
        title: parsed.title || null,
        authorName: parsed.authorName,
        content: parsed.content,
        region: parsed.region,
        consentConfirmed: parsed.consentConfirmed,
        published: false,
        mediaAssetId: parsed.mediaAssetId || null,
        rating: null,
      },
    });
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin stories] Failed to create story", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
