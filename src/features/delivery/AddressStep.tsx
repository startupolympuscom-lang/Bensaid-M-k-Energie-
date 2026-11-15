"use client";

import { useState } from "react";
import { Button } from "@/components/app/Button";
import { SegmentedControl, Toggle } from "@/components/app/Field";
import { AddressCard } from "@/features/profile/AddressCard";
import { AddressForm, emptyAddress } from "@/features/profile/AddressForm";
import { updateDraft } from "@/services/orderService";
import { cleanAddress, validateAddress, type AddressErrors } from "@/services/profileService";
import type { Account, AddressInput, OrderDraft } from "@/types/dispagaz";

/** Delivery address: a saved address, or a new one (optionally saved). */
export function AddressStep({
  account,
  draft,
  onContinue,
}: {
  account: Account;
  draft: OrderDraft;
  onContinue: () => void;
}) {
  const saved = [...account.addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  const [mode, setMode] = useState<"saved" | "new">(
    saved.length && !draft.newAddress ? "saved" : "new",
  );
  const [value, setValue] = useState<AddressInput>(
    draft.newAddress ?? emptyAddress(account.profile?.phone ?? ""),
  );
  const [save, setSave] = useState(draft.newAddress?.saveToProfile ?? true);
  const [errors, setErrors] = useState<AddressErrors>({});

  function useNew() {
    const found = validateAddress(cleanAddress(value));
    setErrors(found);
    if (Object.keys(found).length) return;
    updateDraft({ newAddress: { ...value, saveToProfile: save }, addressId: undefined });
    onContinue();
  }

  return (
    <div>
      <h1 className="text-[1.6rem] leading-tight font-bold tracking-[-0.025em] sm:text-[1.85rem]">
        Où souhaitez-vous être livré ?
      </h1>

      {saved.length ? (
        <SegmentedControl<"saved" | "new">
          className="mt-7"
          label="Adresse de livraison"
          value={mode}
          onChange={setMode}
          options={[
            { value: "saved", label: "Adresse enregistrée" },
            { value: "new", label: "Nouvelle adresse" },
          ]}
        />
      ) : null}

      {mode === "saved" && saved.length ? (
        <ul className="dz-step-in mt-6 space-y-3">
          {saved.map((address) => (
            <li key={address.id}>
              <AddressCard
                address={address}
                selected={draft.addressId === address.id}
                actions={
                  <Button
                    className="h-11"
                    variant={draft.addressId === address.id ? "primary" : "tertiary"}
                    onClick={() => {
                      updateDraft({ addressId: address.id, newAddress: undefined });
                      onContinue();
                    }}
                  >
                    Livrer ici
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="dz-step-in mt-7">
          <AddressForm value={value} onChange={setValue} errors={errors} />
          <div className="mt-6 rounded-[16px] bg-dz-surface px-4 py-3">
            <Toggle
              checked={save}
              onChange={setSave}
              label="Enregistrer cette adresse dans mon profil"
            />
          </div>
          <Button size="lg" block className="mt-7" onClick={useNew}>
            Livrer à cette adresse
          </Button>
        </div>
      )}
    </div>
  );
}
