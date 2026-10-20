import { prisma } from "@/lib/prisma";

export async function getFeaturedCollections(limit = 6, region = "global") {
  return prisma.collectionItem.findMany({
    where: { published: true, region: { in: ["global", region] } },
    include: { category: true, mediaAsset: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedReviews(region = "global") {
  return prisma.review.findMany({
    where: { published: true, consentConfirmed: true, region: { in: ["global", region] } },
    include: { mediaAsset: true },
    orderBy: [{ sortOrder: "asc" }, { authorName: "asc" }],
  });
}

export async function getPublishedBranches(region = "global") {
  return prisma.branch.findMany({
    where: { published: true, region: { in: ["global", region] } },
    include: { mediaAsset: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getPublishedCollectionItems(region = "global") {
  return prisma.collectionItem.findMany({
    where: { published: true, region: { in: ["global", region] } },
    include: { category: true, mediaAsset: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getAdminCollectionItems() {
  return prisma.collectionItem.findMany({
    include: { category: true, mediaAsset: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAdminCounts() {
  const [categoryCount, collectionCount, contentCount, mediaCount] = await Promise.all([
    prisma.category.count(),
    prisma.collectionItem.count(),
    prisma.siteContent.count(),
    prisma.mediaAsset.count(),
  ]);
  return { categoryCount, collectionCount, contentCount, mediaCount };
}
