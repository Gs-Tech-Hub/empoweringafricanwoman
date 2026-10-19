"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/locations", label: "Locations" },
  { href: "/collections", label: "Collections" },
];

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <header className="z-30 w-full border-b border-brand-border/60 bg-brand-light/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition duration-300 ${
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text hover:text-brand-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end md:hidden">
            <Link href="/collections" className="btn-sm btn-primary text-xs">
              Shop
            </Link>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-brand-border/40 pb-3 pt-2 md:hidden">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition ${
                  isActive
                    ? "text-brand-primary"
                    : "text-brand-muted hover:text-brand-charcoal"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
