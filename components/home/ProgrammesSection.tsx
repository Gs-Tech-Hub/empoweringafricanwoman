import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

type Programme = {
  id: string;
  name: string;
  description: string | null;
  imageFileId: string | null;
  category: { name: string };
};

type ProgrammesSectionProps = {
  programmes: Programme[];
};

export function ProgrammesSection({ programmes }: ProgrammesSectionProps) {
  const featured = programmes.slice(0, 3);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div data-aos="fade-up">
            <p className="eyebrow mb-4">Programmes</p>
            <div className="gold-divider mb-6 !mx-0" />
            <h2 className="section-heading">Programmes That Matter</h2>
          </div>
          <Link href="/programmes" className="button-secondary">
            All programmes
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((programme, index) => {
            const imageSrc = programme.imageFileId
              ? getImageUrl(programme.imageFileId)
              : "/images/fashion-collection-3.jpg";
            return (
              <article
                key={programme.id}
                className="card-programme group"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="image-rounded relative aspect-[4/3]">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
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
