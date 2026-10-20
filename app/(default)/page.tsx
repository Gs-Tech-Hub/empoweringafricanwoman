import { cookies } from "next/headers";
import HomePage from "@/components/home/HomePage";
import { parseRegionCookie, REGION_COOKIE } from "@/lib/region/cookies";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const regionId = parseRegionCookie(cookieStore.get(REGION_COOKIE)?.value) ?? "global";
  return <HomePage regionId={regionId} />;
}
