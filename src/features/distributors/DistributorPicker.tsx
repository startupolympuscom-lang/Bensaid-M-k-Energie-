"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/app/Field";
import { DistributorCard } from "@/features/distributors/DistributorCard";
import { DistributorMap } from "@/features/distributors/DistributorMap";
import type { Distributor } from "@/types/dispagaz";

/** List + map of Points Dispagaz (toggle on mobile, side by side on desktop). */
export function DistributorPicker({
  distributors,
  initialSelectedId,
  onChoose,
  chooseLabel,
}: {
  distributors: Distributor[];
  initialSelectedId?: string;
  onChoose: (id: string) => void;
  chooseLabel?: string;
}) {
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? distributors[0]?.id);
  const selected = distributors.find((d) => d.id === selectedId);

  return (
    <div>
      <SegmentedControl<"list" | "map">
        label="Affichage"
        value={view}
        onChange={setView}
        options={[
          { value: "list", label: "Liste" },
          { value: "map", label: "Carte" },
        ]}
        className="mb-5 lg:hidden"
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
        <ul className={view === "list" ? "space-y-3" : "hidden space-y-3 lg:block"}>
          {distributors.map((d) => (
            <li key={d.id}>
              <DistributorCard
                distributor={d}
                selected={d.id === selectedId}
                onSelect={() => setSelectedId(d.id)}
                onChoose={() => onChoose(d.id)}
                chooseLabel={chooseLabel}
              />
            </li>
          ))}
        </ul>
        <div
          className={
            view === "map" ? "space-y-3 lg:sticky lg:top-24" : "hidden lg:sticky lg:top-24 lg:block"
          }
        >
          <DistributorMap
            distributors={distributors}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {view === "map" && selected ? (
            <div className="lg:hidden">
              <DistributorCard
                distributor={selected}
                selected
                onChoose={() => onChoose(selected.id)}
                chooseLabel={chooseLabel}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
