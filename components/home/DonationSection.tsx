type DonationSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function DonationSection({
  eyebrow,
  title,
  description,
}: DonationSectionProps) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  return (
    <section className="bg-brand-ivory py-16 md:py-24" id="donate">
      <div className="content-container">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div data-aos="fade-up">
            {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
            <div className="gold-divider mb-6 !mx-0" />
            {title ? <h2 className="section-heading mb-4">{title}</h2> : null}
            {description ? (
              <p className="leading-relaxed text-brand-muted">{description}</p>
            ) : null}
          </div>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="rounded-xl border border-brand-border bg-white p-6 text-sm leading-relaxed text-brand-muted"
          >
            Online donations are not available yet. Please check back after secure payment
            processing is set up.
          </p>
        </div>
      </div>
    </section>
  );
}
