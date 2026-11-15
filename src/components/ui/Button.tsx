import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "light";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-white hover:bg-charcoal-soft focus-visible:outline-teal",
  secondary:
    "border border-charcoal/18 bg-white/60 text-ink hover:border-charcoal/45 hover:bg-white",
  light: "bg-white text-ink hover:bg-offwhite focus-visible:outline-teal-light",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-5 text-[0.9375rem]",
  md: "h-12 px-6 text-[0.9375rem] sm:h-[3.25rem] sm:px-7",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return cn(
    "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-heading font-medium tracking-[-0.005em] whitespace-nowrap",
    "transition-[background-color,border-color,color] duration-200 ease-(--ease-soft)",
    "focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-3",
    variants[variant],
    sizes[size],
  );
}

/** Arrow that glides a few pixels on hover — the only motion on buttons. */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <ArrowRightIcon
      width={18}
      height={18}
      className={cn(
        "-mr-0.5 transition-transform duration-300 ease-(--ease-soft) group-hover/button:translate-x-[3px]",
        className,
      )}
    />
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses(variant, size), className)} {...props}>
      <span>{children}</span>
      {arrow ? <ButtonArrow /> : null}
    </Link>
  );
}

/** Restrained inline text link with a gliding arrow (e.g. "En savoir plus"). */
export function TextLink({
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "className"> & { className?: string; children: ReactNode }) {
  return (
    <Link
      className={cn(
        "group/button inline-flex items-center gap-2 font-heading text-[0.9375rem] font-medium text-ink",
        "underline decoration-orange decoration-2 underline-offset-[7px] transition-colors duration-200 hover:decoration-orange-deep",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ButtonArrow className="h-4 w-4" />
    </Link>
  );
}
