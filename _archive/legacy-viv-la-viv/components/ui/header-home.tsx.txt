import Link from "next/link";
import Logo from "./logo";
import { getPublishedBranches } from "@/lib/queries";

export default async function HeaderHome() {
  const branches = await getPublishedBranches();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/collections", label: "Collections" },
  ];

  return (
    <header className="z-30 w-full border-b border-brand-border/60 bg-brand-light/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-text hover:text-brand-charcoal"
              >
                {link.label}
              </Link>
            ))}

            {/* Individual location links */}
            {branches.map((b) => (
              <Link
                key={b.id}
                href={`/locations#branch-${b.id}`}
                className="px-3 py-2 text-xs uppercase tracking-[0.15em] text-brand-muted hover:text-brand-charcoal"
              >
                {b.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end md:hidden">
            <Link href="/collections" className="btn-sm btn-primary text-xs">
              Shop
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
