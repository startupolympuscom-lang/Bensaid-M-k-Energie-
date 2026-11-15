"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/app/Icons";
import { cn } from "@/lib/cn";

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Native <dialog>: focus trap, Escape and inert background for free. */
function useDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return ref;
}

function Header({
  title,
  description,
  onClose,
}: Pick<OverlayProps, "title" | "description" | "onClose">) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 pt-6">
      <div>
        <h2 className="text-xl font-bold tracking-[-0.02em]">{title}</h2>
        {description ? <p className="mt-1 text-[0.9375rem] text-dz-muted">{description}</p> : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="-mt-1 -mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-dz-muted hover:bg-dz-gray hover:text-dz-ink"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/** Centered dialog. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: OverlayProps) {
  const ref = useDialog(open);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={cn(
        "dz-theme m-auto w-[calc(100%-2rem)] max-w-md rounded-[20px] bg-white p-0 text-dz-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.35)] backdrop:bg-dz-ink/45 backdrop:backdrop-blur-[2px]",
        className,
      )}
    >
      {open ? (
        <>
          <Header title={title} description={description} onClose={onClose} />
          <div className="px-6 pt-5 pb-6">{children}</div>
          {footer ? (
            <div className="flex flex-col gap-2 border-t border-dz-line px-6 py-4 sm:flex-row-reverse">
              {footer}
            </div>
          ) : null}
        </>
      ) : null}
    </dialog>
  );
}

/** Bottom sheet on mobile, side panel on desktop. */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: OverlayProps) {
  const ref = useDialog(open);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={cn(
        "dz-theme fixed inset-x-0 top-auto bottom-0 m-0 max-h-[92dvh] w-full max-w-none rounded-t-[24px] bg-white p-0 text-dz-ink shadow-[0_-20px_60px_-20px_rgb(0_0_0/0.3)] backdrop:bg-dz-ink/45",
        "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-dvh sm:max-h-none sm:w-[30rem] sm:rounded-none sm:rounded-l-[24px]",
        className,
      )}
    >
      {open ? (
        <div className="flex max-h-[92dvh] flex-col sm:h-full sm:max-h-none">
          <Header title={title} description={description} onClose={onClose} />
          <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6">{children}</div>
          {footer ? (
            <div className="dz-safe-bottom flex flex-col gap-2 border-t border-dz-line px-6 pt-4 pb-4">
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
