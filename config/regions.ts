export type RegionId = "africa" | "canada" | "us" | "global";

export type CurrencyCode = "NGN" | "CAD" | "USD";

export type RegionConfig = {
  id: RegionId;
  label: string;
  path: `/${RegionId}`;
  defaultCurrency: CurrencyCode;
  countryCodes: string[];
};

export const REGIONS: Record<RegionId, RegionConfig> = {
  africa: {
    id: "africa",
    label: "Africa",
    path: "/africa",
    defaultCurrency: "NGN",
    countryCodes: ["NG", "GH", "KE", "ZA", "EG", "CI", "SN", "CM", "TZ", "UG"],
  },
  canada: {
    id: "canada",
    label: "Canada",
    path: "/canada",
    defaultCurrency: "CAD",
    countryCodes: ["CA"],
  },
  us: {
    id: "us",
    label: "United States",
    path: "/us",
    defaultCurrency: "USD",
    countryCodes: ["US"],
  },
  global: {
    id: "global",
    label: "Global",
    path: "/global",
    defaultCurrency: "USD",
    countryCodes: [],
  },
};

export const REGION_COOKIE = "site-region";
export const REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export const regionList = Object.values(REGIONS);

export function isRegionId(value: string): value is RegionId {
  return value in REGIONS;
}

export function regionFromCountry(countryCode: string | null | undefined): RegionId {
  if (!countryCode) return "global";
  const upper = countryCode.toUpperCase();
  for (const region of regionList) {
    if (region.countryCodes.includes(upper)) {
      return region.id;
    }
  }
  return "global";
}

export function getRegionConfig(id: RegionId): RegionConfig {
  return REGIONS[id];
}
