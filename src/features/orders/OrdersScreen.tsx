"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/app/Button";
import { SegmentedControl } from "@/components/app/Field";
import { EmptyState, PageTitle } from "@/components/app/States";
import { OrderCard } from "@/features/orders/OrderBits";
import { isOrderActive } from "@/lib/dispagaz/labels";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";

type Tab = "active" | "done" | "cancelled";

export function OrdersScreen() {
  const { account } = useAccount();
  const [tab, setTab] = useState<Tab>("active");
  if (!account) return null;

  const sorted = [...account.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const groups: Record<Tab, typeof sorted> = {
    active: sorted.filter(isOrderActive),
    done: sorted.filter((o) => o.status === "delivered" || o.status === "collected"),
    cancelled: sorted.filter((o) => o.status === "cancelled"),
  };
  const list = groups[tab];
  const count = (t: Tab) => (groups[t].length ? ` (${groups[t].length})` : "");

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="Mes commandes" />
      <SegmentedControl<Tab>
        label="Filtrer les commandes"
        value={tab}
        onChange={setTab}
        options={[
          { value: "active", label: `En cours${count("active")}` },
          { value: "done", label: `Terminées${count("done")}` },
          { value: "cancelled", label: `Annulées${count("cancelled")}` },
        ]}
        className="mb-6"
      />
      {list.length === 0 ? (
        <EmptyState
          title={
            tab === "active"
              ? "Aucune commande en cours"
              : tab === "done"
                ? "Aucune commande terminée"
                : "Aucune commande annulée"
          }
          text={tab === "active" ? "Commandez votre GPL en quelques gestes." : undefined}
          action={
            tab === "active" ? (
              <ButtonLink href={appRoutes.order}>Commander du GPL</ButtonLink>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {list.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
