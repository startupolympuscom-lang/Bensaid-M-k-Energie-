"use server";

import { getPrimaryPhone } from "@/lib/company";
import { HONEYPOT_FIELD, readQuoteValues, validateQuote, type QuoteState } from "@/lib/quote";
import { deliverQuote } from "@/lib/quote-delivery";

export async function submitQuote(previous: QuoteState, formData: FormData): Promise<QuoteState> {
  const attempt = previous.attempt + 1;

  // Bots fill every field: silently accept and drop.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", attempt };
  }

  const values = readQuoteValues(formData);
  const errors = validateQuote(values);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", attempt, errors, values };
  }

  const result = await deliverQuote(values);
  if (result.ok) return { status: "success", attempt };

  const phone = getPrimaryPhone();
  const fallback = phone ? ` Vous pouvez également nous appeler au ${phone.display}.` : "";
  return {
    status: "error",
    attempt,
    values,
    message: `Votre demande n’a pas pu être envoyée pour le moment. Merci de réessayer dans quelques instants.${fallback}`,
  };
}
