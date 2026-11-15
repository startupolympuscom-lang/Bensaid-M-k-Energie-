"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BellIcon } from "@/components/app/Icons";
import { formatDateTime } from "@/lib/dispagaz/format";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { markAllNotificationsRead } from "@/services/notificationService";
import { cn } from "@/lib/cn";

/** Simple notifications dropdown (no complex notification center). */
export function NotificationsMenu({ align = "right" }: { align?: "right" | "left" }) {
  const { account } = useAccount();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const notifications = account?.notifications ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          unread ? `Notifications, ${unread} non lue${unread > 1 ? "s" : ""}` : "Notifications"
        }
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-dz-ink hover:bg-dz-gray"
      >
        <BellIcon />
        {unread ? (
          <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-dz-orange" />
        ) : null}
      </button>

      {open ? (
        <div
          className={cn(
            "dz-step-in absolute top-13 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[18px] border border-dz-line bg-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.3)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <p className="font-bold">Notifications</p>
            {unread ? (
              <button
                type="button"
                onClick={() => void markAllNotificationsRead()}
                className="text-sm font-medium text-dz-orange-ink hover:underline"
              >
                Tout marquer comme lu
              </button>
            ) : null}
          </div>
          {notifications.length === 0 ? (
            <p className="px-5 pt-2 pb-6 text-[0.9375rem] text-dz-muted">
              Aucune notification pour le moment.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto pb-2">
              {notifications.slice(0, 6).map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? appRoutes.notifications}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-5 py-3 hover:bg-dz-surface"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-2 h-2 w-2 shrink-0 rounded-full",
                        n.read ? "bg-transparent" : "bg-dz-orange",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-medium">{n.title}</span>
                      <span className="block truncate text-sm text-dz-muted">{n.body}</span>
                      <span className="mt-0.5 block text-xs text-dz-subtle">
                        {formatDateTime(n.createdAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={appRoutes.notifications}
            onClick={() => setOpen(false)}
            className="block border-t border-dz-line px-5 py-3 text-center text-sm font-medium hover:bg-dz-surface"
          >
            Voir toutes les notifications
          </Link>
        </div>
      ) : null}
    </div>
  );
}
