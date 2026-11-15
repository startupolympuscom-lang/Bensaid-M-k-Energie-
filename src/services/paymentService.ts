import { demoConfig } from "@/data/config";
import { createReference, formatMAD } from "@/lib/dispagaz/format";
import type { Centimes, PaymentStatus } from "@/types/dispagaz";
import { pushNotification } from "@/services/notificationService";
import { applyTransaction } from "@/services/walletService";
import { attempt, delay, readAccount, updateAccount } from "@/services/storage";

/**
 * MOCK payment service — demo only.
 *
 * No payment data ever leaves the browser and nothing is charged. Card
 * numbers are validated structurally, then discarded: only the last four
 * digits are kept on the order / transaction. Replace with a real payment
 * provider (server-side) before going live.
 */

export type CardInput = { holder: string; number: string; expiry: string; cvv: string };
export type CardErrors = Partial<Record<keyof CardInput, string>>;

export function validateCard(card: CardInput): CardErrors {
  const errors: CardErrors = {};
  if (card.holder.trim().length < 2) errors.holder = "Indiquez le nom du titulaire.";

  const digits = card.number.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) errors.number = "Numéro de carte invalide (13 à 19 chiffres).";

  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(card.expiry.trim());
  if (!match) {
    errors.expiry = "Format MM/AA.";
  } else {
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const endOfMonth = new Date(year, month, 1);
    if (month < 1 || month > 12) errors.expiry = "Mois invalide.";
    else if (endOfMonth <= new Date()) errors.expiry = "Carte expirée.";
  }

  if (!/^\d{3,4}$/.test(card.cvv.trim())) errors.cvv = "3 ou 4 chiffres.";
  return errors;
}

function assertCard(card: CardInput) {
  const errors = validateCard(card);
  const first = Object.values(errors)[0];
  if (first) throw new Error(first);
  return card.number.replace(/\s/g, "").slice(-4);
}

export type PaymentResult = { reference: string; status: PaymentStatus; cardLast4?: string };

export async function topUpWallet({ amount, card }: { amount: Centimes; card: CardInput }) {
  await delay(900);
  return attempt(() => {
    const { min, max } = demoConfig.topUp;
    if (!Number.isInteger(amount) || amount < min || amount > max) {
      throw new Error(`Montant entre ${formatMAD(min)} et ${formatMAD(max)}.`);
    }
    const last4 = assertCard(card);
    const reference = createReference("RCH");
    let newBalance = 0;
    updateAccount((account) => {
      applyTransaction(account, {
        type: "recharge",
        amount,
        reference,
        description: `Recharge par carte •••• ${last4}`,
      });
      newBalance = account.wallet.balance;
      pushNotification(account, {
        title: "Portefeuille rechargé",
        body: `+ ${formatMAD(amount)} · Nouveau solde ${formatMAD(newBalance)}`,
        href: "/dispagaz/app/portefeuille",
      });
    });
    return { reference, amount, newBalance, cardLast4: last4 };
  });
}

export async function payByCard({ card }: { amount: Centimes; card: CardInput }) {
  await delay(900);
  return attempt<PaymentResult>(() => {
    const cardLast4 = assertCard(card);
    return { reference: createReference("PAY"), status: "paid", cardLast4 };
  });
}

export async function payFromWallet({
  amount,
  orderId,
  description,
}: {
  amount: Centimes;
  orderId: string;
  description: string;
}) {
  await delay();
  return attempt<PaymentResult>(() => {
    if (readAccount().wallet.balance < amount) throw new Error("Solde insuffisant");
    const reference = createReference("WAL");
    updateAccount((account) => {
      applyTransaction(account, {
        type: "commande",
        amount: -amount,
        reference,
        description,
        orderId,
      });
    });
    return { reference, status: "paid" };
  });
}

/** Cash on delivery: nothing is charged now. */
export async function createCODPayment(_: { amount: Centimes }) {
  await delay(300);
  return attempt<PaymentResult>(() => ({
    reference: createReference("COD"),
    status: "to_collect",
  }));
}

/** "Payer par carte au terminal": the bottle is reserved, payment happens at the distributor. */
export async function createTerminalPaymentReservation(_: { amount: Centimes }) {
  await delay(300);
  return attempt<PaymentResult>(() => ({
    reference: createReference("TRM"),
    status: "to_pay_at_terminal",
  }));
}
