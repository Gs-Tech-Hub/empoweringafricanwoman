import Link from "next/link";

export default function Cta() {
  return (
    <section className="relative overflow-hidden border-t border-brand-border bg-brand-ivory">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(205,163,73,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-subtitle mb-4" data-aos="fade-up">
            Visit Us
          </p>
          <div className="mx-auto mb-6 h-px w-16 bg-gold" />
          <h2
            className="font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal md:text-4xl"
            data-aos="fade-up"
            data-aos-delay={100}
          >
            Visit us in person
          </h2>
          <p
            className="mx-auto mb-10 mt-6 max-w-xl leading-8 text-brand-muted"
            data-aos="fade-up"
            data-aos-delay={200}
          >
            Experience our collections at one of our boutique locations. Our
            stylists are ready to help you find your perfect look.
          </p>
          <div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            data-aos="fade-up"
            data-aos-delay={300}
          >
            <Link className="btn btn-primary" href="/locations">
              Our Locations
            </Link>
            <Link className="btn btn-secondary" href="/collections">
              Browse Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
