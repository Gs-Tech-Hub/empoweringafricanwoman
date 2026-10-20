import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PageContentEntry = Prisma.SiteContentGetPayload<{
  include: { mediaAsset: true };
}>;

export type PageContent = Record<string, Record<string, PageContentEntry>>;

export async function getPageContent(page: string, region: string): Promise<PageContent> {
  const entries = await prisma.siteContent.findMany({
    where: { page, region: { in: ["global", region] } },
    include: { mediaAsset: true },
  });
  const content: PageContent = {};

  for (const entry of entries.sort(
    (left, right) => Number(right.region === "global") - Number(left.region === "global"),
  )) {
    content[entry.section] ??= {};
    content[entry.section][entry.field] = entry;
  }

  return content;
}

export function getContentValue(
  content: PageContent,
  section: string,
  field: string,
): string {
  return content[section]?.[field]?.value ?? "";
}

export function getContentSections(
  content: PageContent,
  prefix: string,
): Array<{ id: string; fields: Record<string, PageContentEntry> }> {
  return Object.entries(content)
    .filter(([section]) => section.startsWith(`${prefix}:`))
    .map(([section, fields]) => ({
      id: section.slice(prefix.length + 1),
      fields,
    }))
    .sort((left, right) => {
      const leftOrder = Number(left.fields.order?.value ?? 0);
      const rightOrder = Number(right.fields.order?.value ?? 0);
      return leftOrder - rightOrder || left.id.localeCompare(right.id);
    });
}

export async function getRegionalContentEntries(region: string, page?: string) {
  return prisma.siteContent.findMany({
    where: { region, ...(page ? { page } : {}) },
    include: { mediaAsset: true },
    orderBy: [{ page: "asc" }, { section: "asc" }, { field: "asc" }],
  });
}
