import Image from "next/image";
import Link from "next/link";
import logoDark from "@/assets/dispagaz/dispagaz-logo.png";
import logoWhite from "@/assets/dispagaz/dispagaz-logo-white.png";
import { cn } from "@/lib/cn";

type DispagazLogoProps = {
  /** "onDark": white lettering (reversed); "onLight": original charcoal lettering. */
  tone?: "onDark" | "onLight";
  className?: string;
  heightClassName?: string;
  href?: string;
  onClick?: () => void;
};

/** Dispagaz® horizontal lockup. Proportions preserved: only the height is set. */
export function DispagazLogo({
  tone = "onDark",
  className,
  heightClassName = "h-8 lg:h-10",
  href = "/dispagaz",
  onClick,
}: DispagazLogoProps) {
  return (
    <Link
      href={href}
      aria-label="Dispagaz — Accueil"
      className={cn("inline-flex shrink-0 items-center", className)}
      onClick={onClick}
    >
      <Image
        src={tone === "onDark" ? logoWhite : logoDark}
        alt="Dispagaz"
        sizes="(min-width: 1024px) 180px, 140px"
        loading="eager"
        className={cn("w-auto select-none", heightClassName)}
        draggable={false}
      />
    </Link>
  );
}
