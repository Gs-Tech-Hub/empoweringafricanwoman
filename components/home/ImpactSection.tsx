import { getContentSections, type PageContent } from "@/lib/content/site-content";

export function ImpactSection({ content }: { content: PageContent }) {
  const targets = getContentSections(content, "target")
    .map(({ id, fields }) => ({
      id,
      label: fields.label?.value ?? "",
      value: fields.value?.value ?? "",
      description: fields.description?.value ?? "",
      status: fields.status?.value ?? "target",
    }))
    .filter((target) => target.label || target.value || target.description);

  if (!content.impact?.title?.value && targets.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-primary py-16 text-brand-ivory md:py-24">
      <div className="content-container">
        <div className="mb-12 max-w-2xl" data-aos="fade-up">
          {content.impact?.eyebrow?.value ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">
              {content.impact.eyebrow.value}
            </p>
          ) : null}
          {content.impact?.title?.value ? (
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">
              {content.impact.title.value}
            </h2>
          ) : null}
          {content.impact?.description?.value ? (
            <p className="mt-4 text-sm text-brand-ivory/80">
              {content.impact.description.value}
            </p>
          ) : null}
        </div>

        {targets.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {targets.map((item, index) => (
            <article
              key={item.id}
              className="rounded-[var(--radius-luxury)] border border-brand-secondary/30 bg-brand-primary/80 p-6"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <p className="font-heading text-4xl font-semibold text-brand-secondary">{item.value}</p>
              <h3 className="mt-2 text-sm font-semibold">
                {item.label}
                {item.status.toLowerCase() !== "verified" ? " (target)" : ""}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-brand-ivory/75">{item.description}</p>
            </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
