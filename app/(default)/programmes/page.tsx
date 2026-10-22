import type { Metadata } from "next";
import Image from "next/image";
import ContentPage from "@/components/content/ContentPage";
import EventSections from "@/components/content/EventSections";
import { getCurrentRegion } from "@/lib/region/get-current-region";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getPublishedCollectionItems } from "@/lib/queries";
import { getMediaUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getCurrentRegion();
  const content = await getPageContent("programmes", region);
  return {
    title: getContentValue(content, "page", "title") || "Programmes",
    description: getContentValue(content, "page", "description") || undefined,
  };
}

export default async function ProgrammesPage() {
  const region = await getCurrentRegion();
  const [content, programmes] = await Promise.all([
    getPageContent("programmes", region),
    getPublishedCollectionItems(region),
  ]);

  return (
    <>
      <ContentPage content={content} title="Programmes" />
      <EventSections content={content} kind="planned" />
      {programmes.length ? (
        <section className="bg-brand-ivory py-16 md:py-24">
          <div className="content-container grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme) => {
              const imageUrl =
                programme.mediaAsset?.mediaType === "IMAGE"
                  ? getMediaUrl(programme.mediaAsset)
                  : null;

              return (
                <article key={programme.id} className="card-programme">
                  {imageUrl ? (
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={imageUrl}
                        alt={programme.mediaAsset?.altText ?? ""}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <p className="eyebrow">{programme.category.name}</p>
                    <h2 className="mt-2 font-heading text-xl font-semibold text-brand-primary">
                      {programme.name}
                    </h2>
                    {programme.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                        {programme.description}
                      </p>
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
