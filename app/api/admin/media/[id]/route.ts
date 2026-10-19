import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const updateMediaSchema = z.object({
  altText: z.string().trim().max(500).optional(),
  caption: z.string().trim().max(1000).optional(),
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
    const parsed = updateMediaSchema.parse(await request.json());
    const existing = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: {
        altText: parsed.altText || null,
        caption: parsed.caption || null,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin media] Failed to update media metadata", { id, error });
    return NextResponse.json({ error: "Failed to update media metadata" }, { status: 500 });
  }
}
