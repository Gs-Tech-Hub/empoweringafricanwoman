import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "@/lib/utils";
import type { PageContent } from "@/lib/content/site-content";

type Programme = {
  id: string;
  name: string;
  description: string | null;
  mediaAsset: { id: string; altText: string | null; mediaType: string } | null;
  category: { name: string };
};

type ProgrammesSectionProps = {
  programmes: Programme[];
  content: PageContent;
};

export function ProgrammesSection({ programmes, content }: ProgrammesSectionProps) {
  const featured = programmes.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div data-aos="fade-up">
            {content.programmes?.eyebrow?.value ? (
              <p className="eyebrow mb-4">{content.programmes.eyebrow.value}</p>
            ) : null}
            <div className="gold-divider mb-6 !mx-0" />
            <h2 className="section-heading">{content.programmes?.title?.value || "Programmes"}</h2>
            {content.programmes?.description?.value ? (
              <p className="mt-4 max-w-xl text-brand-muted">
                {content.programmes.description.value}
              </p>
            ) : null}
          </div>
          <Link href="/programmes" className="button-secondary">
            All programmes
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((programme, index) => {
            const imageSrc =
              programme.mediaAsset?.mediaType === "IMAGE"
                ? getMediaUrl(programme.mediaAsset.id)
                : null;
            return (
              <article
                key={programme.id}
                className="card-programme group"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                {imageSrc ? (
                  <div className="image-rounded relative aspect-[4/3]">
                    <Image
                      src={imageSrc}
                      alt={programme.mediaAsset?.altText ?? ""}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                    {programme.category.name}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold text-brand-charcoal">
                    {programme.name}
                  </h3>
                  {programme.description ? (
                    <p className="mt-2 line-clamp-3 text-sm text-brand-muted">
                      {programme.description}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
