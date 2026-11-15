import type { ReactNode } from "react";
import { DispagazSwoosh } from "@/components/dispagaz/DispagazSwoosh";
import { formatMAD } from "@/lib/dispagaz/format";
import type { Centimes } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

/** Wallet balance, shown prominently but calmly on a charcoal card. */
export function WalletCard({
  balance,
  action,
  className,
}: {
  balance: Centimes;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label="Solde Dispagaz"
      className={cn(
        "relative isolate overflow-hidden rounded-[22px] bg-dz-ink px-6 py-6 text-white sm:px-8 sm:py-7",
        className,
      )}
    >
      <DispagazSwoosh
        idPrefix="dz-wallet"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-[70%] opacity-40"
      />
      <p className="text-sm text-white/65">Solde Dispagaz</p>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
        <p
          className="text-[2.25rem] leading-none font-bold tracking-[-0.03em] sm:text-[2.6rem]"
          aria-live="polite"
        >
          {formatMAD(balance)}
        </p>
        {action}
      </div>
    </section>
  );
}
