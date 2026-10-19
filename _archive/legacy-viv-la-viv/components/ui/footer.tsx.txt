import Link from "next/link";
import Logo from "./logo";
import Brand from "@/components/ui/brand";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/locations", label: "Locations" },
  { href: "/collections", label: "Collections" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-ivory">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 py-12 md:grid-cols-[1fr_auto] md:py-16">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-md font-script text-xl italic text-brand-text">
              &ldquo;Your Fashion Is Your IQ&rdquo;
            </p>
            <p className="max-w-md text-sm leading-relaxed text-brand-muted">
              Curated fashion with timeless elegance. Visit our locations or browse
              our latest collections online.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="section-subtitle text-xs">Explore</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-brand-muted transition hover:text-brand-primary"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border py-6 text-sm text-brand-muted">
          <p>
            © {new Date().getFullYear()} <Brand size="sm" /> Boutique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
