"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/app/Icons";
import { TopUpFlow } from "@/features/wallet/TopUpFlow";
import { formatMAD } from "@/lib/dispagaz/format";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";

export function TopUpScreen() {
  const router = useRouter();
  const { account } = useAccount();
  if (!account) return null;
  return (
    <div className="mx-auto max-w-xl">
      <Link
        href={appRoutes.wallet}
        className="-ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-3 pl-1 text-sm font-medium text-dz-muted hover:text-dz-ink"
      >
        <ChevronLeftIcon width={20} height={20} /> Portefeuille
      </Link>
      <h1 className="mt-3 text-[1.75rem] leading-tight font-bold tracking-[-0.025em] lg:text-[2rem]">
        Recharger mon portefeuille
      </h1>
      <p className="mt-1.5 mb-9 text-dz-muted">
        Solde actuel : {formatMAD(account.wallet.balance)}
      </p>
      <TopUpFlow onDone={() => router.push(appRoutes.wallet)} />
    </div>
  );
}
