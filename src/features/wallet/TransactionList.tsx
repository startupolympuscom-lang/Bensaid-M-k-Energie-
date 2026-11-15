import { formatDateTime, formatSignedMAD } from "@/lib/dispagaz/format";
import { transactionTypeLabels } from "@/lib/dispagaz/labels";
import type { WalletTransaction } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

export function TransactionList({ transactions }: { transactions: WalletTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-[18px] bg-dz-surface px-5 py-8 text-center text-dz-muted">
        Aucune opération pour le moment.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-dz-line">
      {transactions.map((tx) => (
        <li key={tx.id} className="flex items-start justify-between gap-4 py-4">
          <div className="min-w-0">
            <p className="font-medium">{transactionTypeLabels[tx.type]}</p>
            <p className="truncate text-sm text-dz-muted">{tx.description}</p>
            <p className="mt-0.5 text-xs text-dz-subtle">
              {formatDateTime(tx.createdAt)} · {tx.reference}
            </p>
          </div>
          <p
            className={cn(
              "shrink-0 text-right font-bold tabular-nums",
              tx.amount > 0 ? "text-dz-teal" : "text-dz-ink",
            )}
          >
            {formatSignedMAD(tx.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
}
