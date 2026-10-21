"use client";

import { useRouter } from "next/navigation";

type ContentFiltersProps = {
  page: string;
  region: string;
  pages: readonly { id: string; title: string }[];
  regions: Array<{ id: string; label: string }>;
};

export default function ContentFilters({ page, region, pages, regions }: ContentFiltersProps) {
  const router = useRouter();

  function updateParams(nextPage: string, nextRegion: string) {
    const params = new URLSearchParams();
    params.set("page", nextPage);
    params.set("region", nextRegion);
    router.replace(`/admin/content?${params.toString()}`);
  }

  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="content-page" className="mb-1 block text-sm text-brand-muted">
          Page
        </label>
        <select
          id="content-page"
          name="page"
          value={page}
          onChange={(event) => updateParams(event.target.value, region)}
          className="form-select w-full"
        >
          {pages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="content-region" className="mb-1 block text-sm text-brand-muted">
          Region
        </label>
        <select
          id="content-region"
          name="region"
          value={region}
          onChange={(event) => updateParams(page, event.target.value)}
          className="form-select w-full"
        >
          {regions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
