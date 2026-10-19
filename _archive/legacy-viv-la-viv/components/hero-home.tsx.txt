import Link from "next/link";
import Image from "next/image";
import HeroImage from "@/public/images/fashion-woman-leaning-on-car.jpg";
import Brand from "@/components/ui/brand";

export default function HeroHome() {
  return (
    <section className="relative overflow-hidden bg-marble">
  {/* Background */}
  <div className="absolute inset-0">
    <Image
      src={HeroImage}
      alt="Model wearing Viva La Viv luxury fashion"
      fill
      priority
      sizes="100vw"
      className="object-cover object-[50%_20%]"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/70 via-brand-charcoal/35 to-brand-charcoal/10" />
  </div>

  <div className="relative mx-auto flex min-h-[75svh] max-w-7xl items-center px-6 lg:px-10">
    <div className="max-w-md rounded-3xl border border-white/10 bg-white/40 p-8 backdrop-blur-sm lg:p-10">
      <span
        className="section-subtitle block text-brand-charcoal"
        data-aos="fade-up"
      >
        Established Luxury
      </span>

      <h1
        className="mt-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <Brand size="lg" />
      </h1>

      <div
        aria-hidden="true"
        className="my-5 h-px w-12 bg-gold"
      />

      <p
        className="font-script text-2xl italic text-brand-text"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        "Your Fashion Is Your IQ"
      </p>

      <p
        className="mt-5 text-sm leading-7 text-brand-muted md:text-base"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Discover curated luxury collections, timeless designs, and exceptional
        craftsmanship that elevate every occasion.
      </p>

      <div
        className="mt-8 flex flex-wrap gap-4"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <Link
          href="/collections"
          className="btn btn-primary min-w-[170px]"
        >
          Browse Collections
        </Link>

        <Link
          href="/locations"
          className="btn btn-secondary min-w-[170px]"
        >
          Find a Location
        </Link>
      </div>
    </div>
  </div>
</section>
  );
}
