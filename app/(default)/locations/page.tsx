import type { Metadata } from "next";
import Image from "next/image";
import ContentPage from "@/components/content/ContentPage";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getPublishedBranches } from "@/lib/queries";
import { getCurrentRegion } from "@/lib/region/get-current-region";
import { getMediaUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getCurrentRegion();
  const content = await getPageContent("locations", region);
  return {
    title: getContentValue(content, "page", "title") || "Locations",
    description: getContentValue(content, "page", "description") || undefined,
  };
}

export default async function LocationsPage() {
  const region = await getCurrentRegion();
  const [content, branches] = await Promise.all([
    getPageContent("locations", region),
    getPublishedBranches(region),
  ]);

  return (
    <>
      <ContentPage content={content} title="Locations" />
      {branches.length ? (
        <section className="bg-brand-ivory py-16 md:py-24">
          <div className="content-container grid gap-8 md:grid-cols-2">
            {branches.map((branch) => {
              const imageUrl =
                branch.mediaAsset?.mediaType === "IMAGE"
                  ? getMediaUrl(branch.mediaAsset)
                  : null;

              return (
                <article key={branch.id} className="card-programme overflow-hidden">
                  {imageUrl ? (
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={imageUrl}
                        alt={branch.mediaAsset?.altText ?? ""}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-3 p-6">
                    <h2 className="font-heading text-xl font-semibold text-brand-primary">
                      {branch.name}
                    </h2>
                    <address className="not-italic text-sm leading-relaxed text-brand-muted">
                      {branch.address}
                    </address>
                    {branch.phone ? (
                      <p className="text-sm text-brand-muted">
                        <a href={`tel:${branch.phone}`} className="underline underline-offset-2">
                          {branch.phone}
                        </a>
                      </p>
                    ) : null}
                    {branch.email ? (
                      <p className="text-sm text-brand-muted">
                        <a href={`mailto:${branch.email}`} className="underline underline-offset-2">
                          {branch.email}
                        </a>
                      </p>
                    ) : null}
                    {branch.mapEmbedUrl ? (
                      <iframe
                        title={`Map for ${branch.name}`}
                        src={branch.mapEmbedUrl}
                        className="mt-4 min-h-72 w-full rounded-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
