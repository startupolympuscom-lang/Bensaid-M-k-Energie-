"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AppLogo } from "@/components/app/AppLogo";
import { Button } from "@/components/app/Button";
import { Checkbox, Input } from "@/components/app/Field";
import { Modal } from "@/components/app/Overlay";
import { LoadingState } from "@/components/app/States";
import { DispagazSwoosh } from "@/components/dispagaz/DispagazSwoosh";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import {
  loginWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  signUpWithEmail,
  validateCredentials,
  type CredentialErrors,
} from "@/services/authService";

function GoogleGlyph() {
  // Monochrome "G" (the brand palette excludes blue). Use Google's official
  // button artwork when real Google OAuth is integrated.
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.68-.06-1.34-.17-1.97H12v3.73h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.28ZM12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22Zm-5.6-8.09A6 6 0 0 1 6.08 12c0-.66.11-1.31.32-1.91V7.51H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.49l3.34-2.58ZM12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3.06 7.51l3.34 2.58C7.19 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  );
}

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { ready, session, account } = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<CredentialErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent">("idle");
  const [resetError, setResetError] = useState("");

  // Already signed in → continue.
  const signedIn = ready && !!session && !!account;
  useEffect(() => {
    if (signedIn) router.replace(account?.profile ? appRoutes.home : appRoutes.onboarding);
  }, [signedIn, account?.profile, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    const found = validateCredentials({ email, password });
    setErrors(found);
    if (Object.keys(found).length) return;
    setPending("email");
    const run = mode === "login" ? loginWithEmail : signUpWithEmail;
    const result = await run({ email, password, remember });
    setPending(null);
    if (!result.ok) return setFormError(result.error);
    router.replace(result.data.needsOnboarding ? appRoutes.onboarding : appRoutes.home);
  }

  async function google() {
    setFormError("");
    setPending("google");
    const result = await loginWithGoogle({ remember });
    setPending(null);
    if (!result.ok) return setFormError(result.error);
    router.replace(result.data.needsOnboarding ? appRoutes.onboarding : appRoutes.home);
  }

  async function sendReset(event: FormEvent) {
    event.preventDefault();
    setResetError("");
    setResetState("sending");
    const result = await requestPasswordReset(resetEmail);
    if (!result.ok) {
      setResetState("idle");
      return setResetError(result.error);
    }
    setResetState("sent");
  }

  if (!ready || signedIn) return <LoadingState className="min-h-dvh" />;

  const isLogin = mode === "login";

  return (
    <div className="dz-app grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel (desktop) */}
      <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-dz-ink p-12 text-white lg:flex xl:p-16">
        <DispagazSwoosh
          idPrefix="dz-auth"
          className="dz-drift pointer-events-none absolute inset-x-0 top-0 -z-10 h-[58%] w-full opacity-95"
        />
        <AppLogo tone="onDark" className="h-9" href="/dispagaz" />
        <div className="max-w-md">
          <p className="text-[2.6rem] leading-[1.08] font-bold tracking-[-0.03em]">
            Votre GPL, en quelques gestes.
          </p>
          <p className="mt-4 text-lg text-white/70">
            Livraison à domicile ou retrait 24h/24 dans un point Dispagaz.
          </p>
          <p className="mt-10 text-sm text-white/55">
            Application mobile bientôt disponible sur l’App Store et Google Play.
          </p>
        </div>
      </aside>

      {/* Form */}
      <main
        id="contenu"
        tabIndex={-1}
        className="flex items-center justify-center px-5 py-10 outline-none sm:px-10"
      >
        <div className="w-full max-w-[26rem]">
          <AppLogo className="h-9 lg:hidden" href="/dispagaz" />

          <h1 className="mt-10 text-[2rem] leading-tight font-bold tracking-[-0.03em] lg:mt-0">
            {isLogin ? "Bienvenue sur Dispagaz" : "Créer votre compte"}
          </h1>
          <p className="mt-2 text-dz-muted">Commandez votre GPL simplement, où que vous soyez.</p>

          <form onSubmit={submit} noValidate className="mt-9 space-y-5">
            {formError ? (
              <p
                role="alert"
                className="rounded-[14px] bg-dz-danger/8 px-4 py-3 text-[0.9375rem] text-dz-danger"
              >
                {formError}
              </p>
            ) : null}
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="h-10 rounded-[10px] px-3 text-sm font-medium text-dz-muted hover:bg-dz-gray hover:text-dz-ink"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              }
            />
            <div className="flex items-center justify-between gap-4">
              <Checkbox
                label="Se souvenir de moi"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              {isLogin ? (
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetState("idle");
                    setResetOpen(true);
                  }}
                  className="text-[0.9375rem] font-medium text-dz-orange-ink hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              ) : null}
            </div>
            <Button
              type="submit"
              size="lg"
              block
              loading={pending === "email"}
              loadingLabel={isLogin ? "Connexion…" : "Création du compte…"}
              disabled={pending === "google"}
            >
              {isLogin ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm text-dz-subtle" aria-hidden="true">
            <span className="h-px flex-1 bg-dz-line" />
            ou
            <span className="h-px flex-1 bg-dz-line" />
          </div>

          <Button
            variant="tertiary"
            size="lg"
            block
            onClick={google}
            loading={pending === "google"}
            loadingLabel="Connexion à Google…"
            disabled={pending === "email"}
          >
            <GoogleGlyph />
            Continuer avec Google
          </Button>

          <p className="mt-8 text-center text-[0.9375rem] text-dz-muted">
            {isLogin ? "Nouveau sur Dispagaz ? " : "Déjà un compte ? "}
            <Link
              href={isLogin ? appRoutes.signup : appRoutes.login}
              className="font-medium text-dz-ink underline decoration-dz-orange decoration-2 underline-offset-4"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </Link>
          </p>

          <p className="mt-10 rounded-[14px] bg-dz-surface px-4 py-3 text-sm leading-relaxed text-dz-muted">
            <span className="font-medium text-dz-ink">Mode démo</span> — saisissez n’importe quelle
            adresse email et un mot de passe d’au moins 4 caractères. Aucune donnée n’est envoyée.
          </p>
        </div>
      </main>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Mot de passe oublié"
        description="Recevez un lien pour choisir un nouveau mot de passe."
      >
        {resetState === "sent" ? (
          <div className="space-y-5">
            <p className="text-[0.9375rem] text-dz-muted" role="status">
              Si un compte existe pour <span className="font-medium text-dz-ink">{resetEmail}</span>
              , un lien de réinitialisation vient d’être envoyé. (Démo : aucun email n’est
              réellement envoyé.)
            </p>
            <Button block onClick={() => setResetOpen(false)}>
              J’ai compris
            </Button>
          </div>
        ) : (
          <form onSubmit={sendReset} noValidate className="space-y-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              error={resetError}
            />
            <Button type="submit" block loading={resetState === "sending"} loadingLabel="Envoi…">
              Envoyer le lien
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
