import type { SVGProps } from "react";

/**
 * Decorative wave for the dark CTA banner.
 * Inlined verbatim from Bensaid_Mek_Energie_Website_Assets/graphics/cta-wave.svg
 * (IDs namespaced). Keep it understated.
 */
export function CtaWave(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 280"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMaxYMax meet"
      {...props}
    >
      <defs>
        <linearGradient id="bme-cta-wave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4A5053" stopOpacity=".15" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity=".28" />
        </linearGradient>
      </defs>
      <path
        d="M280 280 C420 178 530 130 720 22 L720 110 C558 181 454 231 365 280Z"
        fill="url(#bme-cta-wave)"
      />
      <path
        d="M390 280 C505 210 596 171 720 112 L720 174 C619 218 541 250 470 280Z"
        fill="#FFFFFF"
        opacity=".08"
      />
      <path
        d="M520 280 C590 242 653 213 720 184 L720 234 C664 253 619 268 580 280Z"
        fill="#FFFFFF"
        opacity=".06"
      />
    </svg>
  );
}
