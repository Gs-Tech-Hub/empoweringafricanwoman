export const metadata = {
  title: "Collections",
  description:
    "Browse Viv La Viv Boutique collections by category — dresses, accessories, and more.",
};

import { getCategories, getPublishedCollectionItems } from "@/lib/queries";
import CollectionsGrid from "@/components/collections-grid";

export default async function CollectionsPage() {
  const [categories, items] = await Promise.all([
    getCategories(),
    getPublishedCollectionItems(),
  ]);

  const serializedItems = items.map((item) => ({
    ...item,
    price: item.price?.toString() ?? null,
  }));

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-subtitle mb-4" data-aos="fade-up">
              Shop
            </p>
            <div className="mx-auto mb-6 h-px w-16 bg-gold" />
            <h1
              className="font-heading text-4xl font-light uppercase tracking-widest text-brand-charcoal md:text-5xl"
              data-aos="fade-up"
            >
              Our Collections
            </h1>
            <p
              className="mt-6 text-lg leading-8 text-brand-muted"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              Explore our curated selection of apparel and accessories, organized
              by category.
            </p>
          </div>

          <div className="mt-16">
            <CollectionsGrid categories={categories} items={serializedItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
