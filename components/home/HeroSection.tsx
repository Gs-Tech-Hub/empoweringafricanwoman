import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  donateHref?: string;
  missionHref?: string;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
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
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
