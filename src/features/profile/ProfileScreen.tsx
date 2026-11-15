"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/app/Button";
import { Select } from "@/components/app/Field";
import { ChevronRightIcon, LogoutIcon } from "@/components/app/Icons";
import { Modal } from "@/components/app/Overlay";
import { PageTitle } from "@/components/app/States";
import { useToast } from "@/components/app/Toast";
import { ProfileFields } from "@/features/profile/ProfileFields";
import { paymentMethodLabels } from "@/lib/dispagaz/labels";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { logout } from "@/services/authService";
import { resetDemoData } from "@/services/demoService";
import {
  updatePreferences,
  updateProfile,
  validateProfile,
  type ProfileErrors,
} from "@/services/profileService";
import type { Preferences, Profile } from "@/types/dispagaz";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-dz-line py-8 first:border-t-0 first:pt-0">
      <h2 className="mb-5 text-lg font-bold tracking-[-0.01em]">{title}</h2>
      {children}
    </section>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const { account } = useAccount();
  const [form, setForm] = useState<Profile | null>(account?.profile ?? null);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [busy, setBusy] = useState<"reset" | "logout" | null>(null);

  if (!account?.profile || !form) return null;
  const { preferences } = account;

  async function save(event: FormEvent) {
    event.preventDefault();
    const found = validateProfile(form!);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    const result = await updateProfile(form!);
    setSaving(false);
    toast(result.ok ? "Profil mis à jour." : result.error, result.ok ? "success" : "error");
  }

  async function signOut() {
    setBusy("logout");
    await logout();
    router.replace(appRoutes.login);
  }

  async function reset() {
    setBusy("reset");
    await resetDemoData();
    router.replace(appRoutes.login);
  }

  const initials =
    `${account.profile.firstName[0] ?? ""}${account.profile.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="Mon profil" />

      <div className="mb-10 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-dz-orange text-lg font-bold text-dz-ink">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">
            {account.profile.firstName} {account.profile.lastName}
          </p>
          <p className="truncate text-dz-muted">{account.profile.email}</p>
        </div>
      </div>

      <Section title="Informations personnelles">
        <form onSubmit={save} noValidate>
          <ProfileFields value={form} onChange={setForm} errors={errors} />
          <Button type="submit" className="mt-7" loading={saving} loadingLabel="Enregistrement…">
            Enregistrer
          </Button>
        </form>
      </Section>

      <Section title="Adresses">
        <Link
          href={appRoutes.addresses}
          className="flex items-center justify-between rounded-[18px] border border-dz-line px-5 py-4 hover:border-dz-ink/25"
        >
          <span>
            <span className="block font-medium">Mes adresses</span>
            <span className="text-sm text-dz-muted">
              {account.addresses.length} adresse{account.addresses.length > 1 ? "s" : ""}{" "}
              enregistrée
              {account.addresses.length > 1 ? "s" : ""}
            </span>
          </span>
          <ChevronRightIcon className="text-dz-subtle" />
        </Link>
      </Section>

      <Section title="Préférences de paiement">
        <Select
          label="Moyen de paiement par défaut"
          value={preferences.defaultPaymentMethod}
          onChange={async (e) => {
            const r = await updatePreferences({
              defaultPaymentMethod: e.target.value as Preferences["defaultPaymentMethod"],
            });
            toast(r.ok ? "Préférence enregistrée." : r.error, r.ok ? "success" : "error");
          }}
          options={(["wallet", "card", "cod"] as const).map((m) => ({
            value: m,
            label: paymentMethodLabels[m],
          }))}
        />
      </Section>

      <Section title="Application mobile">
        <p className="text-[0.9375rem] text-dz-muted">
          L’application Dispagaz arrive bientôt sur l’App Store et Google Play. En attendant, cette
          version web vous offre toutes les fonctionnalités.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["App Store", "Google Play"].map((store) => (
            <span
              key={store}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-dz-gray px-4 text-sm font-medium"
            >
              {store} <span className="text-dz-muted">· Bientôt</span>
            </span>
          ))}
        </div>
      </Section>

      <Section title="Démonstration">
        <p className="mb-4 text-[0.9375rem] text-dz-muted">
          Les données de cette démo sont enregistrées uniquement dans ce navigateur.
        </p>
        <Button variant="tertiary" onClick={() => setResetOpen(true)}>
          Réinitialiser les données de démonstration
        </Button>
      </Section>

      <div className="border-t border-dz-line pt-8">
        <Button
          variant="danger"
          onClick={signOut}
          loading={busy === "logout"}
          loadingLabel="Déconnexion…"
        >
          <LogoutIcon width={20} height={20} />
          Se déconnecter
        </Button>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Réinitialiser la démo ?"
        description="Comptes, commandes, portefeuille et adresses de ce navigateur seront effacés."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={reset}
              loading={busy === "reset"}
              loadingLabel="Réinitialisation…"
            >
              Réinitialiser
            </Button>
            <Button variant="tertiary" onClick={() => setResetOpen(false)}>
              Annuler
            </Button>
          </>
        }
      >
        <p className="text-[0.9375rem] text-dz-muted">
          Vous serez redirigé vers l’écran de connexion.
        </p>
      </Modal>
    </div>
  );
}
