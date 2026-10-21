"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavLinks } from "@/config/navigation";
import Brand from "@/components/ui/brand";
import type { RegionId } from "@/config/regions";
import { isRegionId } from "@/config/regions";
import MobileMenu from "./MobileMenu";
import RegionSelector from "./RegionSelector";

type SiteHeaderProps = {
  email?: string;
  phone?: string;
};

function regionFromPathname(pathname: string): RegionId | undefined {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isRegionId(segment)) {
    return segment;
  }
  return undefined;
}

export default function SiteHeader({ email, phone }: SiteHeaderProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  const currentRegion = regionFromPathname(pathname);

  return (
    <header className="relative z-40 w-full border-b border-brand-border/70 bg-brand-light/90 backdrop-blur-md">
      {email || phone ? (
        <div className="border-b border-brand-border/50">
          <address className="content-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1 py-2 text-xs not-italic text-brand-muted md:justify-end">
            {email ? (
              <a className="break-all hover:text-brand-accent" href={`mailto:${email}`}>
                Email: {email}
              </a>
            ) : null}
            {phone ? (
              <a className="hover:text-brand-accent" href={`tel:${phone}`}>
                Phone: {phone}
              </a>
            ) : null}
          </address>
        </div>
      ) : null}

      <div className="content-container flex min-h-16 items-center justify-between gap-4 py-2 md:min-h-20">
        <Brand asLink size="sm" priority className="shrink-0" />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
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
          <div className="hidden xl:block">
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
