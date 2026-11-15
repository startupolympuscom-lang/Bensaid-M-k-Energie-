import type { ReactNode } from "react";
import { addressLine, cityLine, propertyTypeLabels } from "@/lib/dispagaz/labels";
import type { Address, AddressInput } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

export function AddressCard({
  address,
  actions,
  selected,
  className,
}: {
  address: Address | AddressInput;
  actions?: ReactNode;
  selected?: boolean;
  className?: string;
}) {
  const isDefault = "isDefault" in address && address.isDefault;
  return (
    <div
      className={cn(
        "rounded-[18px] border bg-white p-5 transition-colors",
        selected ? "border-dz-orange shadow-[0_0_0_1px_var(--color-dz-orange)]" : "border-dz-line",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-bold">
            {address.label}
            {isDefault ? (
              <span className="rounded-full bg-dz-teal-tint px-2 py-0.5 text-xs font-medium text-dz-teal">
                Par défaut
              </span>
            ) : null}
          </p>
          <p className="mt-1.5 text-[0.9375rem] text-dz-ink">{addressLine(address)}</p>
          <p className="text-[0.9375rem] text-dz-muted">{cityLine(address)}</p>
          <p className="mt-1 text-sm text-dz-subtle">{propertyTypeLabels[address.propertyType]}</p>
        </div>
      </div>
      {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
