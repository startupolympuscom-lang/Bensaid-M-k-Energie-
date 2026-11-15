import { company } from "@/config/company";

/** True when a configuration value has actually been provided. */
export function isProvided(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Formats a Moroccan national number the way it appears in the official
 * graphic charter: "0661424198" → "0661 42 41 98".
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  return raw.trim();
}

/** Converts a Moroccan national number to E.164: "0661424198" → "+212661424198". */
export function toE164(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("212")) return `+${digits}`;
  if (digits.startsWith("0")) return `+212${digits.slice(1)}`;
  return `+${digits}`;
}

export function telHref(raw: string): string {
  return `tel:${toE164(raw)}`;
}

export function getPhones() {
  return company.phones
    .filter((p) => isProvided(p.number))
    .map((p) => ({
      ...p,
      display: formatPhone(p.number),
      href: telHref(p.number),
      e164: toE164(p.number),
    }));
}

export function getPrimaryPhone() {
  return getPhones()[0];
}

export function getEmail(): string | undefined {
  return isProvided(company.email) ? company.email.trim() : undefined;
}

/** Single-line address built only from the provided parts. */
export function getAddressLine(): string {
  const { street, district, postalCode, city, country } = company.address;
  const cityPart = [postalCode, city].filter(isProvided).join(" ");
  return [street, district, cityPart, country].filter(isProvided).join(", ");
}

export function getLegalIdentifiers() {
  return [
    isProvided(company.rc) ? { label: "RC", value: company.rc.trim() } : null,
    isProvided(company.ice) ? { label: "ICE", value: company.ice.trim() } : null,
  ].filter((v): v is { label: string; value: string } => v !== null);
}

export function getSocialLinks() {
  return Object.entries(company.social)
    .filter(([, url]) => isProvided(url))
    .map(([network, url]) => ({ network, url }));
}
