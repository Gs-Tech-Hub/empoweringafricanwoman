import Link from "next/link";

type AboutSectionProps = {
  eyebrow: string;
  title: string;
  lead: string;
  values: { id: string; title: string; description: string }[];
};

export function AboutSection({ eyebrow, title, lead, values }: AboutSectionProps) {
  if (!title && !lead && values.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-ivory py-16 md:py-24" id="mission">
      <div className="content-container">
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          <div className="gold-divider mb-6" />
          {title ? <h2 className="section-heading mb-6">{title}</h2> : null}
          {lead ? <p className="text-lg leading-relaxed text-brand-muted">{lead}</p> : null}
        </div>

        {values.length > 0 ? (
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <article
                key={value.id}
                className="card-programme p-8 text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {value.title ? (
                  <h3 className="font-heading text-xl font-semibold text-brand-charcoal">
                    {value.title}
                  </h3>
                ) : null}
                {value.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">{value.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        <div className="mt-10 text-center">
          <Link href="/about" className="button-secondary">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
