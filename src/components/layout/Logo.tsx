import Image from "next/image";
import Link from "next/link";
import headerLogo from "@/assets/brand/bme-logo-header.png";
import { company } from "@/config/company";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** Tailwind height classes; width follows the original aspect ratio. */
  heightClassName?: string;
  onClick?: () => void;
};

/**
 * Approved header lockup (logo/bme-logo-header-transparent.png).
 * Proportions are always preserved: only the height is set.
 */
export function Logo({
  className,
  heightClassName = "h-10 lg:h-[54px] xl:h-[58px]",
  onClick,
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${company.name} — Accueil`}
      className={cn("inline-flex shrink-0 items-center", className)}
      onClick={onClick}
    >
      <Image
        src={headerLogo}
        alt={company.name}
        sizes="(min-width: 1024px) 160px, 112px"
        loading="eager"
        className={cn("w-auto select-none", heightClassName)}
        draggable={false}
      />
    </Link>
  );
}
