import type { SVGProps } from "react";

/**
 * Hero ribbon — the brand's main graphical signature.
 *
 * Inlined verbatim from Bensaid_Mek_Energie_Website_Assets/graphics/hero-ribbon.svg
 * (same paths, gradients and filter; only the IDs are namespaced). Inlining
 * avoids an extra request and keeps the artwork razor-sharp at any size.
 * If the source SVG is updated, mirror the change here.
 */
export function HeroRibbon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 950"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id="bme-ribbon-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD14A" />
          <stop offset="0.45" stopColor="#FF9800" />
          <stop offset="1" stopColor="#FF6B00" />
        </linearGradient>
        <linearGradient id="bme-ribbon-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19B6A7" />
          <stop offset="0.5" stopColor="#078F83" />
          <stop offset="1" stopColor="#175C58" />
        </linearGradient>
        <linearGradient id="bme-ribbon-charcoal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#596064" />
          <stop offset="0.45" stopColor="#2B3033" />
          <stop offset="1" stopColor="#121517" />
        </linearGradient>
        <filter id="bme-ribbon-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      {/* subtle shadow / atmospheric fade */}
      <path
        d="M430,905 C590,690 735,565 895,455 C1020,370 1115,250 1200,72"
        fill="none"
        stroke="#CBD0D3"
        strokeWidth="78"
        opacity=".16"
        filter="url(#bme-ribbon-soft)"
      />
      {/* orange ribbon */}
      <path
        d="M418,667 C460,460 585,348 760,264 C928,184 1085,116 1200,0 C1164,180 1086,314 938,402 C765,505 575,542 418,667 Z"
        fill="url(#bme-ribbon-orange)"
      />
      {/* teal ribbon */}
      <path
        d="M445,790 C498,620 636,515 810,427 C974,344 1102,266 1200,150 C1168,326 1075,472 933,559 C774,655 596,683 445,790 Z"
        fill="url(#bme-ribbon-teal)"
      />
      {/* charcoal ribbon */}
      <path
        d="M500,950 C586,784 726,699 879,627 C1027,557 1122,483 1200,397 L1200,620 C1115,700 1017,756 902,802 C758,859 626,890 500,950 Z"
        fill="url(#bme-ribbon-charcoal)"
      />
    </svg>
  );
}
