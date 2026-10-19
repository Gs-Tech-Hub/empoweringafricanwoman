import Link from "next/link";
import { aboutContent } from "@/lib/content/about";

type AboutSectionProps = {
  lead?: string;
};

export function AboutSection({ lead }: AboutSectionProps) {
  return (
    <section className="bg-brand-ivory py-16 md:py-24" id="mission">
      <div className="content-container">
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <p className="eyebrow mb-4">About Us</p>
          <div className="gold-divider mb-6" />
          <h2 className="section-heading mb-6">Our Mission</h2>
          <p className="text-lg leading-relaxed text-brand-muted">
            {lead ?? aboutContent.story[0]}
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {aboutContent.values.map((value, index) => (
            <article
              key={value.title}
              className="card-programme p-8 text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h3 className="font-heading text-xl font-semibold text-brand-charcoal">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">{value.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/about" className="button-secondary">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
