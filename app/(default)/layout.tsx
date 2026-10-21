import SiteFooter from "@/components/layout/SiteFooter";
import { getPageContent, getContentValue } from "@/lib/content/site-content";
import { getCurrentRegion } from "@/lib/region/get-current-region";

export const dynamic = "force-dynamic";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const region = await getCurrentRegion();
  const content = await getPageContent("site", region);

  return (
    <>
      <main className="relative flex grow flex-col">{children}</main>
      <SiteFooter
        description={getContentValue(content, "footer", "description")}
        email={
          getContentValue(content, "contact", "email") ||
          getContentValue(content, "footer", "email")
        }
        phone={getContentValue(content, "contact", "phone")}
        address={getContentValue(content, "contact", "address")}
        instagram={getContentValue(content, "social", "instagram")}
        linkedin={getContentValue(content, "social", "linkedin")}
      />
    </>
  );
}
