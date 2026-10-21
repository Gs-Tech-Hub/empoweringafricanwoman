import Link from "next/link";
import { redirect } from "next/navigation";
import ContentEditor from "@/components/admin/content-editor";
import ContentFilters from "@/components/admin/content-filters";
import { adminContentDefinitions } from "@/config/admin-content";
import { adminPages, isAdminPageId } from "@/config/admin-pages";
import { regionList, isRegionId } from "@/config/regions";
import { auth } from "@/lib/auth";
import { getRegionalContentEntries } from "@/lib/content/site-content";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/lib/utils";

export const metadata = {
  title: "Page Editor",
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
  const page = params.page && isAdminPageId(params.page) ? params.page : "home";
  const pageDetails = adminPages.find((item) => item.id === page);
  const relatedTool =
    pageDetails && "relatedTool" in pageDetails ? pageDetails.relatedTool : undefined;
  const region = params.region && isRegionId(params.region) ? params.region : "global";
  const [entries, media] = await Promise.all([
    getRegionalContentEntries(region, page),
    prisma.mediaAsset.findMany({
      select: { id: true, fileId: true, fileName: true, mediaType: true, altText: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Page editor</p>
        <h1 className="mt-2 font-heading text-3xl font-light text-brand-primary">
          {pageDetails?.title}
        </h1>
        <p className="mt-2 max-w-3xl text-brand-muted">
          {pageDetails?.description} Choose a region below to edit its content. Regional entries
          override the shared global version.
        </p>
        {relatedTool ? (
          <Link
            href={relatedTool.href}
            className="mt-3 inline-flex text-sm font-medium text-brand-primary underline underline-offset-4"
          >
            {relatedTool.label}
          </Link>
        ) : null}
      </div>

      <ContentFilters
        page={page}
        region={region}
        pages={adminPages}
        regions={regionList}
      />

      <ContentEditor
        key={`${page}-${region}`}
        page={page}
        region={region}
        definition={adminContentDefinitions[page]}
        initialEntries={entries.map((entry) => ({
          id: entry.id,
          section: entry.section,
          field: entry.field,
          value: entry.value ?? "",
          mediaAssetId: entry.mediaAssetId ?? "",
        }))}
        media={media.map((asset) => ({
          id: asset.id,
          fileName: asset.fileName,
          mediaType: asset.mediaType,
          url: getMediaUrl(asset)!,
          altText: asset.altText,
        }))}
      />
    </div>
  );
}
