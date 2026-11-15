"use client";

import { ButtonLink } from "@/components/app/Button";
import { DetailList, SuccessState } from "@/components/app/States";
import { PickupCodeCard, PickupInstructions } from "@/features/distributors/Pickup";
import { formatMAD } from "@/lib/dispagaz/format";
import {
  addressLine,
  cityLine,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/dispagaz/labels";
import { appRoutes } from "@/lib/dispagaz/routes";
import type { Order } from "@/types/dispagaz";

export function OrderConfirmation({ order }: { order: Order }) {
  const item = order.items[0];
  const payment = `${paymentMethodLabels[order.payment.method]} · ${paymentStatusLabels[order.payment.status]}`;

  if (order.fulfillment === "pickup" && order.pickup && order.distributor) {
    return (
      <div className="mx-auto max-w-lg">
        <SuccessState
          title="Commande confirmée"
          text={`Votre bouteille est réservée au point ${order.distributor.name}.`}
        >
          <PickupCodeCard order={order} />
          <DetailList
            className="mt-4"
            rows={[
              ["Commande", order.number],
              ["Référence de retrait", order.pickup.reference],
              ["Point Dispagaz", order.distributor.name],
              ["Produit", `${item.brand} ${item.name}`],
              ["Taille", item.size],
              ["Quantité", String(item.quantity)],
              ["Paiement", payment],
              ["Total", formatMAD(order.total)],
            ]}
          />
          <PickupInstructions className="mt-10" />
        </SuccessState>
        <div className="mt-10 flex flex-col gap-3">
          <ButtonLink href={appRoutes.orderDetail(order.id)} size="lg" block>
            Voir ma commande
          </ButtonLink>
          <ButtonLink href={appRoutes.home} variant="tertiary" size="lg" block>
            Retour à l’accueil
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <SuccessState
      title="Commande confirmée"
      text="Nous préparons votre commande."
      actions={
        <>
          <ButtonLink href={appRoutes.orderDetail(order.id)} size="lg" block>
            Suivre ma commande
          </ButtonLink>
          <ButtonLink href={appRoutes.home} variant="tertiary" size="lg" block>
            Retour à l’accueil
          </ButtonLink>
        </>
      }
    >
      <DetailList
        rows={[
          ["Commande", order.number],
          ["Bouteille", `${item.brand} ${item.name}`],
          ["Quantité", String(item.quantity)],
          [
            "Adresse",
            order.address ? (
              <>
                <span className="block">{addressLine(order.address)}</span>
                <span className="block font-normal text-dz-muted">{cityLine(order.address)}</span>
              </>
            ) : (
              "—"
            ),
          ],
          ["Paiement", payment],
          ["Total", formatMAD(order.total)],
        ]}
      />
    </SuccessState>
  );
}
