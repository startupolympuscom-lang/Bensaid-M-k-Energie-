"use client";

import { useSyncExternalStore } from "react";
import { accountOf, demoStore, type DemoState } from "@/services/storage";
import type { Account, Session } from "@/types/dispagaz";

/** Centralized app state (user, profile, addresses, wallet, draft, orders…). */
export function useDemoState(): DemoState | null {
  return useSyncExternalStore(
    demoStore.subscribe,
    demoStore.getSnapshot,
    demoStore.getServerSnapshot,
  );
}

export type AccountView =
  | { ready: false; session: null; account: null; db: null }
  | { ready: true; session: Session | null; account: Account | null; db: DemoState["db"] };

/** `ready` is false during server rendering / before local data is loaded. */
export function useAccount(): AccountView {
  const state = useDemoState();
  if (!state) return { ready: false, session: null, account: null, db: null };
  return { ready: true, session: state.session, account: accountOf(state), db: state.db };
}
