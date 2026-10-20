import type { Metadata } from "next";
import ContentPage from "@/components/content/ContentPage";
import { ImpactSection } from "@/components/home/ImpactSection";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getCurrentRegion } from "@/lib/region/get-current-region";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getCurrentRegion();
  const content = await getPageContent("impact", region);
  return {
    title: getContentValue(content, "page", "title") || "Impact",
    description: getContentValue(content, "page", "description") || undefined,
  };
}

export default async function ImpactPage() {
  const region = await getCurrentRegion();
  const content = await getPageContent("impact", region);

  return (
    <>
      <ContentPage content={content} title="Impact" />
      <ImpactSection content={content} />
    </>
  );
}
