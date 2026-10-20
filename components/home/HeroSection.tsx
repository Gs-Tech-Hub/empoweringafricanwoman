import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
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
  media,
  donateHref = "/donate",
  missionHref = "/about",
}: HeroSectionProps) {
  return (
    <section className="bg-brand-cream py-12 md:py-20">
      <div className={`content-container grid items-center gap-10 ${media ? "lg:grid-cols-2 lg:gap-16" : "lg:grid-cols-[minmax(0,58rem)] lg:justify-center"}`}>
        <div data-aos="fade-up">
          {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
          {title ? <h1 className="section-heading mb-6">{title}</h1> : null}
          {description ? (
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-brand-muted">{description}</p>
          ) : null}
          {donateHref && missionHref ? (
            <div className="flex flex-wrap gap-4">
              <Link className="button-primary" href={donateHref}>
                Donate Now
              </Link>
              <Link className="button-secondary" href={missionHref}>
                Explore Our Mission
              </Link>
            </div>
          ) : null}
        </div>

        {media ? (
          <div className="image-rounded relative aspect-[4/5] w-full shadow-luxury" data-aos="fade-left">
            {media.mediaType === "VIDEO" ? (
              <video
                src={media.url}
                controls
                preload="metadata"
                aria-label={media.altText || "Featured video"}
                className="h-full w-full rounded-[inherit] object-cover"
              />
            ) : (
              <Image
                src={media.url}
                alt={media.altText || ""}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-[inherit] object-cover"
              />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
