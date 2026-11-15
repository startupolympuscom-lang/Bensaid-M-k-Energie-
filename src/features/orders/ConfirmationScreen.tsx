"use client";

import { ButtonLink } from "@/components/app/Button";
import { EmptyState } from "@/components/app/States";
import { OrderConfirmation } from "@/features/orders/Confirmation";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";

/** Confirmation of the most recent order. */
export function ConfirmationScreen() {
  const { account } = useAccount();
  if (!account) return null;
  const order = [...account.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (!order) {
    return (
      <EmptyState
        title="Aucune commande"
        text="Votre prochaine commande apparaîtra ici."
        action={<ButtonLink href={appRoutes.order}>Commander du GPL</ButtonLink>}
      />
    );
  }
  return <OrderConfirmation order={order} />;
}
