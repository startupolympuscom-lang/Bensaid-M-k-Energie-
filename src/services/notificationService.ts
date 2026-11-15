import { createId } from "@/lib/dispagaz/format";
import type { Account } from "@/types/dispagaz";
import { attempt, updateAccount } from "@/services/storage";

/**
 * In-app notifications (demo). Later: push notifications / SMS via a
 * messaging provider, fed by order and wallet events from the backend.
 */

/** Adds a notification inside an ongoing account update. */
export function pushNotification(
  account: Account,
  notification: { title: string; body: string; href?: string },
) {
  account.notifications.unshift({
    id: createId("ntf"),
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  });
  account.notifications = account.notifications.slice(0, 50);
}

export async function markAllNotificationsRead() {
  return attempt(() =>
    updateAccount((account) => {
      account.notifications.forEach((n) => {
        n.read = true;
      });
    }),
  );
}
