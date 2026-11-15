import type { SVGProps } from "react";

/**
 * Dispagaz orange swooshes for dark surfaces (hero and CTA banner): a glossy
 * crescent sweeping in from the top-right, and a fine band rising along the
 * bottom that widens to the right. `idPrefix` keeps gradient IDs unique.
 */
export function DispagazSwoosh({
  idPrefix = "dz",
  ...props
}: SVGProps<SVGSVGElement> & { idPrefix?: string }) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  const bottomEdge = "M0 792 C420 764 760 726 1000 666 C1200 616 1340 546 1440 474";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id={id("band")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FF5A00" />
          <stop offset="0.55" stopColor="#FF7A00" />
          <stop offset="1" stopColor="#FFA640" />
        </linearGradient>
        <linearGradient id={id("band2")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FF6B00" stopOpacity="0" />
          <stop offset="0.45" stopColor="#FF6B00" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FF8A00" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("curve")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF6B00" stopOpacity="0" />
          <stop offset="0.3" stopColor="#FF6B00" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FF9A2E" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF6B00" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FF6B00" stopOpacity="0" />
        </radialGradient>
        <filter id={id("blur")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <ellipse cx="1110" cy="440" rx="560" ry="320" fill={url("glow")} />

      {/* crescent from the top-right corner */}
      <path
        d="M1440 20 C1270 120 1110 260 1020 430 C1000 470 1010 490 1050 470 C1170 400 1300 350 1440 330 Z"
        fill={url("band")}
      />
      <path
        d="M1440 20 C1270 120 1110 260 1020 430 C1090 330 1240 220 1440 130 Z"
        fill={url("sheen")}
      />
      <path
        d="M1440 380 C1300 420 1170 480 1080 560 C1060 580 1075 590 1100 578 C1210 520 1320 480 1440 465 Z"
        fill={url("band2")}
      />

      {/* fine band rising along the bottom, widening to the right */}
      <path
        d={bottomEdge}
        fill="none"
        stroke="#FF6B00"
        strokeWidth="40"
        opacity="0.18"
        filter={url("blur")}
      />
      <path
        d={`${bottomEdge} L1440 548 C1342 606 1204 664 1004 704 C764 752 424 784 0 800 Z`}
        fill={url("curve")}
      />
      <path
        d={`${bottomEdge} L1440 486 C1342 556 1204 628 1004 678 C764 738 424 776 0 797 Z`}
        fill="#FFB060"
        opacity="0.55"
      />
    </svg>
  );
}
