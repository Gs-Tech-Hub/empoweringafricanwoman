import Link from "next/link";
import Brand from "@/components/ui/brand";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 flex-col items-start gap-0.5"
      aria-label="Viv La Viv Boutique"
    >
      <Brand size="md" showLogo />
      <span className="hidden text-[0.55rem] uppercase tracking-[0.4em] text-brand-primary sm:block">
        Established Luxury
      </span>
    </Link>
  );
}
