import Link from "next/link";
import { getFeaturedCollections } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import CollectionMedia from "@/components/collection-media";

export default async function FeaturedCollections() {
  const items = await getFeaturedCollections(6);

  if (items.length === 0) {
    return (
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-t border-brand-border py-24 text-center">
            <h2 className="font-heading text-2xl font-light uppercase tracking-widest text-brand-charcoal">
              Collections coming soon
            </h2>
            <p className="mt-3 text-brand-muted">
              Run the database seed to populate featured items.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-brand-border py-24">
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <p className="section-subtitle pb-4">Featured Collections</p>
            <div className="mx-auto mb-6 h-px w-16 bg-gold" />
            <h2
              className="font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal md:text-4xl"
              data-aos="fade-up"
            >
              Latest arrivals
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
              return (
                <article
                  key={item.id}
                  className="group card-luxury overflow-hidden transition duration-500 hover:shadow-luxury"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-marble">
                    <CollectionMedia
                      name={item.name}
                      imageFileId={item.imageFileId}
                      instagramReelUrl={item.instagramReelUrl}
                      tiktokReelUrl={item.tiktokReelUrl}
                    />
                    <span className="absolute left-3 top-3 bg-brand-primary/90 px-2.5 py-1 text-xs uppercase tracking-wider text-white">
                      {item.category.name}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-light uppercase tracking-wider text-brand-charcoal">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-muted">
                        {item.description}
                      </p>
                    )}
                    {formatPrice(item.price?.toString()) && (
                      <p className="mt-3 text-lg font-medium text-brand-secondary">
                        {formatPrice(item.price?.toString())}
                      </p>
                    )}
                    <a
                      href={`https://wa.me/?text=Hi! I'm interested in the ${item.name} collection. Can you tell me more details?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary mt-4 w-full text-center text-sm"
                    >
                      Shop on WhatsApp
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/collections" className="btn btn-primary">
              View All Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
