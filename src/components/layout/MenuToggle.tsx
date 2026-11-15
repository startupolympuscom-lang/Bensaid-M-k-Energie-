import type { Ref } from "react";
import { cn } from "@/lib/cn";

type MenuToggleProps = {
  open: boolean;
  onToggle: () => void;
  controls: string;
  buttonRef: Ref<HTMLButtonElement>;
  className?: string;
};

/** Two-line menu button that morphs into a cross. */
export function MenuToggle({ open, onToggle, controls, buttonRef, className }: MenuToggleProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        "-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
        className,
      )}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      onClick={onToggle}
    >
      <span aria-hidden="true" className="relative block h-3 w-[22px]">
        <span
          className={cn(
            "absolute left-0 block h-[1.75px] w-full rounded-full bg-current transition-transform duration-300 ease-soft",
            open ? "top-[5px] rotate-45" : "top-0",
          )}
        />
        <span
          className={cn(
            "absolute left-0 block h-[1.75px] w-full rounded-full bg-current transition-transform duration-300 ease-soft",
            open ? "top-[5px] -rotate-45" : "top-[10px]",
          )}
        />
      </span>
    </button>
  );
}
