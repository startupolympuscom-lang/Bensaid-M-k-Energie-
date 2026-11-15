import { googleDemoAccount } from "@/data/google-demo-account";
import { createId } from "@/lib/dispagaz/format";
import type { Account, AuthProvider, ServiceResult, User } from "@/types/dispagaz";
import { accountOf, attempt, delay, demoStore } from "@/services/storage";

/**
 * DEMO authentication.
 *
 * Any valid-looking email + password signs in; "Continuer avec Google" is
 * simulated. The UI only talks to these functions, so they can later be
 * backed by a real provider (Supabase, Auth0, Firebase, Auth.js + Google
 * OAuth) without touching components.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Credentials = { email: string; password: string; remember: boolean };
export type CredentialErrors = Partial<Record<"email" | "password", string>>;
export type AuthResult = { user: User; needsOnboarding: boolean };

export function validateCredentials({ email, password }: Pick<Credentials, "email" | "password">) {
  const errors: CredentialErrors = {};
  if (!EMAIL_RE.test(email.trim())) errors.email = "Saisissez une adresse email valide.";
  if (password.length < 4) errors.password = "4 caractères minimum.";
  return errors;
}

function newAccount(email: string, provider: AuthProvider): Account {
  return {
    user: { id: createId("usr"), email, provider, createdAt: new Date().toISOString() },
    profile: null,
    addresses: [],
    wallet: { balance: 0, transactions: [] },
    orders: [],
    notifications: [],
    preferences: { defaultPaymentMethod: "wallet" },
    draft: null,
  };
}

function signIn(email: string, provider: AuthProvider, remember: boolean): AuthResult {
  const key = email.trim().toLowerCase();
  let result: AuthResult | undefined;
  demoStore.update((draft) => {
    const account = (draft.db.accounts[key] ??= newAccount(key, provider));
    draft.session = {
      userId: account.user.id,
      email: key,
      provider,
      remember,
      createdAt: new Date().toISOString(),
    };
    result = { user: account.user, needsOnboarding: account.profile === null };
  });
  return result!;
}

export async function loginWithEmail(credentials: Credentials): Promise<ServiceResult<AuthResult>> {
  await delay();
  return attempt(() => {
    const first = Object.values(validateCredentials(credentials))[0];
    if (first) throw new Error(first);
    return signIn(credentials.email, "email", credentials.remember);
  });
}

/** Demo sign-up: same behaviour as sign-in (the account is created if new). */
export const signUpWithEmail = loginWithEmail;

/** Simulated Google OAuth. Replace with a real OAuth redirect/popup. */
export async function loginWithGoogle({ remember = true } = {}): Promise<
  ServiceResult<AuthResult>
> {
  await delay(800);
  return attempt(() => signIn(googleDemoAccount.email, "google", remember));
}

export async function logout() {
  await delay(200);
  return attempt(() =>
    demoStore.update((draft) => {
      draft.session = null;
    }),
  );
}

export function getCurrentUser(): User | null {
  const snapshot = demoStore.getSnapshot();
  return snapshot ? (accountOf(snapshot)?.user ?? null) : null;
}

/** Demo: always "sends" a reset link. */
export async function requestPasswordReset(email: string) {
  await delay();
  return attempt(() => {
    if (!EMAIL_RE.test(email.trim())) throw new Error("Saisissez une adresse email valide.");
    return { email: email.trim() };
  });
}

/** Values pre-filled in onboarding (from the Google profile when relevant). */
export function onboardingDefaults() {
  const snapshot = demoStore.getSnapshot();
  const session = snapshot?.session;
  if (session?.provider === "google") {
    return {
      firstName: googleDemoAccount.firstName,
      lastName: googleDemoAccount.lastName,
      email: session.email,
    };
  }
  return { firstName: "", lastName: "", email: session?.email ?? "" };
}
