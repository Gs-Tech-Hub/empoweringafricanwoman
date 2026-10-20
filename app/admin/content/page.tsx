import { redirect } from "next/navigation";
import ContentEditor from "@/components/admin/content-editor";
import ContentFilters from "@/components/admin/content-filters";
import { regionList, isRegionId } from "@/config/regions";
import { auth } from "@/lib/auth";
import { getRegionalContentEntries } from "@/lib/content/site-content";
import { prisma } from "@/lib/prisma";

const contentPages = [
  "home",
  "about",
  "programmes",
  "impact",
  "stories",
  "locations",
  "donate",
  "site",
] as const;

export const metadata = {
  title: "Manage Website Content",
};

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; region?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = contentPages.includes(params.page as (typeof contentPages)[number])
    ? (params.page as (typeof contentPages)[number])
    : "home";
  const region = params.region && isRegionId(params.region) ? params.region : "global";
  const [entries, media] = await Promise.all([
    getRegionalContentEntries(region, page),
    prisma.mediaAsset.findMany({
      select: { id: true, fileName: true, mediaType: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-brand-primary">
          Website Content
        </h1>
        <p className="mt-2 text-brand-muted">
          Edit public page content and attach assets from the media library. Global content is the
          shared version; a regional entry overrides it for that region.
        </p>
      </div>

      <ContentFilters
        page={page}
        region={region}
        pages={contentPages}
        regions={regionList}
      />

      <ContentEditor
        key={`${page}-${region}`}
        page={page}
        region={region}
        initialEntries={entries.map((entry) => ({
          id: entry.id,
          section: entry.section,
          field: entry.field,
          value: entry.value ?? "",
          mediaAssetId: entry.mediaAssetId ?? "",
        }))}
        media={media}
      />
    </div>
  );
}
