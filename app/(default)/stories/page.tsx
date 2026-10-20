import type { Metadata } from "next";
import Image from "next/image";
import ContentPage from "@/components/content/ContentPage";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getPublishedReviews } from "@/lib/queries";
import { getCurrentRegion } from "@/lib/region/get-current-region";
import { getMediaUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getCurrentRegion();
  const content = await getPageContent("stories", region);
  return {
    title: getContentValue(content, "page", "title") || "Stories",
    description: getContentValue(content, "page", "description") || undefined,
  };
}

export default async function StoriesPage() {
  const region = await getCurrentRegion();
  const [content, stories] = await Promise.all([
    getPageContent("stories", region),
    getPublishedReviews(region),
  ]);

  return (
    <>
      <ContentPage content={content} title="Stories" />
      {stories.length ? (
        <section className="bg-brand-ivory py-16 md:py-24">
          <div className="content-container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <blockquote key={story.id} className="card-programme flex flex-col p-6">
                {story.mediaAsset ? (
                  <Image
                    src={getMediaUrl(story.mediaAsset.id)!}
                    alt={story.mediaAsset.altText ?? ""}
                    width={600}
                    height={400}
                    unoptimized
                    className="mb-5 aspect-[4/3] w-full rounded-lg object-cover"
                  />
                ) : null}
                {story.title ? (
                  <h2 className="mb-3 font-heading text-lg font-semibold text-brand-primary">
                    {story.title}
                  </h2>
                ) : null}
                <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
                  “{story.content}”
                </p>
                <footer className="mt-5 text-sm font-semibold text-brand-primary">
                  — {story.authorName}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
