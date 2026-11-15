import { buildDemoHistory } from "@/data/demo-seed";
import { createId } from "@/lib/dispagaz/format";
import type { Address, AddressInput, Preferences, Profile } from "@/types/dispagaz";
import { pushNotification } from "@/services/notificationService";
import { attempt, delay, updateAccount } from "@/services/storage";

/**
 * Customer profile & saved addresses (mock). Later: user/profile API
 * (e.g. Supabase/PostgreSQL) and SMS OTP for phone verification.
 */

const PHONE_RE = /^(?:\+212|0)[5-7]\d{8}$/;

export type ProfileErrors = Partial<Record<keyof Profile, string>>;
export type AddressErrors = Partial<Record<keyof AddressInput, string>>;

export function validateProfile(profile: Profile): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!profile.firstName.trim()) errors.firstName = "Indiquez votre prénom.";
  if (!profile.lastName.trim()) errors.lastName = "Indiquez votre nom.";
  if (!PHONE_RE.test(profile.phone.replace(/[\s.-]/g, "")))
    errors.phone = "Numéro marocain invalide. Exemple : 06 12 34 56 78";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(profile.email.trim()))
    errors.email = "Adresse email invalide.";
  if (profile.birthDate) {
    const date = new Date(profile.birthDate);
    if (Number.isNaN(date.getTime()) || date > new Date()) errors.birthDate = "Date invalide.";
  }
  return errors;
}

export function validateAddress(input: AddressInput): AddressErrors {
  const errors: AddressErrors = {};
  const required = (key: keyof AddressInput, message: string) => {
    const value = input[key];
    if (typeof value !== "string" || !value.trim()) errors[key] = message;
  };
  required("label", "Donnez un nom à cette adresse.");
  required("city", "Indiquez la ville.");
  required("district", "Indiquez le quartier.");
  required("street", "Indiquez la rue ou l’adresse.");
  if (!PHONE_RE.test(input.phone.replace(/[\s.-]/g, "")))
    errors.phone = "Numéro marocain invalide. Exemple : 06 12 34 56 78";

  if (input.propertyType === "appartement") {
    required("floor", "L’étage est requis pour un appartement.");
    required("apartmentNumber", "Le numéro d’appartement est requis.");
  } else if (input.propertyType === "maison") {
    required("houseNumber", "Le numéro de la maison est requis.");
  } else if (input.propertyType === "villa") {
    required("villaNumber", "Le numéro de la villa est requis.");
  }
  return errors;
}

/** Keeps only the fields relevant to the property type. */
export function cleanAddress(input: AddressInput): AddressInput {
  const base: AddressInput = {
    label: input.label.trim(),
    city: input.city.trim(),
    district: input.district.trim(),
    street: input.street.trim(),
    directions: input.directions?.trim() || undefined,
    phone: input.phone.trim(),
    propertyType: input.propertyType,
    deliveryInstructions: input.deliveryInstructions?.trim() || undefined,
    position: input.position ?? null,
  };
  if (input.propertyType === "appartement") {
    return {
      ...base,
      buildingName: input.buildingName?.trim() || undefined,
      buildingNumber: input.buildingNumber?.trim() || undefined,
      floor: input.floor?.trim(),
      apartmentNumber: input.apartmentNumber?.trim(),
      intercom: input.intercom?.trim() || undefined,
    };
  }
  if (input.propertyType === "villa") {
    return {
      ...base,
      villaNumber: input.villaNumber?.trim(),
      compound: input.compound?.trim() || undefined,
    };
  }
  return { ...base, houseNumber: input.houseNumber?.trim() };
}

function assertValid(errors: Record<string, string | undefined>) {
  const first = Object.values(errors).find(Boolean);
  if (first) throw new Error(first);
}

/** End of onboarding: profile + primary address (+ demo history). */
export async function completeOnboarding(profile: Profile, addressInput: AddressInput) {
  await delay(700);
  return attempt(() => {
    assertValid(validateProfile(profile));
    const clean = cleanAddress(addressInput);
    assertValid(validateAddress(clean));
    updateAccount((account) => {
      account.profile = { ...profile, email: profile.email.trim() };
      const address: Address = {
        ...clean,
        id: createId("adr"),
        isDefault: true,
        createdAt: new Date().toISOString(),
      };
      account.addresses = [address];
      const seed = buildDemoHistory(Date.now(), address);
      account.orders = seed.orders;
      account.wallet = { balance: seed.balance, transactions: seed.transactions };
      pushNotification(account, {
        title: `Bienvenue, ${profile.firstName.trim()}`,
        body: "Votre compte Dispagaz est prêt. Commandez votre GPL en quelques gestes.",
        href: "/dispagaz/app",
      });
    });
  });
}

export async function updateProfile(profile: Profile) {
  await delay();
  return attempt(() => {
    assertValid(validateProfile(profile));
    updateAccount((account) => {
      account.profile = { ...profile, email: profile.email.trim() };
    });
  });
}

export async function updatePreferences(preferences: Preferences) {
  await delay(250);
  return attempt(() =>
    updateAccount((account) => {
      account.preferences = preferences;
    }),
  );
}

export async function addAddress(input: AddressInput, options: { makeDefault?: boolean } = {}) {
  await delay();
  return attempt(() => {
    const clean = cleanAddress(input);
    assertValid(validateAddress(clean));
    let created: Address | undefined;
    updateAccount((account) => {
      const makeDefault = options.makeDefault || account.addresses.length === 0;
      if (makeDefault) account.addresses.forEach((a) => (a.isDefault = false));
      created = {
        ...clean,
        id: createId("adr"),
        isDefault: makeDefault,
        createdAt: new Date().toISOString(),
      };
      account.addresses.push(created);
    });
    return created!;
  });
}

export async function updateAddress(id: string, input: AddressInput) {
  await delay();
  return attempt(() => {
    const clean = cleanAddress(input);
    assertValid(validateAddress(clean));
    updateAccount((account) => {
      const index = account.addresses.findIndex((a) => a.id === id);
      if (index < 0) throw new Error("Adresse introuvable.");
      const current = account.addresses[index];
      account.addresses[index] = {
        ...clean,
        id,
        isDefault: current.isDefault,
        createdAt: current.createdAt,
      };
    });
  });
}

export async function deleteAddress(id: string) {
  await delay(300);
  return attempt(() =>
    updateAccount((account) => {
      const removed = account.addresses.find((a) => a.id === id);
      account.addresses = account.addresses.filter((a) => a.id !== id);
      if (removed?.isDefault && account.addresses[0]) account.addresses[0].isDefault = true;
      if (account.draft?.addressId === id) account.draft.addressId = undefined;
    }),
  );
}

export async function setDefaultAddress(id: string) {
  await delay(250);
  return attempt(() =>
    updateAccount((account) => {
      account.addresses.forEach((a) => (a.isDefault = a.id === id));
    }),
  );
}
