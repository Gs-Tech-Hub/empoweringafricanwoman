import type { CurrencyCode, RegionId } from "@/config/regions";

export type RegionalContent = {
  regionId: RegionId;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  aboutLead: string;
  donationPresets: number[];
  currency: CurrencyCode;
  contactNote: string;
};
