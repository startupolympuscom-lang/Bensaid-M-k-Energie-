import primaryLogo from "@/assets/brand/bme-logo-primary.png";
import { company } from "@/config/company";
import { getAddressLine, getEmail, getPhones, getSocialLinks, isProvided } from "@/lib/company";
import { absoluteUrl, siteUrl } from "@/lib/site";

/**
 * Organization structured data, generated exclusively from
 * src/config/company.ts. Missing values are omitted, never invented.
 */
export function OrganizationJsonLd() {
  const phones = getPhones();
  const email = getEmail();
  const { street, district, postalCode, city, countryCode } = company.address;

  const identifiers = [
    isProvided(company.rc) && { "@type": "PropertyValue", propertyID: "RC", value: company.rc },
    isProvided(company.ice) && { "@type": "PropertyValue", propertyID: "ICE", value: company.ice },
  ].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    ...(isProvided(company.legalName) ? { legalName: company.legalName } : {}),
    url: siteUrl,
    logo: absoluteUrl(primaryLogo.src),
    description: company.description,
    slogan: company.tagline,
    ...(email ? { email } : {}),
    ...(phones[0] ? { telephone: phones[0].e164 } : {}),
    ...(getAddressLine()
      ? {
          address: {
            "@type": "PostalAddress",
            ...(isProvided(street) || isProvided(district)
              ? { streetAddress: [street, district].filter(isProvided).join(", ") }
              : {}),
            ...(isProvided(postalCode) ? { postalCode } : {}),
            addressLocality: city,
            addressCountry: countryCode,
          },
        }
      : {}),
    areaServed: { "@type": "Country", name: "Maroc" },
    ...(phones.length > 0
      ? {
          contactPoint: phones.map((phone) => ({
            "@type": "ContactPoint",
            telephone: phone.e164,
            contactType: "customer service",
            areaServed: "MA",
          })),
        }
      : {}),
    ...(identifiers.length > 0 ? { identifier: identifiers } : {}),
    ...(getSocialLinks().length > 0 ? { sameAs: getSocialLinks().map((s) => s.url) } : {}),
    knowsAbout: [
      "GPL",
      "Butane",
      "Propane",
      "Gaz industriels",
      "Énergie solaire photovoltaïque",
      "Solaire thermique",
      "Conseil énergétique",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" to prevent any HTML injection through the serialized JSON.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
