export const metadata = {
  title: "Locations",
  description:
    "Find Viv La Viv Boutique locations, contact details, and directions.",
};

import Image from "next/image";
import { getPublishedBranches } from "@/lib/queries";
import { getImageUrl } from "@/lib/utils";

export default async function LocationsPage() {
  const branches = await getPublishedBranches();

  return (
    <section className="bg-brand-ivory text-brand-charcoal">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-subtitle mb-4">Visit Us</p>
            <div className="mx-auto mb-6 h-px w-16 bg-gold" />
            <h1 className="font-heading text-4xl font-light uppercase tracking-widest text-brand-charcoal md:text-5xl">
              Our Locations
            </h1>
            <p className="mt-6 text-lg leading-8 text-brand-muted">
              Discover each Viva La Viv branch with curated details, directions,
              and contact information.
            </p>
          </div>

          {branches.length === 0 ? (
            <p className="mt-16 text-center text-brand-muted">
              Location information coming soon.
            </p>
          ) : (
            <>
              <div className="mt-16 rounded-[2rem] border border-brand-border bg-white/90 p-6 shadow-soft">
                <p className="text-xs uppercase tracking-[0.35em] text-brand-secondary">
                  Jump to branch
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {branches.map((branch) => (
                    <a
                      key={branch.id}
                      href={`#branch-${branch.id}`}
                      className="inline-flex rounded-full border border-brand-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-charcoal transition hover:border-brand-primary hover:text-brand-primary"
                    >
                      {branch.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-16 space-y-20">
                {branches.map((branch, index) => {
                  const imageUrl = branch.imageFileId
                    ? getImageUrl(branch.imageFileId)
                    : null;

                  return (
                    <article
                      key={branch.id}
                      id={`branch-${branch.id}`}
                      className="snap-start min-h-screen rounded-[2rem] border border-brand-border bg-white/95 p-8 shadow-soft sm:p-10 lg:p-12"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="mx-auto max-w-5xl">
                        <div className="space-y-6">
                          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-secondary">
                            <span className="h-2 w-2 rounded-full bg-brand-secondary" />
                            Visit our boutique
                          </div>
                          <div>
                            <h2 className="font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal md:text-4xl">
                              {branch.name}
                            </h2>
                            <p className="mt-4 max-w-3xl text-lg leading-8 text-brand-muted">
                              Experience curated fashion, personalized service, and
                              an elegant boutique atmosphere at our {branch.name} location.
                            </p>
                          </div>
                        </div>

                        {imageUrl ? (
                          <div className="mt-10 overflow-hidden rounded-[2rem] bg-brand-marble">
                            <Image
                              src={imageUrl}
                              alt={`${branch.name} boutique`}
                              width={1200}
                              height={800}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
                          <div className="space-y-6 rounded-[1.75rem] border border-brand-border/70 bg-brand-ivory/90 p-8">
                            <div>
                              <p className="text-sm uppercase tracking-[0.25em] text-brand-secondary">
                                Address
                              </p>
                              <p className="mt-3 text-base text-brand-charcoal">
                                {branch.address}
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
                                {branch.phone && (
                                  <p>
                                    Phone: <a href={`tel:${branch.phone}`} className="underline decoration-brand-primary/50">{branch.phone}</a>
                                  </p>
                                )}
                                {branch.email && (
                                  <p>
                                    Email: <a href={`mailto:${branch.email}`} className="underline decoration-brand-primary/50">{branch.email}</a>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="overflow-hidden rounded-[2rem] bg-brand-marble">
                            {branch.mapEmbedUrl ? (
                              <iframe
                                title={`Map for ${branch.name}`}
                                src={branch.mapEmbedUrl}
                                className="h-full min-h-[320px] w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                              />
                            ) : (
                              <div className="flex h-full min-h-[320px] items-center justify-center px-6 py-10 text-sm text-brand-muted">
                                Map unavailable for this branch.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
