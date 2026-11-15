"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/app/Button";
import { Input } from "@/components/app/Field";
import { DetailList, SuccessState } from "@/components/app/States";
import { CardForm, emptyCard } from "@/features/wallet/CardForm";
import { demoConfig } from "@/data/config";
import { formatMAD, parseMADInput } from "@/lib/dispagaz/format";
import { topUpWallet, validateCard, type CardErrors } from "@/services/paymentService";
import type { Centimes } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

type Success = { amount: Centimes; newBalance: Centimes; reference: string };

/** Wallet top-up: amount → demo card → success. */
export function TopUpFlow({
  onDone,
  doneLabel = "Retour au portefeuille",
  initialAmount = demoConfig.topUp.quickAmounts[1],
}: {
  onDone: () => void;
  doneLabel?: string;
  initialAmount?: Centimes;
}) {
  const { quickAmounts, min, max } = demoConfig.topUp;
  const [amount, setAmount] = useState<Centimes>(initialAmount);
  const [custom, setCustom] = useState("");
  const [amountError, setAmountError] = useState("");
  const [card, setCard] = useState(emptyCard);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<Success | null>(null);

  const effective = custom ? parseMADInput(custom) : amount;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    let valid = true;
    if (!Number.isFinite(effective) || effective < min || effective > max) {
      setAmountError(`Choisissez un montant entre ${formatMAD(min)} et ${formatMAD(max)}.`);
      valid = false;
    } else setAmountError("");
    const errors = validateCard(card);
    setCardErrors(errors);
    if (Object.keys(errors).length) valid = false;
    if (!valid) return;

    setPending(true);
    const result = await topUpWallet({ amount: effective, card });
    setPending(false);
    if (!result.ok) return setFormError(result.error);
    setSuccess(result.data);
  }

  if (success) {
    return (
      <SuccessState
        title="Votre portefeuille a été rechargé."
        actions={
          <Button size="lg" block onClick={onDone}>
            {doneLabel}
          </Button>
        }
      >
        <DetailList
          rows={[
            ["Montant", formatMAD(success.amount)],
            ["Nouveau solde", formatMAD(success.newBalance)],
            ["Référence", success.reference],
          ]}
        />
      </SuccessState>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-9">
      <fieldset>
        <legend className="mb-3 font-bold">Montant</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {quickAmounts.map((value) => {
            const selected = !custom && amount === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setAmount(value);
                  setCustom("");
                  setAmountError("");
                }}
                className={cn(
                  "h-14 rounded-[14px] border text-base font-bold transition-colors",
                  selected
                    ? "border-dz-orange bg-dz-orange-tint shadow-[0_0_0_1px_var(--color-dz-orange)]"
                    : "border-dz-line bg-white hover:border-dz-ink/30",
                )}
              >
                {value / 100} MAD
              </button>
            );
          })}
        </div>
        <Input
          containerClassName="mt-4"
          label="Autre montant (MAD)"
          optional
          inputMode="decimal"
          placeholder="Ex. 150"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/[^\d.,]/g, ""))}
          error={amountError}
        />
      </fieldset>

      <fieldset>
        <legend className="mb-1 font-bold">Moyen de paiement</legend>
        <p className="mb-4 text-[0.9375rem] text-dz-muted">Carte bancaire</p>
        <CardForm value={card} onChange={setCard} errors={cardErrors} />
      </fieldset>

      {formError ? (
        <p
          role="alert"
          className="rounded-[14px] bg-dz-danger/8 px-4 py-3 text-[0.9375rem] text-dz-danger"
        >
          {formError}
        </p>
      ) : null}

      <Button type="submit" size="lg" block loading={pending} loadingLabel="Paiement en cours…">
        Recharger {Number.isFinite(effective) && effective > 0 ? formatMAD(effective) : ""}
      </Button>
    </form>
  );
}
