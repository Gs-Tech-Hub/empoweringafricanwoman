import type { Metadata } from "next";
import ContentPage from "@/components/content/ContentPage";
import PeopleSections from "@/components/content/PeopleSections";
import { getPageContent, getContentValue } from "@/lib/content/site-content";
import { getCurrentRegion } from "@/lib/region/get-current-region";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getCurrentRegion();
  const content = await getPageContent("about", region);
  return {
    title: getContentValue(content, "page", "title") || "About",
    description: getContentValue(content, "page", "description") || undefined,
  };
}

export default async function AboutPage() {
  const region = await getCurrentRegion();
  const content = await getPageContent("about", region);
  return (
    <>
      <ContentPage content={content} title="About" />
      <PeopleSections content={content} />
    </>
  );
}
