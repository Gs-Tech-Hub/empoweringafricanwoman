"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { mainNavLinks } from "@/config/navigation";
import type { RegionId } from "@/config/regions";
import RegionSelector from "./RegionSelector";

type MobileMenuProps = {
  currentRegion?: RegionId;
};

export default function MobileMenu({ currentRegion }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border text-brand-charcoal"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-full z-50 border-b border-brand-border bg-brand-light px-4 py-6 shadow-soft"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-brand-ivory"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-brand-border pt-4">
            <RegionSelector currentRegion={currentRegion} />
            <Link href="/donate" className="button-primary text-center">
              Donate
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
