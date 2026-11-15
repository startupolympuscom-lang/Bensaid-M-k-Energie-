"use client";

import { Input, SegmentedControl, Textarea } from "@/components/app/Field";
import { PinIcon } from "@/components/app/Icons";
import { propertyTypeLabels } from "@/lib/dispagaz/labels";
import type { AddressErrors } from "@/services/profileService";
import type { AddressInput, PropertyType } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

const labelSuggestions = ["Maison", "Bureau", "Parents", "Résidence secondaire"];

export function emptyAddress(phone = ""): AddressInput {
  return {
    label: "Maison",
    city: "",
    district: "",
    street: "",
    directions: "",
    phone,
    propertyType: "appartement",
    deliveryInstructions: "",
    position: null,
  };
}

/**
 * Address form with property-type–aware fields:
 * Appartement → residence, building, floor*, apartment*, intercom;
 * Maison → house number*; Villa → villa number*, residence/compound.
 */
export function AddressForm({
  value,
  onChange,
  errors = {},
}: {
  value: AddressInput;
  onChange: (next: AddressInput) => void;
  errors?: AddressErrors;
}) {
  const set = <K extends keyof AddressInput>(key: K, v: AddressInput[K]) =>
    onChange({ ...value, [key]: v });
  const text = (key: keyof AddressInput) =>
    typeof value[key] === "string" ? (value[key] as string) : "";

  return (
    <div className="space-y-5">
      <div>
        <Input
          label="Nom de l’adresse"
          value={value.label}
          onChange={(e) => set("label", e.target.value)}
          error={errors.label}
          autoComplete="off"
        />
        <div className="mt-2.5 flex flex-wrap gap-2">
          {labelSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("label", s)}
              aria-pressed={value.label === s}
              className={cn(
                "h-9 rounded-full border px-3.5 text-sm transition-colors",
                value.label === s
                  ? "border-dz-ink bg-dz-ink text-white"
                  : "border-dz-line text-dz-muted hover:border-dz-ink/30 hover:text-dz-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Ville"
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          error={errors.city}
          autoComplete="address-level2"
          placeholder="Meknès"
        />
        <Input
          label="Quartier"
          value={value.district}
          onChange={(e) => set("district", e.target.value)}
          error={errors.district}
          autoComplete="address-level3"
        />
      </div>

      <Input
        label="Rue / adresse"
        value={value.street}
        onChange={(e) => set("street", e.target.value)}
        error={errors.street}
        autoComplete="address-line1"
      />

      <Input
        label="Indications complémentaires"
        optional
        value={text("directions")}
        onChange={(e) => set("directions", e.target.value)}
        placeholder="Près de la mosquée, portail vert…"
      />

      <div className="flex items-center gap-3 rounded-[14px] border border-dashed border-dz-field/70 bg-dz-surface px-4 py-3.5 text-sm text-dz-muted">
        <PinIcon width={20} height={20} className="shrink-0 text-dz-subtle" />
        <span>Position sur la carte — la localisation précise sera bientôt disponible.</span>
      </div>

      <SegmentedControl<PropertyType>
        label="Type de logement"
        value={value.propertyType}
        onChange={(v) => set("propertyType", v)}
        options={(Object.keys(propertyTypeLabels) as PropertyType[]).map((k) => ({
          value: k,
          label: propertyTypeLabels[k],
        }))}
      />

      {value.propertyType === "appartement" ? (
        <div key="appartement" className="dz-step-in space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Résidence / immeuble"
              optional
              value={text("buildingName")}
              onChange={(e) => set("buildingName", e.target.value)}
              placeholder="Résidence Atlas"
            />
            <Input
              label="Bâtiment"
              optional
              value={text("buildingNumber")}
              onChange={(e) => set("buildingNumber", e.target.value)}
              placeholder="B"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Étage"
              value={text("floor")}
              onChange={(e) => set("floor", e.target.value)}
              error={errors.floor}
              inputMode="numeric"
              placeholder="4"
            />
            <Input
              label="N° d’appartement"
              value={text("apartmentNumber")}
              onChange={(e) => set("apartmentNumber", e.target.value)}
              error={errors.apartmentNumber}
              placeholder="12"
            />
          </div>
          <Input
            label="Porte / interphone"
            optional
            value={text("intercom")}
            onChange={(e) => set("intercom", e.target.value)}
          />
        </div>
      ) : value.propertyType === "maison" ? (
        <div key="maison" className="dz-step-in">
          <Input
            label="Numéro de la maison"
            value={text("houseNumber")}
            onChange={(e) => set("houseNumber", e.target.value)}
            error={errors.houseNumber}
          />
        </div>
      ) : (
        <div key="villa" className="dz-step-in grid gap-5 sm:grid-cols-2">
          <Input
            label="Numéro de la villa"
            value={text("villaNumber")}
            onChange={(e) => set("villaNumber", e.target.value)}
            error={errors.villaNumber}
          />
          <Input
            label="Résidence / lotissement"
            optional
            value={text("compound")}
            onChange={(e) => set("compound", e.target.value)}
          />
        </div>
      )}

      <Textarea
        label="Instructions de livraison"
        optional
        value={text("deliveryInstructions")}
        onChange={(e) => set("deliveryInstructions", e.target.value)}
        placeholder="Appeler en arrivant, laisser au gardien…"
      />

      <Input
        label="Téléphone pour la livraison"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value.phone}
        onChange={(e) => set("phone", e.target.value)}
        error={errors.phone}
        placeholder="06 12 34 56 78"
      />
    </div>
  );
}
