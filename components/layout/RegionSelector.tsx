"use client";

import { useRouter } from "next/navigation";
import { regionList, type RegionId } from "@/config/regions";
import { REGION_COOKIE, REGION_COOKIE_MAX_AGE } from "@/lib/region/cookies";

type RegionSelectorProps = {
  currentRegion?: RegionId;
  className?: string;
};

export default function RegionSelector({
  currentRegion = "global",
  className = "",
}: RegionSelectorProps) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const regionId = event.target.value as RegionId;
    document.cookie = `${REGION_COOKIE}=${regionId}; path=/; max-age=${REGION_COOKIE_MAX_AGE}; samesite=lax`;
    router.push(`/${regionId}`);
  }

  return (
    <label className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="sr-only">Select region</span>
      <select
        value={currentRegion}
        onChange={handleChange}
        className="form-select rounded-full border-brand-border bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-brand-charcoal"
        aria-label="Select your region"
      >
        {regionList.map((region) => (
          <option key={region.id} value={region.id}>
            {region.label}
          </option>
        ))}
      </select>
    </label>
  );
}
