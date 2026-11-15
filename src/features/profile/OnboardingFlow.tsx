"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AppLogo } from "@/components/app/AppLogo";
import { Button } from "@/components/app/Button";
import { ChevronLeftIcon } from "@/components/app/Icons";
import { LoadingState } from "@/components/app/States";
import { useToast } from "@/components/app/Toast";
import { AddressForm, emptyAddress } from "@/features/profile/AddressForm";
import { ProfileFields } from "@/features/profile/ProfileFields";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { onboardingDefaults } from "@/services/authService";
import {
  cleanAddress,
  completeOnboarding,
  validateAddress,
  validateProfile,
  type AddressErrors,
  type ProfileErrors,
} from "@/services/profileService";
import type { AddressInput, Profile } from "@/types/dispagaz";

/** First-time onboarding: profile, then primary address. */
export function OnboardingFlow() {
  const router = useRouter();
  const toast = useToast();
  const { ready, session, account } = useAccount();
  const [step, setStep] = useState<1 | 2>(1);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [address, setAddress] = useState<AddressInput>(emptyAddress());
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const mustLogin = ready && (!session || !account);
  const alreadyDone = ready && !!account?.profile;

  useEffect(() => {
    if (mustLogin) router.replace(appRoutes.login);
    else if (alreadyDone) router.replace(appRoutes.home);
  }, [mustLogin, alreadyDone, router]);

  // Pre-fill once the local session is available.
  const [prefilled, setPrefilled] = useState(false);
  if (ready && session && !prefilled) {
    setPrefilled(true);
    const defaults = onboardingDefaults();
    setProfile({ ...defaults, phone: "", language: "fr" });
  }

  if (!ready || mustLogin || alreadyDone || !profile) return <LoadingState className="min-h-dvh" />;

  function next(event: FormEvent) {
    event.preventDefault();
    const errors = validateProfile(profile!);
    setProfileErrors(errors);
    if (Object.keys(errors).length) return;
    setAddress((a) => ({ ...a, phone: a.phone || profile!.phone }));
    setStep(2);
    window.scrollTo({ top: 0 });
  }

  async function finish(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    const errors = validateAddress(cleanAddress(address));
    setAddressErrors(errors);
    if (Object.keys(errors).length) return;
    setPending(true);
    const result = await completeOnboarding(profile!, address);
    setPending(false);
    if (!result.ok) return setFormError(result.error);
    toast("Votre compte est prêt.", "success");
    router.replace(appRoutes.home);
  }

  return (
    <div className="dz-app min-h-dvh">
      <header className="mx-auto flex h-20 max-w-xl items-center justify-between px-5">
        <AppLogo className="h-8" href="/dispagaz" />
        <p className="text-sm text-dz-muted" aria-live="polite">
          Étape {step} sur 2
        </p>
      </header>
      <div className="mx-auto max-w-xl px-5">
        <div className="h-1 overflow-hidden rounded-full bg-dz-gray" aria-hidden="true">
          <div
            className="h-full rounded-full bg-dz-orange transition-[width] duration-500 ease-(--ease-soft)"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      <main id="contenu" tabIndex={-1} className="mx-auto max-w-xl px-5 pt-10 pb-24 outline-none">
        {step === 1 ? (
          <form key="profile" onSubmit={next} noValidate className="dz-step-in">
            <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.03em]">
              Faisons connaissance
            </h1>
            <p className="mt-2 text-dz-muted">
              Ces informations nous permettent de préparer vos commandes.
            </p>
            <div className="mt-9">
              <ProfileFields value={profile} onChange={setProfile} errors={profileErrors} />
            </div>
            <Button type="submit" size="lg" block className="mt-10">
              Continuer
            </Button>
          </form>
        ) : (
          <form key="address" onSubmit={finish} noValidate className="dz-step-in">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="-ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-3 pl-1 text-sm font-medium text-dz-muted hover:text-dz-ink"
            >
              <ChevronLeftIcon width={20} height={20} /> Retour
            </button>
            <h1 className="mt-4 text-[2rem] leading-tight font-bold tracking-[-0.03em]">
              Votre adresse principale
            </h1>
            <p className="mt-2 text-dz-muted">Elle sera proposée par défaut pour vos livraisons.</p>
            {formError ? (
              <p
                role="alert"
                className="mt-6 rounded-[14px] bg-dz-danger/8 px-4 py-3 text-[0.9375rem] text-dz-danger"
              >
                {formError}
              </p>
            ) : null}
            <div className="mt-9">
              <AddressForm value={address} onChange={setAddress} errors={addressErrors} />
            </div>
            <Button
              type="submit"
              size="lg"
              block
              className="mt-10"
              loading={pending}
              loadingLabel="Création de votre espace…"
            >
              Terminer
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
