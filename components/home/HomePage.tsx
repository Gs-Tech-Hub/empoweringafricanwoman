import type { RegionId } from "@/config/regions";
import { getRegionalContent } from "@/content";
import {
  getFeaturedCollections,
  getPublishedReviews,
} from "@/lib/queries";
import { getPageContent } from "@/lib/content/site-content";
import { getMediaUrl } from "@/lib/utils";
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
  const [programmes, stories, pageContent] = await Promise.all([
    getFeaturedCollections(6),
    getPublishedReviews(),
    getPageContent("home", regionId),
  ]);
  const heroAsset = pageContent.hero?.media?.mediaAsset;
  const heroMedia =
    heroAsset && (heroAsset.mediaType === "IMAGE" || heroAsset.mediaType === "VIDEO")
      ? {
          url: getMediaUrl(heroAsset.id)!,
          mediaType: heroAsset.mediaType,
          altText: heroAsset.altText,
        }
      : undefined;

  return (
    <>
      <HeroSection
        eyebrow={pageContent.hero?.eyebrow?.value ?? content.hero.eyebrow}
        title={pageContent.hero?.title?.value ?? content.hero.title}
        description={pageContent.hero?.description?.value ?? content.hero.description}
        image={content.hero.image}
        imageAlt={heroMedia?.altText || content.hero.imageAlt}
        media={heroMedia}
        donateHref={`/donate?region=${regionId}`}
      />
      <AboutSection lead={pageContent.about?.lead?.value ?? content.aboutLead} />
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
