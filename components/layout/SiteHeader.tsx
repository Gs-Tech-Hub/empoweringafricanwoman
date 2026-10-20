"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavLinks } from "@/config/navigation";
import { brand } from "@/config/brand";
import type { RegionId } from "@/config/regions";
import { isRegionId } from "@/config/regions";
import MobileMenu from "./MobileMenu";
import RegionSelector from "./RegionSelector";

function regionFromPathname(pathname: string): RegionId | undefined {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isRegionId(segment)) {
    return segment;
  }
  return undefined;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  const currentRegion = regionFromPathname(pathname);

  return (
    <header className="relative z-40 w-full border-b border-brand-border/70 bg-brand-light/90 backdrop-blur-md">
      <div className="content-container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary font-heading text-xs font-semibold tracking-wide text-brand-ivory md:h-11 md:w-11">
            EAW
          </span>
          <span className="hidden max-w-40 font-heading text-sm font-semibold leading-tight text-brand-charcoal lg:block">
            {brand.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "text-brand-accent"
                    : "text-brand-text hover:text-brand-charcoal"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <RegionSelector currentRegion={currentRegion ?? "global"} />
          </div>
          <Link href="/donate" className="btn-sm button-primary hidden sm:inline-flex">
            Donate
          </Link>
          <MobileMenu currentRegion={currentRegion} />
        </div>
      </div>
    </header>
  );
}
