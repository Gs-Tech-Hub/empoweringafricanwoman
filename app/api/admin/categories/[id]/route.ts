import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

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
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { items: true } } },
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    if (category._count.items > 0) {
      return NextResponse.json(
        { error: "Move or remove the category's programmes before deleting this category" },
        { status: 409 },
      );
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin categories] Failed to delete category", { id, error });
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
