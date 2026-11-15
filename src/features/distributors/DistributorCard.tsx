import { Button } from "@/components/app/Button";
import { distributorStatusLabels } from "@/lib/dispagaz/labels";
import { isPickupPossible, productsAt } from "@/services/distributorService";
import type { Distributor } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

const km = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

export function openingLabel(d: Distributor) {
  if (d.status !== "open") return distributorStatusLabels[d.status];
  return d.is24_7 ? "Ouvert 24h/24" : `Ouvert · ${d.openingHours}`;
}

/** Sizes in stock at a point, e.g. ["6 kg", "12 kg"]. */
export function availableSizes(d: Distributor) {
  return [
    ...new Set(
      productsAt(d)
        .sort((a, b) => a.weightKg - b.weightKg)
        .map((p) => p.size),
    ),
  ];
}

export function DistributorCard({
  distributor,
  selected,
  onSelect,
  onChoose,
  chooseLabel = "Choisir ce point",
}: {
  distributor: Distributor;
  selected?: boolean;
  onSelect?: () => void;
  onChoose?: () => void;
  chooseLabel?: string;
}) {
  const possible = isPickupPossible(distributor);
  const sizes = availableSizes(distributor);
  return (
    <article
      onClick={onSelect}
      className={cn(
        "rounded-[18px] border bg-white p-5 transition-[border-color,box-shadow]",
        selected ? "border-dz-orange shadow-[0_0_0_1px_var(--color-dz-orange)]" : "border-dz-line",
        onSelect && "cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-bold">{distributor.name}</h2>
          <p className="mt-0.5 text-[0.9375rem] text-dz-muted">
            {distributor.address}, {distributor.city}
          </p>
        </div>
        <p className="shrink-0 text-[0.9375rem] font-medium tabular-nums">
          {km.format(distributor.distanceKm)} km
        </p>
      </div>
      <p
        className={cn(
          "mt-3 text-sm font-medium",
          distributor.status === "open" ? "text-dz-teal" : "text-dz-subtle",
        )}
      >
        {openingLabel(distributor)}
      </p>
      <p className="mt-1 text-sm text-dz-muted">
        {sizes.length
          ? sizes.map((s) => `${s} disponible`).join(" · ")
          : "Aucune bouteille disponible"}
      </p>
      {onChoose ? (
        <Button
          variant={selected ? "primary" : "tertiary"}
          className="mt-4 h-11"
          block
          disabled={!possible}
          onClick={(e) => {
            e.stopPropagation();
            onChoose();
          }}
        >
          {possible ? chooseLabel : "Indisponible"}
        </Button>
      ) : null}
    </article>
  );
}
