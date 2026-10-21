import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
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
  const email =
    getContentValue(content, "contact", "email") ||
    getContentValue(content, "footer", "email");
  const phone = getContentValue(content, "contact", "phone");
  const address = getContentValue(content, "contact", "address");

  return (
    <>
      <SiteHeader email={email} phone={phone} />
      <main className="relative flex grow flex-col">{children}</main>
      <SiteFooter
        email={email}
        phone={phone}
        address={address}
        facebook={getContentValue(content, "social", "facebook")}
        instagram={getContentValue(content, "social", "instagram")}
        x={getContentValue(content, "social", "x")}
        linkedin={getContentValue(content, "social", "linkedin")}
        youtube={getContentValue(content, "social", "youtube")}
      />
    </>
  );
}
