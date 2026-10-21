import Link from "next/link";
import Brand from "@/components/ui/brand";

type SiteFooterProps = {
  email?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
};

const socialMarks = {
  facebook: "f",
  instagram: "ig",
  x: "X",
  linkedin: "in",
  youtube: "yt",
} as const;

export default function SiteFooter({
  email,
  phone,
  facebook,
  instagram,
  x,
  linkedin,
  youtube,
}: SiteFooterProps) {
  const socials = [
    { name: "Facebook", href: facebook, mark: socialMarks.facebook },
    { name: "Instagram", href: instagram, mark: socialMarks.instagram },
    { name: "X", href: x, mark: socialMarks.x },
    { name: "LinkedIn", href: linkedin, mark: socialMarks.linkedin },
    { name: "YouTube", href: youtube, mark: socialMarks.youtube },
  ].filter((social) => social.href);

  const contactHref = email
    ? `mailto:${email}`
    : phone
      ? `tel:${phone}`
      : "/get-involved#interest-form";

  return (
    <footer className="border-t border-brand-border/70 bg-brand-ivory">
      <div className="content-container grid min-h-[88px] grid-cols-1 items-center gap-5 py-5 md:grid-cols-[1fr_auto] lg:grid-cols-[auto_minmax(12rem,1fr)_auto_auto] lg:gap-8 lg:py-4">
        <Brand asLink size="sm" className="justify-self-center md:justify-self-start" />

        <p className="text-center font-heading text-sm italic leading-relaxed text-brand-charcoal lg:text-left">
          Empowered women.
          <br className="hidden lg:block" /> Stronger communities. A brighter future.
        </p>

        <nav aria-label="Social media" className="flex items-center justify-center gap-2">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-border text-[10px] font-semibold text-brand-charcoal transition hover:border-brand-accent hover:text-brand-accent"
            >
              {social.mark}
            </a>
          ))}
        </nav>

        <nav
          aria-label="Legal and contact"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-brand-charcoal lg:justify-self-end"
        >
          <Link href="/about#privacy" className="hover:text-brand-accent">
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-brand-border">
            |
          </span>
          <Link href="/about#terms" className="hover:text-brand-accent">
            Terms
          </Link>
          <span aria-hidden="true" className="text-brand-border">
            |
          </span>
          <a href={contactHref} className="hover:text-brand-accent">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
