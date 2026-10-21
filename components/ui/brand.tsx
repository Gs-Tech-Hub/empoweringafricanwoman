import Link from "next/link";
import Image from "next/image";
import { brand } from "@/config/brand";

export default function Brand({
  className = "",
  size = "md",
  asLink = false,
  href = "/",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
  href?: string;
  priority?: boolean;
}) {
  const sizeMap: Record<string, string> = {
    sm: "text-sm",
    md: "text-base md:text-lg",
    lg: "text-2xl md:text-3xl",
    xl: "text-4xl md:text-5xl",
  };

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/logo.jpeg"
        alt=""
        width={48}
        height={48}
        priority={priority}
        className="h-11 w-11 shrink-0 object-contain"
      />
      <span className="flex flex-col leading-tight">
        <span className={`font-heading font-semibold uppercase text-brand-primary ${sizeMap[size]}`}>
          {brand.name}
        </span>
      
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
