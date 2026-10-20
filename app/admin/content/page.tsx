import { redirect } from "next/navigation";
import ContentEditor, { contentPages } from "@/components/admin/content-editor";
import { regionList, isRegionId } from "@/config/regions";
import { auth } from "@/lib/auth";
import { getRegionalContentEntries } from "@/lib/content/site-content";
import { prisma } from "@/lib/prisma";

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

      <form action="/admin/content" method="get" className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="content-page" className="mb-1 block text-sm text-brand-muted">
            Page
          </label>
          <select
            id="content-page"
            name="page"
            defaultValue={page}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
            className="form-select w-full"
          >
            {contentPages.map((item) => (
              <option key={item} value={item}>
                {item === "site" ? "Site-wide content" : item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content-region" className="mb-1 block text-sm text-brand-muted">
            Region
          </label>
          <select
            id="content-region"
            name="region"
            defaultValue={region}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
            className="form-select w-full"
          >
            {regionList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </form>

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
