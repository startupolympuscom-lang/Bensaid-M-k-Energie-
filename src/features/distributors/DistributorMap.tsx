"use client";

import type { Distributor } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

/** Mock customer position (city centre) until geolocation is wired. */
const customer = { latitude: 33.8935, longitude: -5.5547 };

/**
 * Stylised demo map. Points are projected from lat/lng into the frame.
 * Replace with Google Maps / Mapbox later — same props.
 */
export function DistributorMap({
  distributors,
  selectedId,
  onSelect,
  className,
}: {
  distributors: Distributor[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const lats = [...distributors.map((d) => d.latitude), customer.latitude];
  const lngs = [...distributors.map((d) => d.longitude), customer.longitude];
  const [minLat, maxLat, minLng, maxLng] = [
    Math.min(...lats),
    Math.max(...lats),
    Math.min(...lngs),
    Math.max(...lngs),
  ];
  const pad = 12; // %
  const pos = (lat: number, lng: number) => ({
    left: `${pad + ((lng - minLng) / (maxLng - minLng || 1)) * (100 - pad * 2)}%`,
    top: `${pad + ((maxLat - lat) / (maxLat - minLat || 1)) * (100 - pad * 2)}%`,
  });

  return (
    <div
      className={cn("relative aspect-[4/3] overflow-hidden rounded-[20px] bg-dz-gray", className)}
      role="group"
      aria-label="Carte des points Dispagaz (démonstration)"
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M-10 210 C80 190 150 230 230 200 S360 150 420 170"
          stroke="#fff"
          strokeWidth="14"
          fill="none"
        />
        <path
          d="M120 -10 C130 80 100 150 140 230 S170 300 160 320"
          stroke="#fff"
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M-10 90 C90 110 200 70 290 100 S380 120 420 95"
          stroke="#fff"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M300 -10 C280 70 320 140 290 210 S270 290 300 320"
          stroke="#fff"
          strokeWidth="8"
          fill="none"
        />
        <path d="M30 40 L380 270" stroke="#fff" strokeWidth="4" fill="none" opacity=".8" />
        <ellipse cx="250" cy="250" rx="70" ry="30" fill="#E6EEE9" />
      </svg>

      <span
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={pos(customer.latitude, customer.longitude)}
      >
        <span className="h-4 w-4 rounded-full border-[3px] border-white bg-dz-ink shadow-[0_0_0_6px_rgb(13_13_13/0.12)]" />
        <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[0.6875rem] font-medium">
          Vous
        </span>
      </span>

      {distributors.map((d) => {
        const selected = d.id === selectedId;
        const available = d.status === "open";
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d.id)}
            aria-pressed={selected}
            aria-label={`${d.name}, ${d.distanceKm.toLocaleString("fr-FR")} km`}
            className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
            style={pos(d.latitude, d.longitude)}
          >
            {selected ? (
              <span className="mb-1 rounded-full bg-dz-ink px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white">
                {d.name.replace("Dispagaz ", "")}
              </span>
            ) : null}
            <svg
              viewBox="0 0 24 30"
              className={cn(
                "drop-shadow-sm transition-transform",
                selected ? "h-9 w-8 scale-110" : "h-8 w-7",
              )}
            >
              <path
                d="M12 29s-10-9-10-17a10 10 0 0 1 20 0c0 8-10 17-10 17Z"
                fill={selected ? "#0D0D0D" : available ? "#FF7A00" : "#A7A8A9"}
              />
              <circle cx="12" cy="12" r="4" fill="#fff" />
            </svg>
          </button>
        );
      })}

      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs text-dz-muted">
        Carte de démonstration
      </span>
    </div>
  );
}
