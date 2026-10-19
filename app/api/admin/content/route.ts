import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const contentSchema = z.object({
  region: z.enum(["africa", "canada", "us", "global"]),
  heroEyebrow: z.string().trim().max(120),
  heroTitle: z.string().trim().min(1).max(240),
  heroDescription: z.string().trim().max(2000),
  heroMediaId: z.string().trim().optional().or(z.literal("")),
  aboutLead: z.string().trim().max(2000),
});

export async function PUT(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = contentSchema.parse(await request.json());
    const mediaAssetId = parsed.heroMediaId || null;

    if (mediaAssetId) {
      const media = await prisma.mediaAsset.findUnique({
        where: { id: mediaAssetId },
        select: { mediaType: true },
      });

      if (!media || !["IMAGE", "VIDEO"].includes(media.mediaType)) {
        return NextResponse.json(
          { error: "Choose an image or video from the media library" },
          { status: 400 },
        );
      }
    }

    const fields = [
      { section: "hero", field: "eyebrow", value: parsed.heroEyebrow },
      { section: "hero", field: "title", value: parsed.heroTitle },
      { section: "hero", field: "description", value: parsed.heroDescription },
      { section: "hero", field: "media", value: null, mediaAssetId },
      { section: "about", field: "lead", value: parsed.aboutLead },
    ];

    await prisma.$transaction(
      fields.map(({ section, field, value, ...optionalMedia }) =>
        prisma.siteContent.upsert({
          where: {
            page_region_section_field: {
              page: "home",
              region: parsed.region,
              section,
              field,
            },
          },
          create: {
            page: "home",
            region: parsed.region,
            section,
            field,
            value,
            ...optionalMedia,
          },
          update: { value, ...optionalMedia },
        }),
      ),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin content] Failed to save page content", error);
    return NextResponse.json({ error: "Failed to save page content" }, { status: 500 });
  }
}
