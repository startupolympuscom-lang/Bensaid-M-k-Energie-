import { createId, formatMAD } from "@/lib/dispagaz/format";
import type { Account, Centimes, TransactionType, WalletTransaction } from "@/types/dispagaz";
import { attempt, delay, readAccount, updateAccount } from "@/services/storage";

/**
 * Dispagaz Wallet (demo ledger). Amounts are integers in centimes.
 * Later: a real wallet / payment-gateway ledger on the backend.
 */

/** Records a transaction inside an ongoing account update. */
export function applyTransaction(
  account: Account,
  tx: {
    type: TransactionType;
    amount: Centimes;
    description: string;
    reference: string;
    orderId?: string;
    createdAt?: string;
  },
): WalletTransaction {
  const balanceAfter = account.wallet.balance + tx.amount;
  if (balanceAfter < 0) throw new Error("Solde insuffisant");
  const transaction: WalletTransaction = {
    id: createId("txn"),
    createdAt: tx.createdAt ?? new Date().toISOString(),
    balanceAfter,
    ...tx,
  };
  account.wallet.balance = balanceAfter;
  account.wallet.transactions.unshift(transaction);
  return transaction;
}

export async function getBalance() {
  return attempt(() => readAccount().wallet.balance);
}

export async function getTransactions() {
  return attempt(() => readAccount().wallet.transactions);
}

export async function topUp(amount: Centimes, reference: string) {
  await delay();
  return attempt(() => {
    let tx: WalletTransaction | undefined;
    updateAccount((account) => {
      tx = applyTransaction(account, {
        type: "recharge",
        amount,
        reference,
        description: "Recharge par carte bancaire",
      });
    });
    return tx!;
  });
}

export async function debit(
  amount: Centimes,
  details: { reference: string; description: string; orderId?: string },
) {
  return attempt(() => {
    let tx: WalletTransaction | undefined;
    updateAccount((account) => {
      if (account.wallet.balance < amount) {
        throw new Error(`Solde insuffisant (${formatMAD(account.wallet.balance)} disponibles).`);
      }
      tx = applyTransaction(account, { type: "commande", amount: -amount, ...details });
    });
    return tx!;
  });
}

export async function refund(
  amount: Centimes,
  details: { reference: string; description: string; orderId?: string },
) {
  return attempt(() => {
    let tx: WalletTransaction | undefined;
    updateAccount((account) => {
      tx = applyTransaction(account, { type: "remboursement", amount, ...details });
    });
    return tx!;
  });
}
