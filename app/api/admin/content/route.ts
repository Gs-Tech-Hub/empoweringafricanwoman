import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const contentEntrySchema = z.object({
  section: z.string().trim().min(1).max(80),
  field: z.string().trim().min(1).max(80),
  value: z.string().max(10000).optional(),
  mediaAssetId: z.string().trim().optional().or(z.literal("")),
});

const contentSchema = z.object({
  page: z.enum([
    "home",
    "about",
    "programmes",
    "impact",
    "stories",
    "locations",
    "donate",
    "site",
  ]),
  region: z.enum(["africa", "canada", "us", "global"]),
  entries: z.array(contentEntrySchema).max(200),
});

const sharedSiteFields: Record<string, readonly string[]> = {
  contact: ["email", "phone", "address"],
  social: ["facebook", "instagram", "x", "linkedin", "youtube"],
};

export async function PUT(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = contentSchema.parse(await request.json());
    const keys = parsed.entries.map(({ section, field }) => `${section}\u0000${field}`);
    if (new Set(keys).size !== keys.length) {
      return NextResponse.json(
        { error: "Each section and field combination must be unique" },
        { status: 400 },
      );
    }

    const assetIds = Array.from(
      new Set(
        parsed.entries
          .map((entry) => entry.mediaAssetId)
          .filter((id): id is string => Boolean(id)),
      ),
    );
    if (assetIds.length) {
      const assetCount = await prisma.mediaAsset.count({
        where: { id: { in: assetIds } },
      });
      if (assetCount !== assetIds.length) {
        return NextResponse.json({ error: "A selected media asset was not found" }, { status: 400 });
      }
    }

    const contactEntries =
      parsed.page === "home"
        ? parsed.entries.filter(
            ({ section, field }) =>
              sharedSiteFields[section]?.includes(field) ?? false,
          )
        : [];
    const pageEntries =
      parsed.page === "home"
        ? parsed.entries.filter(
            (entry) =>
              !(
                sharedSiteFields[entry.section]?.includes(entry.field) ?? false
              ),
          )
        : parsed.entries;

    const operations = [
      prisma.siteContent.deleteMany({
        where: {
          page: parsed.page,
          region: parsed.region,
          ...(pageEntries.length
            ? {
                NOT: {
                  OR: pageEntries.map(({ section, field }) => ({ section, field })),
                },
              }
            : {}),
        },
      }),
      ...pageEntries.map(({ section, field, value, mediaAssetId }) =>
        prisma.siteContent.upsert({
          where: {
            page_region_section_field: {
              page: parsed.page,
              region: parsed.region,
              section,
              field,
            },
          },
          create: {
            page: parsed.page,
            region: parsed.region,
            section,
            field,
            value: value ?? null,
            mediaAssetId: mediaAssetId || null,
          },
          update: {
            value: value ?? null,
            mediaAssetId: mediaAssetId || null,
          },
        }),
      ),
      ...contactEntries.map(({ section, field, value }) =>
        prisma.siteContent.upsert({
          where: {
            page_region_section_field: {
              page: "site",
              region: parsed.region,
              section,
              field,
            },
          },
          create: {
            page: "site",
            region: parsed.region,
            section,
            field,
            value: value ?? null,
          },
          update: { value: value ?? null },
        }),
      ),
    ];

    await prisma.$transaction(operations);
    return NextResponse.json({ success: true, count: parsed.entries.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("[admin content] Failed to save page content", error);
    return NextResponse.json({ error: "Failed to save page content" }, { status: 500 });
  }
}
