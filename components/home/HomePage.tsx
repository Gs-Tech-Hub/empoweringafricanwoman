import type { RegionId } from "@/config/regions";
import { getPublishedReviews } from "@/lib/queries";
import {
  getContentSections,
  getContentValue,
  getPageContent,
} from "@/lib/content/site-content";
import { getMediaUrl } from "@/lib/utils";
import PeopleSections from "@/components/content/PeopleSections";
import { AboutSection } from "./AboutSection";
import { ActivitiesSection } from "./ActivitiesSection";
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
  const [stories, pageContent, impactContent] = await Promise.all([
    getPublishedReviews(regionId),
    getPageContent("home", regionId),
    getPageContent("impact", regionId),
  ]);
  const heroAsset = pageContent.hero?.media?.mediaAsset;
  const heroMedia =
    heroAsset && (heroAsset.mediaType === "IMAGE" || heroAsset.mediaType === "VIDEO")
      ? {
          url: getMediaUrl(heroAsset)!,
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
      <PeopleSections content={pageContent} />
      <ProgrammePillars content={pageContent} />
      <ImpactSection
        content={pageContent}
        highlightContent={impactContent}
        variant="summary"
      />
      <ProgrammesSection content={pageContent} />
      <ActivitiesSection content={pageContent} />
      <StoriesSection stories={stories} content={pageContent} />
      <DonationSection
        eyebrow={getContentValue(pageContent, "donation", "eyebrow")}
        title={getContentValue(pageContent, "donation", "title")}
        description={getContentValue(pageContent, "donation", "description")}
      />
    </>
  );
}
