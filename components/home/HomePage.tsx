import type { RegionId } from "@/config/regions";
import { getRegionalContent } from "@/content";
import {
  getFeaturedCollections,
  getPublishedReviews,
} from "@/lib/queries";
import { AboutSection } from "./AboutSection";
import { DonationSection } from "./DonationSection";
import { HeroSection } from "./HeroSection";
import { ImpactSection } from "./ImpactSection";
import { ProgrammePillars } from "./ProgrammePillars";
import { ProgrammesSection } from "./ProgrammesSection";
import { StoriesSection } from "./StoriesSection";

type HomePageProps = {
  regionId?: RegionId;
};

export default async function HomePage({ regionId = "global" }: HomePageProps) {
  const content = getRegionalContent(regionId);
  const [programmes, stories] = await Promise.all([
    getFeaturedCollections(6),
    getPublishedReviews(),
  ]);

  return (
    <>
      <HeroSection
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        image={content.hero.image}
        imageAlt={content.hero.imageAlt}
        donateHref={`/donate?region=${regionId}`}
      />
      <AboutSection lead={content.aboutLead} />
      <ProgrammePillars />
      <ImpactSection />
      <ProgrammesSection programmes={programmes} />
      <StoriesSection stories={stories} />
      <DonationSection
        regionId={regionId}
        currency={content.currency}
        presets={content.donationPresets}
      />
    </>
  );
}
