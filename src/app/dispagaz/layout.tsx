import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

/**
 * Dispagaz® ecosystem (landing page + customer web app).
 *
 * Applies the Dispagaz typeface, Satoshi. Satoshi is distributed under the
 * ITF Free Font License, which forbids sharing the font files through a
 * public repository — so it is served by the official Fontshare API instead
 * of being committed here. Fallback stack: Inter, Arial, sans-serif.
 */
export default function DispagazRootLayout({ children }: LayoutProps<"/dispagaz">) {
  return (
    <div className="dz-theme flex flex-1 flex-col">
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        precedence="default"
      />
      {children}
    </div>
  );
}
