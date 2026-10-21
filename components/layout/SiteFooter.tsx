import Link from "next/link";
import { brand } from "@/config/brand";
import { footerNavLinks, governanceLinks } from "@/config/navigation";

type SiteFooterProps = {
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  linkedin?: string;
};

export default function SiteFooter({
  description,
  email,
  phone,
  address,
  instagram,
  linkedin,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-brand-border bg-brand-ivory">
      <div className="content-container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary font-heading text-xs font-semibold text-brand-ivory">
                EAW
              </span>
              <p className="font-heading text-lg font-semibold text-brand-charcoal">
                {brand.name}
              </p>
            </div>
            {description ? (
              <p className="max-w-sm text-sm leading-relaxed text-brand-muted">{description}</p>
            ) : null}
          </div>

          <div>
            {email || phone || address ? (
              <>
                <h2 className="eyebrow mb-4">Contact</h2>
                <address className="mb-6 space-y-2 text-sm not-italic text-brand-muted">
                  {email ? (
                    <p>
                      Email:{" "}
                      <a className="hover:text-brand-accent" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </p>
                  ) : null}
                  {phone ? (
                    <p>
                      Phone:{" "}
                      <a className="hover:text-brand-accent" href={`tel:${phone}`}>
                        {phone}
                      </a>
                    </p>
                  ) : null}
                  {address ? <p className="whitespace-pre-line">{address}</p> : null}
                </address>
              </>
            ) : null}
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
            {instagram || linkedin ? (
              <div className="mt-6 flex gap-4 text-sm">
                {instagram ? (
                  <a href={instagram} target="_blank" rel="noreferrer" className="text-brand-muted hover:text-brand-accent">
                    Instagram
                  </a>
                ) : null}
                {linkedin ? (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="text-brand-muted hover:text-brand-accent">
                    LinkedIn
                  </a>
                ) : null}
              </div>
            ) : null}
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
