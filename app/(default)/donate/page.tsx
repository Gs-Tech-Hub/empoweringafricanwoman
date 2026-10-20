import type { Metadata } from "next";
import ContentPage from "@/components/content/ContentPage";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getCurrentRegion } from "@/lib/region/get-current-region";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = await getCurrentRegion();
  const content = await getPageContent("donate", region);
  return {
    title: getContentValue(content, "page", "title") || "Donate",
    description: getContentValue(content, "page", "description") || undefined,
  };
}

export default async function DonatePage() {
  const regionId = await getCurrentRegion();
  const content = await getPageContent("donate", regionId);

  return (
    <>
      <ContentPage content={content} title="Donate" />
      <section className="bg-brand-ivory py-16 md:py-24">
        <div className="content-container max-w-3xl">
          <p
            role="status"
            className="rounded-xl border border-brand-border bg-white p-6 text-sm leading-relaxed text-brand-muted"
          >
            Online donations are not available yet. Please check back after secure payment
            processing is set up.
          </p>
        </div>
      </section>
    </>
  );
}
