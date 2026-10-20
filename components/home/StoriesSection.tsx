import Image from "next/image";
import Link from "next/link";
import type { PageContent } from "@/lib/content/site-content";
import { getMediaUrl } from "@/lib/utils";

type Story = {
  id: string;
  authorName: string;
  content: string;
  title: string | null;
  mediaAsset: { id: string; altText: string | null } | null;
};

type StoriesSectionProps = {
  stories: Story[];
  content: PageContent;
};

export function StoriesSection({ stories, content }: StoriesSectionProps) {
  const featured = stories.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-ivory py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div data-aos="fade-up">
            {content.stories?.eyebrow?.value ? (
              <p className="eyebrow mb-4">{content.stories.eyebrow.value}</p>
            ) : null}
            <div className="gold-divider mb-6 !mx-0" />
            <h2 className="section-heading">{content.stories?.title?.value || "Stories"}</h2>
            {content.stories?.description?.value ? (
              <p className="mt-4 max-w-xl text-sm text-brand-muted">
                {content.stories.description.value}
              </p>
            ) : null}
          </div>
          <Link href="/stories" className="button-secondary" data-aos="fade-up">
            View all stories
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((story, index) => (
            <blockquote
              key={story.id}
              className="card-programme flex flex-col p-6"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
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
                <h3 className="mb-3 font-heading text-lg font-semibold text-brand-primary">
                  {story.title}
                </h3>
              ) : null}
              <p className="flex-1 text-sm leading-relaxed text-brand-muted">&ldquo;{story.content}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-brand-charcoal">
                — {story.authorName}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
