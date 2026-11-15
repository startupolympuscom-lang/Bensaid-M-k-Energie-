"use client";

import { ButtonLink } from "@/components/app/Button";
import { PageTitle } from "@/components/app/States";
import { TransactionList } from "@/features/wallet/TransactionList";
import { WalletCard } from "@/features/wallet/WalletCard";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";

export function WalletScreen() {
  const { account } = useAccount();
  if (!account) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="Portefeuille" subtitle="Payez vos commandes en un geste." />
      <WalletCard balance={account.wallet.balance} />
      <ButtonLink href={appRoutes.topUp} size="lg" block className="mt-4">
        Recharger mon portefeuille
      </ButtonLink>
      <section aria-labelledby="historique" className="mt-12">
        <h2 id="historique" className="text-lg font-bold tracking-[-0.01em]">
          Historique
        </h2>
        <div className="mt-2">
          <TransactionList transactions={account.wallet.transactions} />
        </div>
      </section>
    </div>
  );
}
