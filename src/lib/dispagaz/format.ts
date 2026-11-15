import type { Centimes } from "@/types/dispagaz";

const madNumber = new Intl.NumberFormat("fr-MA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 35000 → "350,00 MAD" (amounts are stored in centimes). */
export function formatMAD(amount: Centimes): string {
  return `${madNumber.format(amount / 100)} MAD`;
}

/** Signed variant for wallet history: "+ 100,00 MAD" / "− 55,00 MAD". */
export function formatSignedMAD(amount: Centimes): string {
  const sign = amount > 0 ? "+ " : amount < 0 ? "− " : "";
  return `${sign}${formatMAD(Math.abs(amount))}`;
}

/** "120" or "120,5" (user input, MAD) → centimes. Returns NaN when invalid. */
export function parseMADInput(value: string): Centimes {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return Number.NaN;
  return Math.round(Number(normalized) * 100);
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dateTimeFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const shortDateFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));
export const formatShortDate = (iso: string) => shortDateFormat.format(new Date(iso));

/** Random identifier (demo). */
export function createId(prefix = "id"): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${random}`;
}

function randomDigits(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
  return out;
}

/** "DZ-251115-4821" */
export function createOrderNumber(date = new Date()): string {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `DZ-${y}${m}${d}-${randomDigits(4)}`;
}

/** Payment / transaction reference, e.g. "PAY-7F3K9Q". */
export function createReference(prefix: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${prefix}-${out}`;
}

/** 6-digit pickup code. */
export const createPickupCode = () => randomDigits(6);

/** "0661424198" → "06 61 42 41 98" (display only). */
export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  return raw;
}
