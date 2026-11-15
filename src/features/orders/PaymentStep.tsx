"use client";

import { useState } from "react";
import { Button } from "@/components/app/Button";
import { Modal } from "@/components/app/Overlay";
import { CardForm, emptyCard } from "@/features/wallet/CardForm";
import { TopUpFlow } from "@/features/wallet/TopUpFlow";
import { TotalsRows } from "@/features/orders/ProductStep";
import { formatMAD } from "@/lib/dispagaz/format";
import { addressLine, cityLine, paymentMethodLabels } from "@/lib/dispagaz/labels";
import {
  computeTotals,
  draftAddress,
  paymentMethodsFor,
  placeOrder,
  updateDraft,
} from "@/services/orderService";
import { validateCard, type CardErrors } from "@/services/paymentService";
import { selectProduct } from "@/services/productService";
import type { Account, Distributor, Order, OrderDraft, PaymentMethod } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

const descriptions: Record<PaymentMethod, string> = {
  wallet: "Payez instantanément avec votre solde.",
  card: "Paiement sécurisé par carte bancaire.",
  cod: "Espèces à la livraison, à remettre au livreur.",
  terminal: "Votre bouteille est réservée ; vous payez par carte sur le terminal du distributeur.",
};

const pickupLabels: Partial<Record<PaymentMethod, string>> = {
  card: "Carte bancaire en ligne",
  terminal: "Payer par carte au terminal",
};

/** Radio group of payment methods (wallet / card / COD / terminal). */
export function PaymentMethodSelector({
  methods,
  value,
  onChange,
  balance,
  total,
  onTopUp,
  fulfillment,
}: {
  methods: PaymentMethod[];
  value?: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  balance: number;
  total: number;
  onTopUp: () => void;
  fulfillment: OrderDraft["fulfillment"];
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-lg font-bold tracking-[-0.01em]">Paiement</legend>
      <div className="space-y-3">
        {methods.map((m) => {
          const selected = value === m;
          const insufficient = m === "wallet" && balance < total;
          const label = (fulfillment === "pickup" && pickupLabels[m]) || paymentMethodLabels[m];
          return (
            <label
              key={m}
              className={cn(
                "block cursor-pointer rounded-[18px] border bg-white p-5 transition-[border-color,box-shadow] has-focus-visible:outline-2 has-focus-visible:outline-dz-orange-strong",
                selected
                  ? "border-dz-orange shadow-[0_0_0_1px_var(--color-dz-orange)]"
                  : "border-dz-line hover:border-dz-ink/25",
              )}
            >
              <span className="flex items-start gap-4">
                <input
                  type="radio"
                  name="payment"
                  value={m}
                  checked={selected}
                  onChange={() => onChange(m)}
                  className="mt-1 h-5 w-5 shrink-0 accent-dz-orange"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-bold">{label}</span>
                    {m === "wallet" ? (
                      <span className="text-sm text-dz-muted tabular-nums">
                        Solde : {formatMAD(balance)}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[0.9375rem] text-dz-muted">
                    {descriptions[m]}
                  </span>
                  {insufficient ? (
                    <span className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-dz-danger">Solde insuffisant</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onTopUp();
                        }}
                        className="text-sm font-medium text-dz-ink underline decoration-dz-orange decoration-2 underline-offset-4"
                      >
                        Recharger mon portefeuille
                      </button>
                    </span>
                  ) : null}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function PaymentStep({
  account,
  draft,
  distributor,
  onPlaced,
}: {
  account: Account;
  draft: OrderDraft;
  distributor?: Distributor;
  onPlaced: (order: Order) => void;
}) {
  const product = selectProduct(draft.productId);
  const totals = computeTotals(draft);
  const methods = draft.fulfillment ? paymentMethodsFor[draft.fulfillment] : [];
  const preferred = methods.includes(account.preferences.defaultPaymentMethod)
    ? account.preferences.defaultPaymentMethod
    : methods[0];
  const method =
    draft.paymentMethod && methods.includes(draft.paymentMethod) ? draft.paymentMethod : preferred;
  const [card, setCard] = useState(emptyCard);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  if (!product || !totals || !draft.fulfillment) return null;
  const address = draft.fulfillment === "delivery" ? draftAddress(account, draft) : undefined;
  const insufficient = method === "wallet" && account.wallet.balance < totals.total;

  async function confirm() {
    setError("");
    if (method === "card") {
      const found = validateCard(card);
      setCardErrors(found);
      if (Object.keys(found).length) return;
    }
    if (insufficient)
      return setError(
        "Solde insuffisant. Rechargez votre portefeuille ou choisissez un autre moyen de paiement.",
      );
    if (draft.paymentMethod !== method) updateDraft({ paymentMethod: method });
    setPending(true);
    const result = await placeOrder({ card: method === "card" ? card : undefined });
    setPending(false);
    if (!result.ok) return setError(result.error);
    onPlaced(result.data);
  }

  const cta =
    method === "wallet"
      ? `Payer ${formatMAD(totals.total)}`
      : method === "card"
        ? `Payer ${formatMAD(totals.total)} par carte`
        : method === "cod"
          ? "Confirmer la commande"
          : "Réserver ma bouteille";

  return (
    <div className="pb-24 lg:pb-0">
      <h1 className="text-[1.6rem] leading-tight font-bold tracking-[-0.025em] sm:text-[1.85rem]">
        Récapitulatif
      </h1>

      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <section
          aria-label="Récapitulatif de la commande"
          className="rounded-[20px] border border-dz-line p-5 sm:p-6"
        >
          <dl className="space-y-3 text-[0.9375rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-dz-muted">Produit</dt>
              <dd className="text-right font-medium">{product.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dz-muted">Marque</dt>
              <dd className="text-right">{product.brand}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dz-muted">Taille</dt>
              <dd className="text-right">{product.size}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dz-muted">
                {draft.fulfillment === "delivery" ? "Livraison" : "Point Dispagaz"}
              </dt>
              <dd className="max-w-[60%] text-right">
                {address ? (
                  <>
                    <span className="block font-medium">{address.label}</span>
                    <span className="block text-dz-muted">{addressLine(address)}</span>
                    <span className="block text-dz-muted">{cityLine(address)}</span>
                  </>
                ) : distributor ? (
                  <>
                    <span className="block font-medium">{distributor.name}</span>
                    <span className="block text-dz-muted">{distributor.address}</span>
                  </>
                ) : null}
              </dd>
            </div>
          </dl>
          <div className="my-5 h-px bg-dz-line" />
          <TotalsRows draft={draft} />
          <p className="mt-5 text-sm text-dz-muted">
            {draft.fulfillment === "delivery"
              ? "Statut de livraison : communiqué après confirmation de votre commande."
              : "Votre bouteille est réservée dès la confirmation, avec un code de retrait."}
          </p>
        </section>

        <div className="space-y-6">
          <PaymentMethodSelector
            methods={methods}
            value={method}
            onChange={(m) => updateDraft({ paymentMethod: m })}
            balance={account.wallet.balance}
            total={totals.total}
            onTopUp={() => setTopUpOpen(true)}
            fulfillment={draft.fulfillment}
          />
          {method === "card" ? (
            <div className="dz-step-in">
              <CardForm value={card} onChange={setCard} errors={cardErrors} />
            </div>
          ) : null}
          {error ? (
            <p
              role="alert"
              className="rounded-[14px] bg-dz-danger/8 px-4 py-3 text-[0.9375rem] text-dz-danger"
            >
              {error}
            </p>
          ) : null}
          {/* Mobile: always-visible order CTA above the bottom navigation. */}
          <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] z-30 border-t border-dz-line bg-white/95 px-5 py-3 backdrop-blur-xl sm:px-8 lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <Button
              size="lg"
              block
              onClick={confirm}
              loading={pending}
              loadingLabel="Traitement en cours…"
              disabled={insufficient}
            >
              {cta}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        title="Recharger mon portefeuille"
        className="max-w-lg"
      >
        <TopUpFlow
          onDone={() => setTopUpOpen(false)}
          doneLabel="Continuer ma commande"
          initialAmount={Math.max(
            10000,
            Math.ceil((totals.total - account.wallet.balance) / 10000) * 10000,
          )}
        />
      </Modal>
    </div>
  );
}
