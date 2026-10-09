import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInstagramReelEmbedUrl, getTikTokEmbedUrl } from "@/lib/utils";

export const runtime = "nodejs";

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  categoryId: z.string().min(1, "Category is required"),
  imageFileId: z.string().optional(),
  imageFileName: z.string().optional(),
  instagramReelUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || getInstagramReelEmbedUrl(value), "Enter a valid Instagram Reel URL"),
  tiktokReelUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || getTikTokEmbedUrl(value), "Enter a valid TikTok video URL"),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.collectionItem.findMany({
    include: { category: true },
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

    const item = await prisma.collectionItem.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        price: parsed.price !== undefined && parsed.price !== "" ? parsed.price : null,
        categoryId: parsed.categoryId,
        imageFileId: parsed.imageFileId,
        imageFileName: parsed.imageFileName,
        instagramReelUrl: parsed.instagramReelUrl || null,
        tiktokReelUrl: parsed.tiktokReelUrl || null,
      },
      include: { category: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create collection item" }, { status: 500 });
  }
}
