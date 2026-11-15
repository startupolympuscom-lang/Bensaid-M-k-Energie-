import { demoConfig } from "@/data/config";
import type { Account, DemoDatabase, Session } from "@/types/dispagaz";

/**
 * Browser persistence for the demo (the "mock backend").
 *
 * - The database (accounts, orders, wallet…) lives in localStorage.
 * - The session lives in localStorage ("Se souvenir de moi") or
 *   sessionStorage (cleared when the browser closes).
 * - Exposes a tiny external store (subscribe / getSnapshot) consumed by
 *   React through useSyncExternalStore, and synced across tabs.
 *
 * Only the services in this folder read or write it. Replacing the mock
 * backend with real APIs means rewriting the services, not the UI.
 */

export type DemoState = { db: DemoDatabase; session: Session | null };

const { database: DB_KEY, session: SESSION_KEY } = demoConfig.storageKeys;

const emptyDatabase = (): DemoDatabase => ({ version: 1, accounts: {}, inventoryDelta: {} });

let state: DemoState | null = null;
const listeners = new Set<() => void>();
let crossTabSync = false;

function readJSON<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function load(): DemoState {
  const db = readJSON<DemoDatabase>(localStorage, DB_KEY);
  const session =
    readJSON<Session>(localStorage, SESSION_KEY) ?? readJSON<Session>(sessionStorage, SESSION_KEY);
  return { db: db?.version === 1 ? db : emptyDatabase(), session };
}

function persist(next: DemoState) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(next.db));
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    if (next.session) {
      (next.session.remember ? localStorage : sessionStorage).setItem(
        SESSION_KEY,
        JSON.stringify(next.session),
      );
    }
  } catch {
    // Private mode / quota exceeded: the demo keeps working in memory.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function listenAcrossTabs() {
  if (crossTabSync || typeof window === "undefined") return;
  crossTabSync = true;
  window.addEventListener("storage", (event) => {
    if (event.key === DB_KEY || event.key === SESSION_KEY) {
      state = load();
      emit();
    }
  });
}

export const demoStore = {
  /** Current state, or null on the server (before hydration). */
  getSnapshot(): DemoState | null {
    if (typeof window === "undefined") return null;
    if (!state) state = load();
    return state;
  },

  getServerSnapshot(): DemoState | null {
    return null;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    listenAcrossTabs();
    return () => {
      listeners.delete(listener);
    };
  },

  read(): DemoState {
    const snapshot = demoStore.getSnapshot();
    if (!snapshot) throw new Error("The Dispagaz demo store is only available in the browser.");
    return snapshot;
  },

  /** Immutable update: mutate a deep copy, then persist and notify. */
  update(mutate: (draft: DemoState) => void) {
    const draft = structuredClone(demoStore.read());
    mutate(draft);
    state = draft;
    persist(draft);
    emit();
  },

  /** "Réinitialiser les données de démonstration". */
  reset() {
    try {
      localStorage.removeItem(DB_KEY);
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    state = { db: emptyDatabase(), session: null };
    emit();
  },
};

export function accountOf(snapshot: DemoState): Account | null {
  return snapshot.session ? (snapshot.db.accounts[snapshot.session.email] ?? null) : null;
}

/** Mutates the signed-in account (throws when signed out). */
export function updateAccount(mutate: (account: Account, draft: DemoState) => void) {
  demoStore.update((draft) => {
    const account = accountOf(draft);
    if (!account) throw new Error("Session expirée. Merci de vous reconnecter.");
    mutate(account, draft);
  });
}

export function readAccount(): Account {
  const account = accountOf(demoStore.read());
  if (!account) throw new Error("Session expirée. Merci de vous reconnecter.");
  return account;
}

/** Simulated network latency for the mock services. */
export function delay(ms?: number) {
  const { min, max } = demoConfig.latency;
  const duration = ms ?? Math.round(min + Math.random() * (max - min));
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

/** Wraps a service body: errors become `{ ok: false, error }`. */
export async function attempt<T>(
  body: () => T | Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    return { ok: true, data: await body() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue.",
    };
  }
}
