import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  // Orange with charcoal text (7.4:1 — white text on this orange would fail AA)
  primary: "bg-dz-orange text-dz-ink hover:bg-dz-orange-hover disabled:bg-dz-orange/45",
  secondary: "bg-dz-ink text-white hover:bg-dz-ink-soft disabled:bg-dz-ink/40",
  tertiary:
    "border border-dz-line bg-white text-dz-ink hover:border-dz-ink/30 disabled:text-dz-subtle",
  ghost: "text-dz-ink hover:bg-dz-gray",
  danger: "border border-dz-line bg-white text-dz-danger hover:border-dz-danger/40",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-[0.9375rem]",
  lg: "h-14 px-6 text-base",
};

export function appButtonClasses(variant: Variant = "primary", size: Size = "md", block = false) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[14px] font-medium tracking-[-0.005em] whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:active:scale-100",
    variants[variant],
    sizes[size],
    block && "w-full",
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-[1.1em] w-[1.1em] animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
    />
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  block,
  loading,
  loadingLabel = "Veuillez patienter…",
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(appButtonClasses(variant, size, block), className)}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
}) {
  return (
    <Link className={cn(appButtonClasses(variant, size, block), className)} {...props}>
      {children}
    </Link>
  );
}
