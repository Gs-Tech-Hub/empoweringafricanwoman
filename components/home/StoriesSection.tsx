import Link from "next/link";
import { Star } from "lucide-react";

type Story = {
  id: string;
  authorName: string;
  content: string;
  rating: number;
};

type StoriesSectionProps = {
  stories: Story[];
};

export function StoriesSection({ stories }: StoriesSectionProps) {
  const featured = stories.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-ivory py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div data-aos="fade-up">
            <p className="eyebrow mb-4">Stories</p>
            <div className="gold-divider mb-6 !mx-0" />
            <h2 className="section-heading">Voices From Our Community</h2>
            <p className="mt-4 max-w-xl text-sm text-brand-muted">
              Shared with participant consent. These stories reflect personal experiences, not
              verified impact statistics.
            </p>
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
              <div className="mb-3 flex gap-0.5 text-brand-secondary" aria-hidden>
                {Array.from({ length: story.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
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
