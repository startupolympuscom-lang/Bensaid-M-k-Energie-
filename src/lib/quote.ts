import { activities } from "@/content/activities";

/**
 * Quote request — shared validation used both in the browser (instant
 * feedback) and in the Server Action (authoritative). No dependency needed.
 */

export const QUOTE_FIELDS = ["name", "company", "phone", "email", "need", "message"] as const;
export type QuoteField = (typeof QUOTE_FIELDS)[number];

export type QuoteValues = Record<QuoteField, string>;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export type QuoteState =
  | { status: "idle"; attempt: number }
  | { status: "invalid"; attempt: number; errors: QuoteErrors; values: QuoteValues }
  | { status: "error"; attempt: number; message: string; values: QuoteValues }
  | { status: "success"; attempt: number };

export const initialQuoteState: QuoteState = { status: "idle", attempt: 0 };

/** Hidden field that real users never fill in (basic spam protection). */
export const HONEYPOT_FIELD = "site_web";

/** Options of the "Type de besoin" field: the four activities + a Dispagaz demo request. */
export const QUOTE_NEEDS: { id: string; label: string }[] = [
  ...activities.map((a) => ({ id: a.id as string, label: a.title })),
  { id: "dispagaz", label: "Dispagaz (démo)" },
];

const NEED_IDS = QUOTE_NEEDS.map((n) => n.id);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]+$/;

export function readQuoteValues(formData: FormData): QuoteValues {
  const get = (key: QuoteField) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    name: get("name"),
    company: get("company"),
    phone: get("phone"),
    email: get("email"),
    need: get("need"),
    message: get("message"),
  };
}

export function validateQuote(values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {};

  if (!values.name) errors.name = "Veuillez indiquer votre nom complet.";
  else if (values.name.length < 2 || values.name.length > 100)
    errors.name = "Le nom doit contenir entre 2 et 100 caractères.";

  if (values.company.length > 120) errors.company = "120 caractères maximum.";

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (!values.phone) errors.phone = "Veuillez indiquer un numéro de téléphone.";
  else if (!PHONE_RE.test(values.phone) || phoneDigits.length < 9 || phoneDigits.length > 15)
    errors.phone = "Numéro invalide. Exemple : 06 12 34 56 78.";

  if (values.email && (!EMAIL_RE.test(values.email) || values.email.length > 160))
    errors.email = "Adresse email invalide. Exemple : nom@entreprise.ma";

  if (!values.need) errors.need = "Veuillez sélectionner un type de besoin.";
  else if (!NEED_IDS.includes(values.need)) errors.need = "Type de besoin invalide.";

  if (!values.message) errors.message = "Veuillez décrire brièvement votre besoin.";
  else if (values.message.length < 10)
    errors.message = "Merci de préciser votre besoin (10 caractères minimum).";
  else if (values.message.length > 2000) errors.message = "2000 caractères maximum.";

  return errors;
}

export function needLabel(id: string): string {
  return QUOTE_NEEDS.find((n) => n.id === id)?.label ?? id;
}
