import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/ui/brand";
import { getPublishedBranches } from "@/lib/queries";
import { getImageUrl } from "@/lib/utils";

export const metadata = {
  title: "Viv La Viv — Luxury Flagship Boutique",
  description:
    "VIV LA VIV luxury fashion boutique. Discover our flagship head office, collections, and boutique locations.",
};

export default async function FlagShipPage() {
  const branches = await getPublishedBranches();
  const flagship =
    branches.find((branch) => /head|flagship/i.test(branch.name)) || branches[0];
  const imageUrl = flagship?.imageFileId
    ? getImageUrl(flagship.imageFileId)
    : null;

  return (
    <div className="overflow-hidden bg-brand-ivory text-brand-charcoal">
      <section className="relative isolate min-h-[80vh] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_45%),radial-gradient(circle_at_center,_rgba(205,163,73,0.08),_transparent_35%),var(--background-image-marble)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.65),_transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle,_rgba(255,255,255,0.35),transparent_70%)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(232,164,184,0.08),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(205,163,73,0.06),transparent_18%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mb-12 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border border-brand-border/70 bg-white/90 shadow-soft md:h-64 md:w-64">
            <Image
              src="/images/logo.jpeg"
              alt="VIV LA VIV logo"
              width={220}
              height={220}
              className="h-full w-full object-contain p-4"
            />
          </div>

          <p className="mb-4 text-xs uppercase tracking-[0.5em] text-brand-primary">
            Established • 2000
          </p>
          <h1 className="mb-6">
            <Brand size="xl" />
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-xl italic text-brand-muted md:text-2xl">
            Your Fashion Is Your IQ
          </p>
          <div className="mb-16 flex justify-center">
            <a
              href="#flagship"
              className="inline-flex rounded-full bg-brand-primary px-10 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-luxury transition hover:bg-[#8c151a] md:text-base"
            >
              Visit Flagship
            </a>
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="inline-block h-px w-16 bg-gold" />
            <span className="text-xs uppercase tracking-[0.35em] text-brand-muted">
              Scroll
            </span>
            <span className="inline-block h-px w-16 bg-gold" />
          </div>
        </div>
      </section>

      <section id="flagship" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="section-subtitle mb-4 text-brand-secondary">Flagship Store</p>
            <div className="mx-auto mb-6 h-px w-16 bg-gold" />
            <h2 className="font-heading text-4xl font-light uppercase tracking-widest text-brand-charcoal md:text-5xl">
              {flagship?.name || "Luxury Flagship Store"}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-muted">
              {flagship
                ? `Welcome to our flagship boutique, where elegance, craftsmanship, and timeless fashion converge at ${flagship.name}.`
                : "Welcome to our flagship boutique, where elegance, craftsmanship, and timeless fashion converge."}
            </p>
          </div>

          <div className="space-y-10">
            <div className="rounded-[2rem] border border-brand-border bg-brand-ivory/90 p-8 shadow-soft md:p-12">
              {/* <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-brand-primary">
                    {flagship?.address || "Benin City, Nigeria"}
                  </p>
                  <h3 className="font-heading text-3xl font-light uppercase tracking-[0.18em] text-brand-charcoal">
                    {flagship?.name || "Head Office"}
                  </h3>
                </div>
                <p className="text-base leading-7 text-brand-muted">
                  {flagship
                    ? `Find our flagship boutique at ${flagship.address}, where each visit is tailored to your personal style journey.`
                    : "Step inside an interior defined by marble veining, polished gold accents, and a carefully curated selection of luxury fashion."}
                </p>
              </div> */}

              {imageUrl ? (
                <div className="mt-10 overflow-hidden rounded-[2rem] bg-brand-marble">
                  <Image
                    src={imageUrl}
                    alt={`${flagship?.name || "Flagship"} boutique`}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
                <div className="space-y-6 rounded-[1.75rem] border border-brand-border/70 bg-white/90 p-8">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-brand-secondary">
                      Address
                    </p>
                    <p className="mt-3 text-base text-brand-charcoal">
                      {flagship?.address || "12 Royal Avenue, Victoria Island, Benin City, Edo State, Nigeria"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-brand-secondary">
                      Opening Hours
                    </p>
                    <p className="mt-3 text-base text-brand-charcoal">
                      Mon–Sat 9am–7pm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-brand-secondary">
                      Contact
                    </p>
                    <div className="mt-3 space-y-2 text-base text-brand-charcoal">
                      {flagship?.phone ? (
                        <p>
                          Phone: <a href={`tel:${flagship.phone}`} className="underline decoration-brand-primary/50">{flagship.phone}</a>
                        </p>
                      ) : (
                        <p>Phone: +234 801 234 5678</p>
                      )}
                      {flagship?.email ? (
                        <p>
                          Email: <a href={`mailto:${flagship.email}`} className="underline decoration-brand-primary/50">{flagship.email}</a>
                        </p>
                      ) : (
                        <p>Email: hello@vivalavivboutique.com</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                    <a
                      href={flagship?.latitude && flagship?.longitude ? `https://www.google.com/maps/search/?api=1&query=${flagship.latitude},${flagship.longitude}` : "https://www.google.com/maps"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8c151a]"
                    >
                      Open in Map
                    </a>
                    <Link
                      href="/locations"
                      className="inline-flex items-center justify-center rounded-full border border-brand-charcoal/10 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-charcoal transition hover:border-brand-charcoal"
                    >
                      Explore Other Locations
                    </Link>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] bg-brand-marble">
                  {flagship?.mapEmbedUrl ? (
                    <iframe
                      title={`Map for ${flagship.name}`}
                      src={flagship.mapEmbedUrl}
                      className="h-full min-h-[320px] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center px-6 py-10 text-sm text-brand-muted">
                      Map unavailable for this flagship location.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: "Women’s Collection", href: "/collections" },
                { label: "Men’s Collection", href: "/collections" },
                { label: "Accessories", href: "/collections" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-[1.75rem] border border-brand-border bg-white/90 px-6 py-5 text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-charcoal transition hover:border-brand-charcoal/20 hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="rounded-[2rem] border border-brand-border bg-brand-ivory/90 p-10 text-center shadow-soft">
              <p className="section-subtitle mb-3 text-brand-secondary">Our Clients</p>
              <h3 className="font-heading text-3xl font-light uppercase tracking-[0.18em] text-brand-charcoal md:text-4xl">
                Read stories from customers.
              </h3>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/reviews"
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8c151a] sm:w-auto"
                >
                  Testimonials
                </Link>
                <Link
                  href="/locations"
                  className="inline-flex w-full items-center justify-center rounded-full border border-brand-charcoal/10 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-charcoal transition hover:border-brand-charcoal sm:w-auto"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
