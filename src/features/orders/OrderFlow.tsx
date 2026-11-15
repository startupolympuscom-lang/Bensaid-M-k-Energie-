"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChoicePanel } from "@/components/app/ChoicePanel";
import { ChevronLeftIcon, StationIcon, TruckIcon } from "@/components/app/Icons";
import { LoadingState } from "@/components/app/States";
import { AddressStep } from "@/features/delivery/AddressStep";
import { DistributorPicker } from "@/features/distributors/DistributorPicker";
import { CheckoutProgress } from "@/features/orders/OrderBits";
import { PaymentStep } from "@/features/orders/PaymentStep";
import { ProductStep } from "@/features/orders/ProductStep";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { selectDistributor, selectDistributors } from "@/services/distributorService";
import { clearDraft, startOrder, updateDraft } from "@/services/orderService";
import type { Fulfillment, OrderDraft } from "@/types/dispagaz";

type StepId = "mode" | "point" | "product" | "address" | "payment";

const flows: Record<Fulfillment, StepId[]> = {
  delivery: ["mode", "product", "address", "payment"],
  pickup: ["mode", "point", "product", "payment"],
};

const stepLabels: Record<StepId, string> = {
  mode: "Mode",
  point: "Point",
  product: "Produit",
  address: "Adresse",
  payment: "Paiement",
};

/** Where to (re)start a persisted checkout. */
function resumeStep(draft: OrderDraft): StepId {
  if (!draft.fulfillment) return "mode";
  if (draft.fulfillment === "pickup") {
    if (!draft.distributorId) return "point";
    return draft.productId ? "payment" : "product";
  }
  if (!draft.productId) return "product";
  return draft.addressId || draft.newAddress ? "payment" : "address";
}

/**
 * Progressive checkout:
 * Commander → Livraison | Point Dispagaz → Produit → Adresse | Point → Paiement → Confirmation.
 * The draft is persisted, so a refresh never loses the order in progress.
 */
export function OrderFlow() {
  const router = useRouter();
  const { account, db } = useAccount();
  const draft = account?.draft ?? null;
  const [stepState, setStepState] = useState<{ key: string; step: StepId } | null>(null);

  // A checkout always has a draft.
  useEffect(() => {
    if (account && !account.draft) startOrder();
  }, [account]);

  if (!account || !db || !draft) return <LoadingState />;

  const step = stepState && stepState.key === draft.startedAt ? stepState.step : resumeStep(draft);
  const flow = flows[draft.fulfillment ?? "delivery"];
  const index = flow.indexOf(step);
  const distributor = selectDistributor(db, draft.distributorId);

  const go = (next: StepId) => {
    setStepState({ key: draft.startedAt, step: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const nextOf = (current: StepId, fulfillment = draft.fulfillment) => {
    const f = flows[fulfillment ?? "delivery"];
    return f[f.indexOf(current) + 1];
  };

  function chooseMode(fulfillment: Fulfillment) {
    if (fulfillment !== draft!.fulfillment) {
      updateDraft({
        fulfillment,
        productId: undefined,
        distributorId: undefined,
        paymentMethod: undefined,
      });
    }
    go(nextOf("mode", fulfillment));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (index > 0 ? go(flow[index - 1]) : router.push(appRoutes.home))}
            className="-ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-3 pl-1 text-sm font-medium text-dz-muted hover:text-dz-ink"
          >
            <ChevronLeftIcon width={20} height={20} /> Retour
          </button>
          {draft.fulfillment ? (
            <button
              type="button"
              onClick={() => {
                clearDraft();
                router.push(appRoutes.home);
              }}
              className="h-10 rounded-full px-3 text-sm font-medium text-dz-muted hover:text-dz-ink"
            >
              Annuler
            </button>
          ) : null}
        </div>
        <CheckoutProgress steps={flow.map((s) => stepLabels[s])} current={Math.max(0, index)} />
      </div>

      <div key={step} className="dz-step-in">
        {step === "mode" ? (
          <div>
            <h1 className="text-[1.6rem] leading-tight font-bold tracking-[-0.025em] sm:text-[1.85rem]">
              Comment souhaitez-vous recevoir votre bouteille ?
            </h1>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ChoicePanel
                title="Livraison à domicile"
                description="Recevez votre bouteille directement chez vous."
                icon={<TruckIcon />}
                selected={draft.fulfillment === "delivery"}
                onClick={() => chooseMode("delivery")}
              />
              <ChoicePanel
                title="Point Dispagaz"
                description="Retirez votre bouteille dans un distributeur automatique disponible 24/7."
                icon={<StationIcon />}
                selected={draft.fulfillment === "pickup"}
                onClick={() => chooseMode("pickup")}
              />
            </div>
          </div>
        ) : step === "point" ? (
          <div>
            <h1 className="mb-7 text-[1.6rem] leading-tight font-bold tracking-[-0.025em] sm:text-[1.85rem]">
              Choisissez un point Dispagaz
            </h1>
            <DistributorPicker
              distributors={selectDistributors(db)}
              initialSelectedId={draft.distributorId}
              onChoose={(id) => {
                const point = selectDistributor(db, id);
                const keepProduct =
                  point && draft.productId && (point.inventory[draft.productId] ?? 0) > 0;
                updateDraft({
                  distributorId: id,
                  productId: keepProduct ? draft.productId : undefined,
                });
                go("product");
              }}
            />
          </div>
        ) : step === "product" ? (
          <ProductStep
            fulfillment={draft.fulfillment ?? "delivery"}
            distributor={draft.fulfillment === "pickup" ? distributor : undefined}
            draft={draft}
            onContinue={() => go(nextOf("product"))}
          />
        ) : step === "address" ? (
          <AddressStep account={account} draft={draft} onContinue={() => go("payment")} />
        ) : (
          <PaymentStep
            account={account}
            draft={draft}
            distributor={distributor}
            onPlaced={() => router.push(`${appRoutes.order}/confirmation`)}
          />
        )}
      </div>
    </div>
  );
}
