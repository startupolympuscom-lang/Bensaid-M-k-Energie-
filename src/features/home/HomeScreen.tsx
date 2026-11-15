"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/app/Button";
import { ChoicePanel } from "@/components/app/ChoicePanel";
import { ChevronRightIcon, StationIcon, TruckIcon } from "@/components/app/Icons";
import { openingLabel } from "@/features/distributors/DistributorCard";
import { orderProductLine, StatusPill } from "@/features/orders/OrderBits";
import { WalletCard } from "@/features/wallet/WalletCard";
import { isOrderActive } from "@/lib/dispagaz/labels";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { isPickupPossible, selectDistributors } from "@/services/distributorService";
import { startOrder } from "@/services/orderService";
import type { Fulfillment } from "@/types/dispagaz";

const km = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

export function HomeScreen() {
  const router = useRouter();
  const { account, db } = useAccount();
  if (!account?.profile || !db) return null;

  const active = [...account.orders]
    .filter(isOrderActive)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const nearest = selectDistributors(db).find(isPickupPossible);

  const order = (fulfillment: Fulfillment) => {
    startOrder({ fulfillment });
    router.push(appRoutes.order);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.03em] sm:text-[2.25rem]">
        Bonjour, {account.profile.firstName}
      </h1>
      <p className="mt-1.5 text-dz-muted">Comment pouvons-nous vous aider aujourd’hui ?</p>

      <WalletCard
        className="mt-8"
        balance={account.wallet.balance}
        action={
          <ButtonLink href={appRoutes.topUp} className="h-11">
            Recharger
          </ButtonLink>
        }
      />

      <section aria-labelledby="commander" className="mt-12">
        <h2 id="commander" className="text-xl font-bold tracking-[-0.02em]">
          Commander du GPL
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ChoicePanel
            title="Livraison à domicile"
            description="Recevez votre bouteille directement chez vous."
            icon={<TruckIcon />}
            onClick={() => order("delivery")}
          />
          <ChoicePanel
            title="Retrait dans un point Dispagaz"
            description="Distributeurs automatiques disponibles 24/7."
            icon={<StationIcon />}
            onClick={() => order("pickup")}
          />
        </div>
      </section>

      {active ? (
        <section aria-labelledby="en-cours" className="mt-12">
          <h2 id="en-cours" className="text-xl font-bold tracking-[-0.02em]">
            Commande en cours
          </h2>
          <Link
            href={appRoutes.orderDetail(active.id)}
            className="group mt-4 flex items-center gap-4 rounded-[18px] border border-dz-line p-5 hover:border-dz-ink/25"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-bold">{active.number}</p>
                <StatusPill status={active.status} />
              </div>
              <p className="mt-1.5 truncate text-[0.9375rem] text-dz-muted">
                {orderProductLine(active)}
              </p>
            </div>
            <ChevronRightIcon className="shrink-0 text-dz-subtle transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      ) : null}

      {nearest ? (
        <section aria-labelledby="proche" className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="proche" className="text-xl font-bold tracking-[-0.02em]">
              Point Dispagaz le plus proche
            </h2>
            <Link
              href={appRoutes.points}
              className="shrink-0 text-sm font-medium text-dz-orange-ink hover:underline"
            >
              Tous les points
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-[18px] bg-dz-surface p-5">
            <div className="min-w-0">
              <p className="font-bold">{nearest.name}</p>
              <p className="text-sm text-dz-muted">
                {km.format(nearest.distanceKm)} km ·{" "}
                <span className="text-dz-teal">{openingLabel(nearest)}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                startOrder({ fulfillment: "pickup", distributorId: nearest.id });
                router.push(appRoutes.order);
              }}
              className="h-11 shrink-0 rounded-[14px] bg-white px-4 text-[0.9375rem] font-medium hover:bg-dz-gray"
            >
              Commander ici
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
