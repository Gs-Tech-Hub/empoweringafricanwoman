import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const updateProgrammeSchema = z.object({
  published: z.boolean(),
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
    const parsed = updateProgrammeSchema.parse(await request.json());
    const item = await prisma.collectionItem.update({
      where: { id },
      data: { published: parsed.published },
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin programmes] Failed to update programme", { id, error });
    return NextResponse.json({ error: "Failed to update programme" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const item = await prisma.collectionItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Programme not found" }, { status: 404 });
    }

    await prisma.collectionItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin programmes] Failed to delete programme", { id, error });
    return NextResponse.json({ error: "Failed to delete programme" }, { status: 500 });
  }
}
