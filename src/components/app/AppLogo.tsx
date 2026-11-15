import Image from "next/image";
import Link from "next/link";
import logoDark from "@/assets/dispagaz/dispagaz-logo.png";
import logoWhite from "@/assets/dispagaz/dispagaz-logo-white.png";
import { appRoutes } from "@/lib/dispagaz/routes";
import { cn } from "@/lib/cn";

/** Approved Dispagaz lockup (no added tagline). */
export function AppLogo({
  tone = "onLight",
  className,
  href = appRoutes.home,
}: {
  tone?: "onLight" | "onDark";
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} aria-label="Dispagaz — Accueil" className="inline-flex shrink-0 items-center">
      <Image
        src={tone === "onDark" ? logoWhite : logoDark}
        alt="Dispagaz"
        sizes="160px"
        loading="eager"
        className={cn("h-8 w-auto", className)}
      />
    </Link>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full bg-dz-orange-tint px-2.5 text-xs font-medium text-dz-orange-ink",
        className,
      )}
    >
      Démo
    </span>
  );
}
