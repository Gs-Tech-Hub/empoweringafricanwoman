import type { RegionId } from "@/config/regions";
import { africaContent } from "./africa";
import { canadaContent } from "./canada";
import { globalContent } from "./global";
import { usContent } from "./us";
import type { RegionalContent } from "./types";

const contentByRegion: Record<RegionId, RegionalContent> = {
  africa: africaContent,
  canada: canadaContent,
  us: usContent,
  global: globalContent,
};

export function getRegionalContent(regionId: RegionId): RegionalContent {
  return contentByRegion[regionId];
}
