import HeroHome from "@/components/hero-home";
import FeaturedCollections from "@/components/featured-collections";
import AboutPage from "@/app/(default)/about/page";
import Reviews from "@/components/reviews";
import FlagShipPage from "@/app/(default)/flagship/page";
import HeaderHome from "./ui/header-home";

export default async function HomeSingle() {
  return (
    <div className="bg-brand-ivory text-brand-charcoal">
      <HeaderHome />
      <main>
        {/* Flagship + locations combined (reuses existing flagship page component) */}
        <section>
          {/* FlagShipPage is an async server component that renders the flagship section */}
          <FlagShipPage />
        </section>

        {/* Featured collections preview only; full collections remain on their own page */}
        <FeaturedCollections />

        {/* About merged with concise testimonials */}
        <section className="border-t border-brand-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="py-24">
              <AboutPage />
              <div className="mt-12">
                <Reviews />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
