import { cn } from "@/lib/cn";

type SectionEyebrowProps = {
  children: React.ReactNode;
  className?: string;
  /** Render as a different element when semantics require it. */
  as?: "p" | "span" | "div";
  /** "accent": orange label (Dispagaz); "onDark": light label for dark surfaces. */
  tone?: "default" | "accent" | "onDark";
};

const tones = {
  default: "text-ink-subtle",
  accent: "text-orange-text",
  onDark: "text-white/70",
};

/**
 * Small section label preceded by a short orange rule, as in the approved
 * reference ("—— NOS ACTIVITÉS").
 */
export function SectionEyebrow({
  children,
  className,
  as: Tag = "p",
  tone = "default",
}: SectionEyebrowProps) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-4 font-heading text-[0.6875rem] font-semibold tracking-[0.24em] uppercase sm:text-xs sm:tracking-[0.26em]",
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-0.5 w-7 shrink-0 rounded-full",
          tone === "default" ? "bg-orange" : "bg-orange-deep",
        )}
      />
      <span>{children}</span>
    </Tag>
  );
}
