import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/app/Icons";
import { cn } from "@/lib/cn";

/** Large, clean selection panel (button). Used for key choices. */
export function ChoicePanel({
  title,
  description,
  icon,
  selected,
  onClick,
  disabled,
  className,
  trailing,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-center gap-4 rounded-[20px] border bg-white p-5 text-left transition-[border-color,box-shadow,background-color] duration-200 sm:p-6",
        "hover:border-dz-ink/25 hover:shadow-[0_10px_30px_-18px_rgb(0_0_0/0.25)] disabled:cursor-not-allowed disabled:opacity-55",
        selected
          ? "border-dz-orange bg-dz-orange-tint/60 shadow-[0_0_0_1px_var(--color-dz-orange)]"
          : "border-dz-line",
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            selected ? "bg-dz-orange text-dz-ink" : "bg-dz-gray text-dz-ink",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[1.0625rem] font-bold tracking-[-0.01em]">{title}</span>
        {description ? (
          <span className="mt-1 block text-[0.9375rem] leading-snug text-dz-muted">
            {description}
          </span>
        ) : null}
      </span>
      {trailing ?? (
        <ChevronRightIcon className="shrink-0 text-dz-subtle transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
