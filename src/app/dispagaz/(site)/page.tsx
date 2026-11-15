import type { Metadata } from "next";
import { DispagazHero } from "@/components/dispagaz/DispagazHero";
import {
  DispagazCTA,
  DispagazDistribution,
  DispagazFeatures,
  DispagazSolutions,
} from "@/components/dispagaz/DispagazSections";
import { company } from "@/config/company";
import { dispagaz } from "@/config/dispagaz";
import { absoluteUrl, siteUrl } from "@/lib/site";

const title = `${dispagaz.name} — ${dispagaz.tagline}`;
const socialImage = {
  url: "/dispagaz/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${dispagaz.name} — Digitalisez et pilotez votre distribution de GPL.`,
};

export const metadata: Metadata = {
  title: { absolute: title },
  description: dispagaz.description,
  alternates: { canonical: "/dispagaz" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: dispagaz.name,
    title,
    description: dispagaz.description,
    url: "/dispagaz",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: dispagaz.description,
    images: [socialImage],
  },
};

function DispagazJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: dispagaz.name,
    description: dispagaz.description,
    url: absoluteUrl("/dispagaz"),
    serviceType: "Solution digitale pour la distribution de GPL",
    provider: { "@id": `${siteUrl}/#organization`, name: company.name },
    areaServed: { "@type": "Country", name: "Maroc" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function DispagazPage() {
  return (
    <>
      <DispagazHero />
      <DispagazSolutions />
      <DispagazFeatures />
      <DispagazDistribution />
      <DispagazCTA />
      <DispagazJsonLd />
    </>
  );
}
