"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/content", label: "Website Content", exact: false },
  { href: "/admin/media", label: "Media Library", exact: false },
  { href: "/admin/stories", label: "Stories", exact: false },
  { href: "/admin/locations", label: "Locations", exact: false },
  { href: "/admin/categories", label: "Programme categories", exact: false },
  { href: "/admin/collections", label: "Programmes", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      {navLinks.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg border px-4 py-2 text-sm uppercase tracking-[0.15em] transition duration-300 ${
              isActive
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-brand-border bg-white text-brand-text hover:border-brand-secondary hover:text-brand-charcoal"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
