import type { Metadata } from "next";
import { company } from "@/config/company";

/** Site-wide social image (src/app/opengraph-image.png). */
const socialImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${company.name} — ${company.tagline}.`,
};

export const sharedOpenGraph = {
  type: "website",
  locale: "fr_MA",
  siteName: company.name,
  images: [socialImage],
} satisfies Metadata["openGraph"];

/**
 * Builds consistent metadata for a page: title, description, canonical URL,
 * Open Graph and Twitter cards. Page-level `openGraph` replaces the parent
 * object entirely in Next.js, so shared fields are always re-applied here.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const socialTitle = `${title} | ${company.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...sharedOpenGraph, title: socialTitle, description, url: path },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },
  };
}
