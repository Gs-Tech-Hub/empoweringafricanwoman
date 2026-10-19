import { impactTargets } from "@/config/impact";

export function ImpactSection() {
  return (
    <section className="bg-brand-primary py-16 text-brand-ivory md:py-24">
      <div className="content-container">
        <div className="mb-12 max-w-2xl" data-aos="fade-up">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">
            Impact
          </p>
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">
            Goals We Are Working Toward
          </h2>
          <p className="mt-4 text-sm text-brand-ivory/80">
            Figures below are organisational targets until independently verified and published
            with evidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {impactTargets.map((item, index) => (
            <article
              key={item.id}
              className="rounded-[var(--radius-luxury)] border border-brand-secondary/30 bg-brand-primary/80 p-6"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <p className="font-heading text-4xl font-semibold text-brand-secondary">{item.value}</p>
              <h3 className="mt-2 text-sm font-semibold">{item.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-brand-ivory/75">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
