import type { ProductCategory } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

/**
 * Minimal LPG bottle drawing, scaled by weight and banded by category
 * (butane: orange, propane: teal). Placeholder until real product photos
 * are provided through `product.image`.
 */
export function BottleImage({
  weightKg,
  category,
  className,
}: {
  weightKg: number;
  category: ProductCategory;
  className?: string;
}) {
  const scale = Math.min(1, 0.58 + Math.log10(weightKg) * 0.28);
  const h = 88 * scale;
  const w = 46 * (0.82 + scale * 0.18);
  const x = (64 - w) / 2;
  const y = 104 - h;
  const band = category === "propane" ? "#006D66" : "#FF7A00";
  const id = `bottle-${category}-${weightKg}`;

  return (
    <svg
      viewBox="0 0 64 112"
      className={cn("h-20 w-auto", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#E3E3E1" />
          <stop offset="0.45" stopColor="#FAFAF9" />
          <stop offset="1" stopColor="#D5D5D3" />
        </linearGradient>
      </defs>
      {/* valve & collar */}
      <rect x="27" y={y - 13} width="10" height="7" rx="1.5" fill="#0D0D0D" />
      <path
        d={`M${x + w * 0.22} ${y + 2} C${x + w * 0.22} ${y - 9} ${x + w * 0.78} ${y - 9} ${x + w * 0.78} ${y + 2}`}
        fill="none"
        stroke="#BDBDBB"
        strokeWidth="3"
      />
      {/* body */}
      <rect x={x} y={y} width={w} height={h} rx={w * 0.34} fill={`url(#${id})`} stroke="#CFCFCD" />
      {/* band */}
      <rect x={x} y={y + h * 0.42} width={w} height={h * 0.16} fill={band} />
      {/* foot ring */}
      <rect x={x + w * 0.12} y={y + h - 2} width={w * 0.76} height="6" rx="2" fill="#BDBDBB" />
    </svg>
  );
}
