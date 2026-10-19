import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type PageContentEntry = Prisma.SiteContentGetPayload<{
  include: { mediaAsset: true };
}>;

export async function getPageContent(page: string, region: string) {
  const content: Record<string, Record<string, PageContentEntry>> = {};

  try {
    const entries = await prisma.siteContent.findMany({
      where: { page, region: { in: ["global", region] } },
      include: { mediaAsset: true },
    });

    for (const entry of entries.sort(
      (left, right) => Number(right.region === "global") - Number(left.region === "global"),
    )) {
      content[entry.section] ??= {};
      content[entry.section][entry.field] = entry;
    }
  } catch (error) {
    console.error("[site content] Could not load database content; using regional defaults", {
      page,
      region,
      error,
    });
  }

  return content;
}
