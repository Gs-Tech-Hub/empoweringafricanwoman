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
    sm: "text-sm max-w-[6.5rem]",
    md: "text-base md:text-lg max-w-[8rem] md:max-w-[10rem]",
    lg: "text-2xl md:text-3xl max-w-[12rem] md:max-w-[16rem]",
    xl: "text-4xl md:text-5xl max-w-[16rem] md:max-w-[20rem]",
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
      <span className="flex min-w-0 flex-col leading-tight">
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
