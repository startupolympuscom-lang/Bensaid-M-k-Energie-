/**
 * ============================================================================
 *  Bensaid Mek Énergie — official company information (single source of truth)
 * ============================================================================
 *
 *  Every component (header, footer, contact page, SEO metadata, JSON-LD…)
 *  reads company data from THIS file only. Never hard-code these values
 *  elsewhere.
 *
 *  RULE: do not invent information. Any field left as an empty string ("")
 *  is treated as "not available" and is simply not rendered on the website
 *  (nor exposed in structured data).
 *
 *  Fields marked  ⚠️ À COMPLÉTER  must be confirmed from the company's
 *  official records before launch (see
 *  Bensaid_Mek_Energie_Website_Assets/docs/DATA_VERIFICATION.md).
 * ============================================================================
 */

export type CompanyPhone = {
  /** Number as written in the official documents (national format). */
  number: string;
  /** Optional label, e.g. "Commercial", "Service client". */
  label?: string;
};

export const company = {
  name: "Bensaid Mek Énergie",

  /** ⚠️ À COMPLÉTER — exact legal name (e.g. "Bensaid Mek Énergie SARL"). */
  legalName: "",

  tagline: "Gaz, énergie et solutions durables",

  /** Short description reused for SEO and structured data. */
  description:
    "Distribution de GPL, gaz industriels, solutions solaires et services énergétiques pour les particuliers, les professionnels et les industries au Maroc.",

  address: {
    /**
     * ⚠️ À COMPLÉTER — street and number.
     * The letterhead mock-up in references/graphical-charter-reference.png
     * shows "91 rue Hakima, Apt. 20, 5ᵉ étage" — verify before using it.
     */
    street: "",
    /** District / neighbourhood (provided). */
    district: "Lot Charf",
    /**
     * ⚠️ À COMPLÉTER — postal code. The letterhead mock-up shows "50050";
     * verify before using it.
     */
    postalCode: "",
    city: "Meknès",
    country: "Maroc",
    /** ISO 3166-1 alpha-2 — used in structured data. */
    countryCode: "MA",
  },

  /** Phone numbers (provided). The first one is the primary contact number. */
  phones: [{ number: "0661424198" }, { number: "0661350545" }] as CompanyPhone[],

  /**
   * ⚠️ À COMPLÉTER — official public email address.
   * Mock-ups show "contact@bensaidmekenergie.ma" — verify before using it.
   */
  email: "",

  /**
   * ⚠️ À COMPLÉTER — final public domain, with protocol
   * (e.g. "https://www.example.ma"). Used for canonical URLs, sitemap and
   * Open Graph when NEXT_PUBLIC_SITE_URL is not set.
   */
  website: "",

  /** ⚠️ À COMPLÉTER — Registre de commerce (verify before publishing). */
  rc: "",

  /** ⚠️ À COMPLÉTER — Identifiant Commun de l'Entreprise (verify before publishing). */
  ice: "",

  /**
   * Social profiles. Leave empty unless real, official profile URLs exist.
   * No icon is displayed for an empty entry.
   */
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export type Company = typeof company;
