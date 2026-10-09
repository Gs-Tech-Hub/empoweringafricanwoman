"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/utils";
import CollectionMedia from "@/components/collection-media";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CollectionItem = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  imageFileId: string | null;
  instagramReelUrl: string | null;
  tiktokReelUrl: string | null;
  categoryId: string;
  category: Category;
};

export default function CollectionsGrid({
  categories,
  items,
}: {
  categories: Category[];
  items: CollectionItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, items]);

  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition duration-300 ${
            activeCategory === "all"
              ? "bg-brand-primary text-white"
              : "border border-brand-border bg-white text-brand-text hover:border-brand-secondary"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition duration-300 ${
              activeCategory === category.id
                ? "bg-brand-primary text-white"
                : "border border-brand-border bg-white text-brand-text hover:border-brand-secondary"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-brand-muted">
          No items found in this category.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => {
            return (
              <article
                key={item.id}
                className="group card-luxury overflow-hidden transition duration-500 hover:shadow-luxury"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-marble">
                  <CollectionMedia
                    name={item.name}
                    imageFileId={item.imageFileId}
                    instagramReelUrl={item.instagramReelUrl}
                    tiktokReelUrl={item.tiktokReelUrl}
                  />
                  <span className="absolute left-3 top-3 bg-brand-secondary/90 px-2.5 py-1 text-xs uppercase tracking-wider text-white">
                    {item.category.name}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-lg font-light uppercase tracking-wider text-brand-charcoal">
                    {item.name}
                  </h2>
                  {item.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-muted">
                      {item.description}
                    </p>
                  )}
                  {formatPrice(item.price) && (
                    <p className="mt-3 text-lg font-medium text-brand-secondary">
                      {formatPrice(item.price)}
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
      )}
    </>
  );
}
