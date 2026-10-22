import type { Metadata } from "next";
import ContentPage from "@/components/content/ContentPage";
import BeneficiaryStoryCard from "@/components/content/BeneficiaryStoryCard";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getPublishedReviews } from "@/lib/queries";
import { getCurrentRegion } from "@/lib/region/get-current-region";

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
      <section className="bg-brand-ivory py-16 md:py-24" aria-labelledby="beneficiary-stories">
        <div className="content-container">
          <header className="mb-10 max-w-3xl">
            <p className="eyebrow mb-4">Voices and experiences</p>
            <div className="gold-divider mb-6 !mx-0" />
            <h2 id="beneficiary-stories" className="section-heading">
              Beneficiary stories
            </h2>
            <p className="mt-4 leading-relaxed text-brand-muted">
              Read and watch stories shared with permission by the women and communities involved
              in our work.
            </p>
          </header>
          {stories.length ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <BeneficiaryStoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="card-luxury p-6 text-brand-muted">
              Stories will appear here once a participant-approved story is ready to share.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
