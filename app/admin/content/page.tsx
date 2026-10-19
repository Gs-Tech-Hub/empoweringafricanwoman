import { redirect } from "next/navigation";
import ContentEditor from "@/components/admin/content-editor";
import { regionList, isRegionId } from "@/config/regions";
import { getRegionalContent } from "@/content";
import { auth } from "@/lib/auth";
import { getPageContent } from "@/lib/content/site-content";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Manage Website Content",
};

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const region = params.region && isRegionId(params.region) ? params.region : "global";
  const [defaults, pageContent, media] = await Promise.all([
    Promise.resolve(getRegionalContent(region)),
    getPageContent("home", region),
    prisma.mediaAsset.findMany({
      where: { mediaType: { in: ["IMAGE", "VIDEO"] } },
      select: { id: true, fileName: true, mediaType: true, altText: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal">
          Website Content
        </h1>
        <p className="mt-2 text-brand-muted">
          Regional values override the shared global version. Unconfigured fields use regional
          defaults until you save approved copy here.
        </p>
      </div>

      <form action="/admin/content" method="get" className="max-w-sm">
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
      </form>

      <ContentEditor
        region={region}
        heroEyebrow={pageContent.hero?.eyebrow?.value ?? defaults.hero.eyebrow}
        heroTitle={pageContent.hero?.title?.value ?? defaults.hero.title}
        heroDescription={pageContent.hero?.description?.value ?? defaults.hero.description}
        heroMediaId={pageContent.hero?.media?.mediaAssetId ?? ""}
        aboutLead={pageContent.about?.lead?.value ?? defaults.aboutLead}
        media={media}
      />
    </div>
  );
}
