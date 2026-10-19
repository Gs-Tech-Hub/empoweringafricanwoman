export const metadata = {
  title: "About",
  description:
    "Learn about Viv La Viv Boutique — our story, values, and commitment to curated fashion.",
};

import Brand from "@/components/ui/brand";
import { aboutContent } from "@/lib/content/about";

export default function AboutPage() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-subtitle mb-4" data-aos="fade-up">
              Founded {aboutContent.foundedDate}
            </p>
            <div className="mx-auto mb-6 h-px w-16 bg-gold" />
            <h1
              className="font-heading text-4xl font-light uppercase tracking-widest text-brand-charcoal md:text-5xl"
              data-aos="fade-up"
            >
              About <Brand size="md" />
            </h1>
            <p
              className="mt-6 text-lg leading-8 text-brand-muted"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              {aboutContent.tagline}
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl space-y-6 leading-8 text-brand-text">
            {aboutContent.story.map((paragraph, index) => (
              <p
                key={paragraph}
                data-aos="fade-up"
                data-aos-delay={150 + index * 100}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {aboutContent.values.map((value, index) => (
              <article
                key={value.title}
                className="card-luxury p-6"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <span className="font-heading text-sm font-light">{index + 1}</span>
                </div>
                <h2 className="font-heading text-xl font-light uppercase tracking-wider text-brand-charcoal">
                  {value.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
