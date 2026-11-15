"use client";

import { Input } from "@/components/app/Field";
import type { CardErrors, CardInput } from "@/services/paymentService";

export const emptyCard: CardInput = { holder: "", number: "", expiry: "", cvv: "" };

const formatNumber = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/** Demo card form — validated structurally, never sent anywhere. */
export function CardForm({
  value,
  onChange,
  errors = {},
}: {
  value: CardInput;
  onChange: (next: CardInput) => void;
  errors?: CardErrors;
}) {
  return (
    <div className="space-y-4">
      <Input
        label="Nom du titulaire"
        autoComplete="cc-name"
        value={value.holder}
        onChange={(e) => onChange({ ...value, holder: e.target.value })}
        error={errors.holder}
      />
      <Input
        label="Numéro de carte"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="4242 4242 4242 4242"
        value={value.number}
        onChange={(e) => onChange({ ...value, number: formatNumber(e.target.value) })}
        error={errors.number}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiration"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/AA"
          value={value.expiry}
          onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
          error={errors.expiry}
        />
        <Input
          label="CVV"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="123"
          maxLength={4}
          value={value.cvv}
          onChange={(e) =>
            onChange({ ...value, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
          }
          error={errors.cvv}
        />
      </div>
      <p className="rounded-[12px] bg-dz-surface px-4 py-3 text-sm text-dz-muted">
        Paiement de démonstration : aucune donnée bancaire n’est transmise ni enregistrée. Toute
        carte au format valide est acceptée.
      </p>
    </div>
  );
}
