import type { SVGProps } from "react";

/**
 * Minimal icon set — used only where icons improve usability
 * (navigation arrow, menu, phone, email, location).
 */

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h14.5" />
      <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.3 3.5H5.6A1.6 1.6 0 0 0 4 5.2C4.4 13.4 10.6 19.6 18.8 20a1.6 1.6 0 0 0 1.7-1.6v-2.7a1 1 0 0 0-.7-1l-3.3-1a1 1 0 0 0-1 .3l-1.4 1.6a12.6 12.6 0 0 1-5.7-5.7l1.6-1.4a1 1 0 0 0 .3-1l-1-3.3a1 1 0 0 0-1-.7Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}
