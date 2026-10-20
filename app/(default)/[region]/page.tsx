import { notFound } from "next/navigation";
import HomePage from "@/components/home/HomePage";
import { regionList, isRegionId } from "@/config/regions";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return regionList
    .filter((region) => region.id !== "global")
    .map((region) => ({ region: region.id }));
}

export default async function RegionalHomePage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  if (!isRegionId(region)) {
    notFound();
  }
  return <HomePage regionId={region} />;
}
