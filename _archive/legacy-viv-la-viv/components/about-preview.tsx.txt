import Link from "next/link";
import { aboutContent } from "@/lib/content/about";

export default function AboutPreview() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-brand-border py-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="section-subtitle mb-4" data-aos="fade-up">
                Our Story
              </p>
              <h2
                className="font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal md:text-4xl"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                Founded in {aboutContent.foundedDate}
              </h2>
              <p
                className="mt-6 leading-8 text-brand-muted"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                {aboutContent.story[0]}
              </p>
              <Link
                href="/about"
                className="btn btn-primary mt-8 inline-flex"
                data-aos="fade-up"
                data-aos-delay={300}
              >
                Learn More About Us
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {aboutContent.values.map((value, index) => (
                <div
                  key={value.title}
                  className="card-luxury p-5"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h3 className="font-heading text-sm uppercase tracking-wider text-brand-secondary">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
