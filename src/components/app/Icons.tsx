import type { SVGProps } from "react";

/** Minimal line icons — used only where they help (navigation, status). */
type P = SVGProps<SVGSVGElement>;
const base: P = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export const HomeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6h-6v6H4.5a1 1 0 0 1-1-1z" />
  </svg>
);
export const FlameIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21c3.6 0 6-2.4 6-5.8 0-3.4-2.6-5.2-3.4-8.7-2.3 1.4-3.3 3.4-3.4 5.2-.9-.7-1.5-1.9-1.6-3.1C7.6 10.4 6 12.6 6 15.2 6 18.6 8.4 21 12 21Z" />
  </svg>
);
export const ListIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);
export const WalletIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
    <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
    <path d="M16.5 13.5h.01" strokeWidth="2.4" />
  </svg>
);
export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
);
export const BellIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const TruckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 6.5h11v9h-11zM13.5 10h4l3 3v2.5h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const StationIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4" y="3.5" width="16" height="17" rx="2" />
    <path d="M4 9h16M12 9v11.5M8 6.25h.01M16 6.25h.01" />
  </svg>
);
export const ChevronRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);
export const ChevronLeftIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);
export const MapIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m3.5 6.5 5-2 7 2.5 5-2v13l-5 2-7-2.5-5 2zM8.5 4.5v13M15.5 7v13" />
  </svg>
);
export const LogoutIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14M10 8l-4 4 4 4M6 12h10" />
  </svg>
);
