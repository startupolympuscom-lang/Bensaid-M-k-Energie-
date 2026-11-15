import { company } from "@/config/company";
import { needLabel, type QuoteValues } from "@/lib/quote";

/**
 * Delivers a quote request. Server-side only (imported by the Server Action).
 *
 * Configure ONE of the following in the environment (see .env.example):
 *  - Email via Resend: RESEND_API_KEY + QUOTE_TO_EMAIL (+ optional QUOTE_FROM_EMAIL)
 *  - Webhook (Make, Zapier, n8n, Formspree, CRM…): QUOTE_WEBHOOK_URL
 *
 * Without configuration, requests are logged to the server console in
 * development, and refused in production with a clear message so that no
 * request is silently lost.
 */

export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function buildText(values: QuoteValues) {
  return [
    `Nouvelle demande de devis — ${company.name}`,
    "",
    `Nom complet : ${values.name}`,
    `Entreprise : ${values.company || "—"}`,
    `Téléphone : ${values.phone}`,
    `Email : ${values.email || "—"}`,
    `Type de besoin : ${needLabel(values.need)}`,
    "",
    "Message :",
    values.message,
  ].join("\n");
}

async function sendWithResend(values: QuoteValues, apiKey: string, to: string): Promise<boolean> {
  const from = process.env.QUOTE_FROM_EMAIL || `${company.name} <onboarding@resend.dev>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      subject: oneLine(`Demande de devis — ${needLabel(values.need)} — ${values.name}`),
      text: buildText(values),
      ...(values.email ? { reply_to: values.email } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    console.error("[quote] Resend error", response.status, await response.text().catch(() => ""));
  }
  return response.ok;
}

async function sendToWebhook(values: QuoteValues, url: string): Promise<boolean> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "quote_request",
      source: company.name,
      submittedAt: new Date().toISOString(),
      ...values,
      needLabel: needLabel(values.need),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) console.error("[quote] Webhook error", response.status);
  return response.ok;
}

export async function deliverQuote(values: QuoteValues): Promise<DeliveryResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  const webhook = process.env.QUOTE_WEBHOOK_URL;

  try {
    if (resendKey && to) {
      return (await sendWithResend(values, resendKey, to))
        ? { ok: true }
        : { ok: false, reason: "failed" };
    }
    if (webhook) {
      return (await sendToWebhook(values, webhook))
        ? { ok: true }
        : { ok: false, reason: "failed" };
    }
  } catch (error) {
    console.error("[quote] Delivery failed", error);
    return { ok: false, reason: "failed" };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[quote] No delivery channel configured — request logged only:\n" + buildText(values),
    );
    return { ok: true };
  }

  console.error(
    "[quote] No delivery channel configured (set RESEND_API_KEY + QUOTE_TO_EMAIL or QUOTE_WEBHOOK_URL).",
  );
  return { ok: false, reason: "not-configured" };
}
