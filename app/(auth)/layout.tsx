import SiteHeader from "@/components/layout/SiteHeader";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getCurrentRegion } from "@/lib/region/get-current-region";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutContent>{children}</AuthLayoutContent>;
}

async function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const region = await getCurrentRegion();
  const content = await getPageContent("site", region);
  const email =
    getContentValue(content, "contact", "email") ||
    getContentValue(content, "footer", "email");
  const phone = getContentValue(content, "contact", "phone");

  return (
    <>
      <SiteHeader email={email} phone={phone} />
      <main className="relative flex min-h-screen grow flex-col bg-brand-cream">{children}</main>
    </>
  );
}
