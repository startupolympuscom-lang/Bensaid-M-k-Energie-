import type { Viewport } from "next";
import localFont from "next/font/local";

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

/**
 * Satoshi, the Dispagaz typeface, self-hosted with the site: preloaded, no
 * third-party request at runtime, and a size-adjusted Arial fallback so text
 * doesn't jump while it loads.
 *
 * It is distributed under the ITF Free Font License, which allows
 * self-hosting on a website but forbids sharing the font files through a
 * public repository — so the files are not committed: `npm run build` /
 * `npm run dev` download them first (scripts/fetch-satoshi.mjs).
 */
const satoshi = localFont({
  src: [
    { path: "../../assets/fonts/satoshi/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../../assets/fonts/satoshi/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../../assets/fonts/satoshi/satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "../../assets/fonts/satoshi/satoshi-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["Inter", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

/** Dispagaz® ecosystem (landing page + customer web app). */
export default function DispagazRootLayout({ children }: LayoutProps<"/dispagaz">) {
  return <div className={`${satoshi.variable} dz-theme flex flex-1 flex-col`}>{children}</div>;
}
