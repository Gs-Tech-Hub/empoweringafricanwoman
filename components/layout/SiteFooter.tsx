import Link from "next/link";
import Image from "next/image";
import { brand } from "@/config/brand";
import { footerNavLinks, governanceLinks } from "@/config/navigation";

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-border bg-brand-ivory">
      <div className="content-container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.jpeg"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="font-heading text-lg font-semibold text-brand-charcoal">
                {brand.name}
              </p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-brand-muted">
              {brand.description}
            </p>
            <p className="text-sm text-brand-muted">
              <a className="hover:text-brand-accent" href={`mailto:${brand.contact.email}`}>
                {brand.contact.email}
              </a>
            </p>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Explore</h2>
            <ul className="space-y-2 text-sm">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-brand-muted transition hover:text-brand-charcoal"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Governance</h2>
            <ul className="space-y-2 text-sm">
              {governanceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-brand-muted transition hover:text-brand-charcoal"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-4 text-sm">
              <a href={brand.social.instagram} className="text-brand-muted hover:text-brand-accent">
                Instagram
              </a>
              <a href={brand.social.linkedin} className="text-brand-muted hover:text-brand-accent">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-border pt-6 text-sm text-brand-muted">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
