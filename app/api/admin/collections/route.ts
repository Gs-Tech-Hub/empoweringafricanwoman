import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  categoryId: z.string().min(1, "Category is required"),
  mediaAssetId: z.string().optional(),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.collectionItem.findMany({
    include: { category: true, mediaAsset: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createCollectionSchema.parse(body);

    const category = await prisma.category.findUnique({
      where: { id: parsed.categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (parsed.mediaAssetId) {
      const asset = await prisma.mediaAsset.findFirst({
        where: { id: parsed.mediaAssetId, mediaType: "IMAGE" },
        select: { id: true },
      });
      if (!asset) {
        return NextResponse.json({ error: "Choose an image from the media library" }, { status: 400 });
      }
    }

    const item = await prisma.collectionItem.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        categoryId: parsed.categoryId,
        mediaAssetId: parsed.mediaAssetId,
        published: false,
      },
      include: { category: true, mediaAsset: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin programmes] Failed to create programme", error);
    return NextResponse.json({ error: "Failed to create programme" }, { status: 500 });
  }
}
