import { cn } from "@/lib/cn";

type SectionEyebrowProps = {
  children: React.ReactNode;
  className?: string;
  /** Render as a different element when semantics require it. */
  as?: "p" | "span" | "div";
};

/**
 * Small section label preceded by a short orange rule, as in the approved
 * reference ("—— NOS ACTIVITÉS").
 */
export function SectionEyebrow({ children, className, as: Tag = "p" }: SectionEyebrowProps) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-4 font-heading text-[0.6875rem] font-semibold tracking-[0.24em] text-ink-subtle uppercase sm:text-xs sm:tracking-[0.26em]",
        className,
      )}
    >
      <span aria-hidden="true" className="h-0.5 w-7 shrink-0 rounded-full bg-orange" />
      <span>{children}</span>
    </Tag>
  );
}
