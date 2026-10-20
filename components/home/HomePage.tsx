import type { RegionId } from "@/config/regions";
import {
  getFeaturedCollections,
  getPublishedReviews,
} from "@/lib/queries";
import {
  getContentSections,
  getContentValue,
  getPageContent,
} from "@/lib/content/site-content";
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
  const [programmes, stories, pageContent] = await Promise.all([
    getFeaturedCollections(6, regionId),
    getPublishedReviews(regionId),
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
        eyebrow={getContentValue(pageContent, "hero", "eyebrow")}
        title={getContentValue(pageContent, "hero", "title")}
        description={getContentValue(pageContent, "hero", "description")}
        media={heroMedia}
        donateHref={`/donate?region=${regionId}`}
      />
      <AboutSection
        eyebrow={getContentValue(pageContent, "about", "eyebrow")}
        title={getContentValue(pageContent, "about", "title")}
        lead={getContentValue(pageContent, "about", "lead")}
        values={getContentSections(pageContent, "value").map(({ id, fields }) => ({
          id,
          title: fields.title?.value ?? "",
          description: fields.description?.value ?? "",
        }))}
      />
      <ProgrammePillars content={pageContent} />
      <ImpactSection content={pageContent} />
      <ProgrammesSection programmes={programmes} content={pageContent} />
      <StoriesSection stories={stories} content={pageContent} />
      <DonationSection
        eyebrow={getContentValue(pageContent, "donation", "eyebrow")}
        title={getContentValue(pageContent, "donation", "title")}
        description={getContentValue(pageContent, "donation", "description")}
      />
    </>
  );
}
