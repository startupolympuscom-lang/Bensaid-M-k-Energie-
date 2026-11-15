"use client";

import { Input, SegmentedControl } from "@/components/app/Field";
import { languageLabels } from "@/lib/dispagaz/labels";
import type { ProfileErrors } from "@/services/profileService";
import type { Language, Profile } from "@/types/dispagaz";

export function ProfileFields({
  value,
  onChange,
  errors = {},
}: {
  value: Profile;
  onChange: (next: Profile) => void;
  errors?: ProfileErrors;
}) {
  const set = <K extends keyof Profile>(key: K, v: Profile[K]) => onChange({ ...value, [key]: v });
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Prénom"
          autoComplete="given-name"
          value={value.firstName}
          onChange={(e) => set("firstName", e.target.value)}
          error={errors.firstName}
        />
        <Input
          label="Nom"
          autoComplete="family-name"
          value={value.lastName}
          onChange={(e) => set("lastName", e.target.value)}
          error={errors.lastName}
        />
      </div>
      <Input
        label="Téléphone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="06 12 34 56 78"
        value={value.phone}
        onChange={(e) => set("phone", e.target.value)}
        error={errors.phone}
      />
      <Input
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={value.email}
        onChange={(e) => set("email", e.target.value)}
        error={errors.email}
      />
      <Input
        label="Date de naissance"
        optional
        type="date"
        autoComplete="bday"
        value={value.birthDate ?? ""}
        onChange={(e) => set("birthDate", e.target.value || undefined)}
        error={errors.birthDate}
      />
      <div>
        <p className="mb-2 text-sm font-medium" id="language-label">
          Langue préférée
        </p>
        <SegmentedControl<Language>
          label="Langue préférée"
          value={value.language}
          onChange={(v) => set("language", v)}
          options={(Object.keys(languageLabels) as Language[]).map((k) => ({
            value: k,
            label: languageLabels[k],
          }))}
        />
        <p className="mt-2 text-sm text-dz-subtle">
          L’interface en arabe et en anglais arrive bientôt.
        </p>
      </div>
    </div>
  );
}
