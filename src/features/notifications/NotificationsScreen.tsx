"use client";

import Link from "next/link";
import { Button } from "@/components/app/Button";
import { EmptyState, PageTitle } from "@/components/app/States";
import { formatDateTime } from "@/lib/dispagaz/format";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { markAllNotificationsRead } from "@/services/notificationService";
import { cn } from "@/lib/cn";

export function NotificationsScreen() {
  const { account } = useAccount();
  if (!account) return null;
  const { notifications } = account;
  const unread = notifications.some((n) => !n.read);

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle
        title="Notifications"
        action={
          unread ? (
            <Button
              variant="tertiary"
              className="h-10 px-4"
              onClick={() => void markAllNotificationsRead()}
            >
              Tout marquer comme lu
            </Button>
          ) : undefined
        }
      />
      {notifications.length === 0 ? (
        <EmptyState
          title="Aucune notification"
          text="Vos commandes et recharges apparaîtront ici."
        />
      ) : (
        <ul className="divide-y divide-dz-line">
          {notifications.map((n) => {
            const content = (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-2 h-2 w-2 shrink-0 rounded-full",
                    n.read ? "bg-transparent" : "bg-dz-orange",
                  )}
                />
                <span className="min-w-0">
                  <span className="block font-medium">
                    {n.title}
                    {!n.read ? <span className="sr-only"> (non lue)</span> : null}
                  </span>
                  <span className="block text-[0.9375rem] text-dz-muted">{n.body}</span>
                  <span className="mt-0.5 block text-xs text-dz-subtle">
                    {formatDateTime(n.createdAt)}
                  </span>
                </span>
              </>
            );
            return (
              <li key={n.id}>
                {n.href ? (
                  <Link
                    href={n.href}
                    className="-mx-3 flex gap-3 rounded-[14px] px-3 py-4 hover:bg-dz-surface"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex gap-3 py-4">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
