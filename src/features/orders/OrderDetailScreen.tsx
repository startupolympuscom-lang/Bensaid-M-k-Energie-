"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/app/Button";
import { ChevronLeftIcon } from "@/components/app/Icons";
import { Modal } from "@/components/app/Overlay";
import { DetailList, EmptyState } from "@/components/app/States";
import { useToast } from "@/components/app/Toast";
import {
  EmptyBottleExchange,
  PickupCodeCard,
  PickupInstructions,
} from "@/features/distributors/Pickup";
import { OrderStatusTimeline, StatusPill } from "@/features/orders/OrderBits";
import { formatDate, formatDateTime, formatMAD } from "@/lib/dispagaz/format";
import {
  addressLine,
  cityLine,
  fulfillmentLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/dispagaz/labels";
import { appRoutes } from "@/lib/dispagaz/routes";
import { useAccount } from "@/lib/dispagaz/useDemo";
import { advanceDeliveryStatus, canCancel, cancelOrder } from "@/services/orderService";

export function OrderDetailScreen({ id }: { id: string }) {
  const { account } = useAccount();
  const toast = useToast();
  const [advancing, setAdvancing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!account) return null;
  const order = account.orders.find((o) => o.id === id);
  if (!order) {
    return (
      <EmptyState
        title="Commande introuvable"
        text="Cette commande n’existe pas ou a été supprimée."
        action={<ButtonLink href={appRoutes.orders}>Mes commandes</ButtonLink>}
      />
    );
  }

  const item = order.items[0];
  const isPickup = order.fulfillment === "pickup";
  const pickupActive = isPickup && order.status === "reserved";

  const rows: [string, React.ReactNode][] = [
    ["Commande", order.number],
    ["Date", formatDateTime(order.createdAt)],
    ["Produit", `${item.brand} ${item.name}`],
    ["Quantité", String(item.quantity)],
    [
      isPickup ? "Point Dispagaz" : "Adresse",
      isPickup ? (
        order.distributor?.name
      ) : order.address ? (
        <>
          <span className="block">{order.address.label}</span>
          <span className="block font-normal text-dz-muted">{addressLine(order.address)}</span>
          <span className="block font-normal text-dz-muted">{cityLine(order.address)}</span>
        </>
      ) : (
        "—"
      ),
    ],
    [
      "Paiement",
      `${paymentMethodLabels[order.payment.method]} · ${paymentStatusLabels[order.payment.status]}`,
    ],
  ];
  if (order.depositTotal) rows.push(["Consigne", formatMAD(order.depositTotal)]);
  if (order.deliveryFee) rows.push(["Frais de livraison", formatMAD(order.deliveryFee)]);
  rows.push(["Total", formatMAD(order.total)]);

  async function next() {
    setAdvancing(true);
    const result = await advanceDeliveryStatus(order!);
    setAdvancing(false);
    if (!result.ok) toast(result.error, "error");
  }

  async function cancel() {
    setCancelling(true);
    const result = await cancelOrder(order!.id);
    setCancelling(false);
    setCancelOpen(false);
    toast(result.ok ? "Commande annulée." : result.error, result.ok ? "success" : "error");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={appRoutes.orders}
        className="-ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-3 pl-1 text-sm font-medium text-dz-muted hover:text-dz-ink"
      >
        <ChevronLeftIcon width={20} height={20} /> Mes commandes
      </Link>

      <div className="mt-3 mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.75rem] leading-tight font-bold tracking-[-0.025em]">
            {order.number}
          </h1>
          <p className="mt-1 text-dz-muted">
            {fulfillmentLabels[order.fulfillment]} · {formatDate(order.createdAt)}
          </p>
        </div>
        <span aria-live="polite">
          <StatusPill status={order.status} />
        </span>
      </div>

      {order.status === "cancelled" ? (
        <p className="mb-8 rounded-[16px] bg-dz-surface px-5 py-4 text-[0.9375rem] text-dz-muted">
          Cette commande a été annulée{order.payment.status === "refunded" ? " et remboursée" : ""}.
        </p>
      ) : null}

      {!isPickup && order.status !== "cancelled" ? (
        <section
          aria-labelledby="tracking"
          className="mb-10 rounded-[22px] border border-dz-line p-5 sm:p-6"
        >
          <h2 id="tracking" className="mb-6 text-lg font-bold tracking-[-0.01em]">
            Suivi de livraison
          </h2>
          <OrderStatusTimeline order={order} />
          {order.status !== "delivered" ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-dz-surface px-4 py-3">
              <p className="text-sm text-dz-muted">Démo : faites avancer la livraison.</p>
              <Button
                variant="tertiary"
                className="h-10 px-4"
                onClick={next}
                loading={advancing}
                loadingLabel="Mise à jour…"
              >
                Simuler l’étape suivante
              </Button>
            </div>
          ) : null}
        </section>
      ) : null}

      {pickupActive ? (
        <div className="mb-10 space-y-4">
          <PickupCodeCard order={order} />
          <EmptyBottleExchange order={order} />
        </div>
      ) : null}

      {isPickup && order.status === "collected" ? (
        <p
          className="mb-8 rounded-[16px] bg-dz-teal-tint px-5 py-4 text-[0.9375rem] font-medium text-dz-teal"
          role="status"
        >
          Bouteille retirée
          {order.statusHistory.at(-1)
            ? ` le ${formatDateTime(order.statusHistory.at(-1)!.at)}`
            : ""}
          . Transaction terminée.
        </p>
      ) : null}

      <h2 className="mb-3 text-lg font-bold tracking-[-0.01em]">Détails</h2>
      <DetailList rows={rows} />

      {pickupActive ? <PickupInstructions className="mt-10" /> : null}

      {canCancel(order) ? (
        <div className="mt-10 border-t border-dz-line pt-8">
          <Button variant="danger" onClick={() => setCancelOpen(true)}>
            Annuler la commande
          </Button>
        </div>
      ) : null}

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Annuler cette commande ?"
        description={
          order.payment.status === "paid"
            ? order.payment.method === "wallet"
              ? `${formatMAD(order.total)} seront remboursés sur votre portefeuille.`
              : "Le montant sera remboursé sur votre carte (démo)."
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={cancel}
              loading={cancelling}
              loadingLabel="Annulation…"
            >
              Annuler la commande
            </Button>
            <Button variant="tertiary" onClick={() => setCancelOpen(false)}>
              Garder ma commande
            </Button>
          </>
        }
      >
        <p className="text-[0.9375rem] text-dz-muted">Cette action est définitive.</p>
      </Modal>
    </div>
  );
}
