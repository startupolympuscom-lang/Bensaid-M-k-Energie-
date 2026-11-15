import { company } from "@/config/company";
import { isProvided } from "@/lib/company";

function normalize(url: string): string {
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

/**
 * Absolute base URL of the website, used for canonical URLs, the sitemap,
 * robots.txt, Open Graph and structured data.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL (recommended — set it in your hosting provider)
 *  2. company.website from src/config/company.ts
 *  3. Vercel production URL (automatically provided on Vercel)
 *  4. http://localhost:3000 (local development)
 */
export const siteUrl: string = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (isProvided(fromEnv)) return normalize(fromEnv);
  if (isProvided(company.website)) return normalize(company.website);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (isProvided(vercel)) return normalize(vercel);
  return "http://localhost:3000";
})();

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Used for sitemap <lastmod>. Update when the content changes significantly. */
export const contentLastUpdated = "2026-11-15";
