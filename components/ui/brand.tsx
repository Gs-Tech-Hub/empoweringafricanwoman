import Link from "next/link";
import { brand } from "@/config/brand";

export default function Brand({
  className = "",
  size = "md",
  asLink = false,
  href = "/",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
  href?: string;
}) {
  const sizeMap: Record<string, string> = {
    sm: "text-sm",
    md: "text-base md:text-lg",
    lg: "text-2xl md:text-3xl",
    xl: "text-4xl md:text-5xl",
  };

  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary font-heading text-xs font-semibold tracking-wide text-brand-ivory"
      >
        EAW
      </span>
      <span className={`font-heading font-semibold leading-tight text-brand-primary ${sizeMap[size]}`}>
        {brand.name}
      </span>
    </span>
  );

  if (asLink) {
    return (
      <Link href={href} aria-label={brand.name} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
