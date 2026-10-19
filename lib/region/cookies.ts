import {
  REGION_COOKIE,
  REGION_COOKIE_MAX_AGE,
  isRegionId,
  type RegionId,
} from "@/config/regions";

export function parseRegionCookie(value: string | undefined | null): RegionId | null {
  if (!value || !isRegionId(value)) {
    return null;
  }
  return value;
}

export function regionCookieHeader(regionId: RegionId): string {
  return `${REGION_COOKIE}=${regionId}; Path=/; Max-Age=${REGION_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export { REGION_COOKIE, REGION_COOKIE_MAX_AGE };
