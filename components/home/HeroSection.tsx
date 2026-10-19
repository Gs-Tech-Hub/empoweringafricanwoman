import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  media?: {
    url: string;
    mediaType: "IMAGE" | "VIDEO";
    altText: string | null;
  };
  donateHref?: string;
  missionHref?: string;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  media,
  donateHref = "/donate",
  missionHref = "/about",
}: HeroSectionProps) {
  return (
    <section className="bg-brand-cream py-12 md:py-20">
      <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-aos="fade-up">
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="section-heading mb-6">{title}</h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-brand-muted">{description}</p>
          <div className="flex flex-wrap gap-4">
            <Link className="button-primary" href={donateHref}>
              Donate Now
            </Link>
            <Link className="button-secondary" href={missionHref}>
              Explore Our Mission
            </Link>
          </div>
        </div>

        <div className="image-rounded relative aspect-[4/5] w-full shadow-luxury" data-aos="fade-left">
          {media?.mediaType === "VIDEO" ? (
            <video
              src={media.url}
              poster={image}
              controls
              preload="metadata"
              aria-label={media.altText || "Featured video"}
              className="h-full w-full rounded-[inherit] object-cover"
            />
          ) : (
            <Image
              src={media?.url ?? image}
              alt={media?.altText || imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </div>
      </div>
    </section>
  );
}
