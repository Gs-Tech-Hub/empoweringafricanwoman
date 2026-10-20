import { cookies } from "next/headers";
import { REGION_COOKIE, parseRegionCookie } from "@/lib/region/cookies";

export async function getCurrentRegion() {
  const cookieStore = await cookies();
  return parseRegionCookie(cookieStore.get(REGION_COOKIE)?.value) ?? "global";
}
