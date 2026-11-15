import { demoConfig } from "@/data/config";
import {
  createId,
  createOrderNumber,
  createPickupCode,
  createReference,
  formatMAD,
} from "@/lib/dispagaz/format";
import { deliverySteps, orderStatusLabels } from "@/lib/dispagaz/labels";
import type {
  Account,
  AddressInput,
  AddressSnapshot,
  Centimes,
  Fulfillment,
  Order,
  OrderDraft,
  OrderStatus,
  PaymentMethod,
} from "@/types/dispagaz";
import { selectDistributor } from "@/services/distributorService";
import { pushNotification } from "@/services/notificationService";
import {
  createCODPayment,
  createTerminalPaymentReservation,
  payByCard,
  payFromWallet,
  type CardInput,
  type PaymentResult,
} from "@/services/paymentService";
import { selectProduct } from "@/services/productService";
import { cleanAddress, validateAddress } from "@/services/profileService";
import { applyTransaction } from "@/services/walletService";
import { attempt, delay, demoStore, readAccount, updateAccount } from "@/services/storage";

/**
 * Orders (mock). Later: orders API + ERP Dispagaz integration, delivery
 * management / driver app, distributor machine APIs, push notifications.
 */

export const paymentMethodsFor: Record<Fulfillment, PaymentMethod[]> = {
  delivery: ["wallet", "card", "cod"],
  pickup: ["wallet", "card", "terminal"],
};

/* ------------------------------------------------------------ draft */

const emptyDraft = (fulfillment?: Fulfillment): OrderDraft => ({
  startedAt: new Date().toISOString(),
  fulfillment,
  quantity: 1,
  exchangeEmptyBottle: true,
});

/** Starts a new checkout (optionally with a mode / point already chosen). */
export function startOrder(options: { fulfillment?: Fulfillment; distributorId?: string } = {}) {
  updateAccount((account) => {
    account.draft = { ...emptyDraft(options.fulfillment), distributorId: options.distributorId };
  });
}

export function updateDraft(patch: Partial<OrderDraft>) {
  updateAccount((account) => {
    account.draft = { ...(account.draft ?? emptyDraft()), ...patch };
  });
}

export function clearDraft() {
  updateAccount((account) => {
    account.draft = null;
  });
}

export type Totals = {
  unitPrice: Centimes;
  quantity: number;
  subtotal: Centimes;
  depositTotal: Centimes;
  deliveryFee: Centimes;
  total: Centimes;
};

export function computeTotals(draft: OrderDraft): Totals | null {
  const product = selectProduct(draft.productId);
  if (!product) return null;
  const quantity = draft.quantity;
  const subtotal = product.price * quantity;
  const isDelivery = draft.fulfillment === "delivery";
  // Pickup always swaps an empty bottle; delivery may be without exchange (consigne).
  const depositTotal = isDelivery && !draft.exchangeEmptyBottle ? product.deposit * quantity : 0;
  const deliveryFee = isDelivery ? demoConfig.deliveryFee : 0;
  return {
    unitPrice: product.price,
    quantity,
    subtotal,
    depositTotal,
    deliveryFee,
    total: subtotal + depositTotal + deliveryFee,
  };
}

/** Resolves the delivery address of the draft (saved or new). */
export function draftAddress(account: Account, draft: OrderDraft): AddressInput | undefined {
  if (draft.addressId) return account.addresses.find((a) => a.id === draft.addressId);
  return draft.newAddress;
}

/* ------------------------------------------------------------ placing */

export async function placeOrder({ card }: { card?: CardInput } = {}) {
  await delay(400);
  return attempt<Order>(async () => {
    const account = readAccount();
    const draft = account.draft;
    if (!draft?.fulfillment) throw new Error("Choisissez un mode de réception.");
    const product = selectProduct(draft.productId);
    const totals = computeTotals(draft);
    if (!product || !totals) throw new Error("Choisissez une bouteille.");
    if (draft.quantity < 1 || draft.quantity > demoConfig.maxQuantity)
      throw new Error(`Quantité entre 1 et ${demoConfig.maxQuantity}.`);
    const method = draft.paymentMethod;
    if (!method || !paymentMethodsFor[draft.fulfillment].includes(method))
      throw new Error("Choisissez un moyen de paiement.");

    // Fulfillment checks
    let addressSnapshot: AddressSnapshot | undefined;
    let saveNewAddress: AddressInput | undefined;
    const db = demoStore.read().db;
    const point =
      draft.fulfillment === "pickup" ? selectDistributor(db, draft.distributorId) : undefined;

    if (draft.fulfillment === "delivery") {
      if (draft.addressId) {
        const saved = account.addresses.find((a) => a.id === draft.addressId);
        if (!saved) throw new Error("Adresse de livraison introuvable.");
        const { isDefault: _d, createdAt: _c, ...rest } = saved;
        addressSnapshot = rest;
      } else if (draft.newAddress) {
        const { saveToProfile, ...input } = draft.newAddress;
        const clean = cleanAddress(input);
        const first = Object.values(validateAddress(clean))[0];
        if (first) throw new Error(first);
        addressSnapshot = { ...clean, id: createId("adr") };
        if (saveToProfile) saveNewAddress = clean;
      } else {
        throw new Error("Choisissez une adresse de livraison.");
      }
    } else {
      if (!point) throw new Error("Choisissez un point Dispagaz.");
      if (point.status !== "open") throw new Error("Ce point Dispagaz est indisponible.");
      if ((point.inventory[product.id] ?? 0) < draft.quantity)
        throw new Error("Stock insuffisant dans ce point Dispagaz.");
    }

    // Payment
    const id = createId("ord");
    const number = createOrderNumber();
    let payment: { ok: true; data: PaymentResult } | { ok: false; error: string };
    if (method === "wallet") {
      payment = await payFromWallet({
        amount: totals.total,
        orderId: id,
        description: `Commande ${number}`,
      });
    } else if (method === "card") {
      if (!card) throw new Error("Renseignez votre carte bancaire.");
      payment = await payByCard({ amount: totals.total, card });
    } else if (method === "cod") {
      payment = await createCODPayment({ amount: totals.total });
    } else {
      payment = await createTerminalPaymentReservation({ amount: totals.total });
    }
    if (!payment.ok) throw new Error(payment.error);

    const now = new Date();
    const initialStatus: OrderStatus = draft.fulfillment === "delivery" ? "received" : "reserved";
    const order: Order = {
      id,
      number,
      createdAt: now.toISOString(),
      fulfillment: draft.fulfillment,
      items: [
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          size: product.size,
          unitPrice: product.price,
          quantity: draft.quantity,
        },
      ],
      exchangeEmptyBottle: draft.fulfillment === "pickup" ? true : draft.exchangeEmptyBottle,
      subtotal: totals.subtotal,
      depositTotal: totals.depositTotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      payment: {
        method,
        status: payment.data.status,
        reference: payment.data.reference,
        cardLast4: payment.data.cardLast4,
      },
      address: addressSnapshot,
      distributor: point
        ? { id: point.id, name: point.name, address: point.address, is24_7: point.is24_7 }
        : undefined,
      pickup: point
        ? {
            reference: createReference("RET"),
            code: createPickupCode(),
            expiresAt: new Date(
              now.getTime() + demoConfig.reservationHours * 3_600_000,
            ).toISOString(),
            requiresEmptyBottleReturn: true,
            emptyBottleReturned: false,
            collected: false,
          }
        : undefined,
      status: initialStatus,
      statusHistory: [{ status: initialStatus, at: now.toISOString() }],
    };

    updateAccount((acc, state) => {
      acc.orders.unshift(order);
      if (saveNewAddress) {
        acc.addresses.push({
          ...saveNewAddress,
          id: createId("adr"),
          isDefault: acc.addresses.length === 0,
          createdAt: now.toISOString(),
        });
      }
      if (point) {
        const delta = (state.db.inventoryDelta[point.id] ??= {});
        delta[product.id] = (delta[product.id] ?? 0) - draft.quantity;
        pushNotification(acc, {
          title: "Retrait disponible",
          body: `Votre bouteille est réservée au point ${point.name}. Présentez votre code au distributeur.`,
          href: `/dispagaz/app/commandes/${id}`,
        });
      } else {
        pushNotification(acc, {
          title: "Commande reçue",
          body: `Nous avons bien reçu votre commande ${number}.`,
          href: `/dispagaz/app/commandes/${id}`,
        });
      }
      acc.draft = null;
    });
    return order;
  });
}

/* ------------------------------------------------------------ reading */

export async function getOrders() {
  return attempt(() => readAccount().orders);
}

export async function getOrder(id: string) {
  return attempt(() => {
    const order = readAccount().orders.find((o) => o.id === id);
    if (!order) throw new Error("Commande introuvable.");
    return order;
  });
}

/* ------------------------------------------------------------ updates */

function mutateOrder(id: string, mutate: (order: Order, account: Account) => void) {
  updateAccount((account) => {
    const order = account.orders.find((o) => o.id === id);
    if (!order) throw new Error("Commande introuvable.");
    mutate(order, account);
  });
}

const deliveryNotifications: Partial<Record<OrderStatus, string>> = {
  confirmed: "Commande confirmée",
  preparing: "Commande en préparation",
  out_for_delivery: "Livreur en route",
  delivered: "Commande livrée",
};

export async function updateStatus(id: string, status: OrderStatus) {
  await delay(400);
  return attempt(() =>
    mutateOrder(id, (order, account) => {
      if (order.status === "cancelled") throw new Error("Cette commande est annulée.");
      order.status = status;
      order.statusHistory.push({ status, at: new Date().toISOString() });
      if (status === "delivered" && order.payment.status === "to_collect")
        order.payment.status = "paid";
      const title = deliveryNotifications[status];
      if (title) {
        pushNotification(account, {
          title,
          body: `Commande ${order.number} · ${orderStatusLabels[status]}`,
          href: `/dispagaz/app/commandes/${order.id}`,
        });
      }
    }),
  );
}

/** Demo helper: moves a delivery to its next status. */
export async function advanceDeliveryStatus(order: Order) {
  const index = deliverySteps.indexOf(order.status);
  const next = deliverySteps[index + 1];
  if (!next) return { ok: false as const, error: "Commande déjà livrée." };
  return updateStatus(order.id, next);
}

export function canCancel(order: Order) {
  if (order.fulfillment === "delivery")
    return ["received", "confirmed", "preparing"].includes(order.status);
  return order.status === "reserved" && !order.pickup?.emptyBottleReturned;
}

export async function cancelOrder(id: string) {
  await delay();
  return attempt(() =>
    updateAccount((account, state) => {
      const order = account.orders.find((o) => o.id === id);
      if (!order) throw new Error("Commande introuvable.");
      if (!canCancel(order)) throw new Error("Cette commande ne peut plus être annulée.");
      order.status = "cancelled";
      order.statusHistory.push({ status: "cancelled", at: new Date().toISOString() });
      let refundNote = "";
      if (order.payment.status === "paid") {
        if (order.payment.method === "wallet") {
          applyTransaction(account, {
            type: "remboursement",
            amount: order.total,
            reference: createReference("RMB"),
            description: `Remboursement commande ${order.number}`,
            orderId: order.id,
          });
          refundNote = ` ${formatMAD(order.total)} remboursés sur votre portefeuille.`;
        } else {
          refundNote = " Le remboursement sera effectué sur votre carte (démo).";
        }
        order.payment.status = "refunded";
      }
      // Release the reserved bottle(s) at the Point Dispagaz.
      if (order.distributor) {
        const delta = (state.db.inventoryDelta[order.distributor.id] ??= {});
        for (const item of order.items) {
          delta[item.productId] = (delta[item.productId] ?? 0) + item.quantity;
        }
      }
      pushNotification(account, {
        title: "Commande annulée",
        body: `Commande ${order.number} annulée.${refundNote}`,
        href: `/dispagaz/app/commandes/${order.id}`,
      });
    }),
  );
}

/* ------------------------------------------------------------ Point Dispagaz */

export async function reserveDistributorBottle(
  distributorId: string,
  productId: string,
  quantity: number,
) {
  await delay(300);
  return attempt(() =>
    demoStore.update((state) => {
      const point = selectDistributor(state.db, distributorId);
      if (!point || (point.inventory[productId] ?? 0) < quantity)
        throw new Error("Stock insuffisant.");
      const delta = (state.db.inventoryDelta[distributorId] ??= {});
      delta[productId] = (delta[productId] ?? 0) - quantity;
    }),
  );
}

/** Demo: payment made by card on the distributor terminal. */
export async function confirmTerminalPayment(id: string) {
  await delay(700);
  return attempt(() =>
    mutateOrder(id, (order) => {
      if (order.payment.status !== "to_pay_at_terminal")
        throw new Error("Aucun paiement en attente.");
      order.payment.status = "paid";
    }),
  );
}

/** Demo: the customer put the empty bottle in the first door. */
export async function confirmEmptyBottleReturn(id: string) {
  await delay(900);
  return attempt(() =>
    mutateOrder(id, (order) => {
      if (!order.pickup) throw new Error("Commande sans retrait.");
      if (order.status === "cancelled") throw new Error("Cette commande est annulée.");
      if (order.payment.status === "to_pay_at_terminal")
        throw new Error("Réglez d’abord au terminal.");
      order.pickup.emptyBottleReturned = true;
    }),
  );
}

/** Demo: the second door opened and the full bottle was collected. */
export async function completeDistributorPickup(id: string) {
  await delay(900);
  return attempt(() =>
    mutateOrder(id, (order, account) => {
      if (!order.pickup) throw new Error("Commande sans retrait.");
      if (order.pickup.requiresEmptyBottleReturn && !order.pickup.emptyBottleReturned)
        throw new Error("Déposez d’abord votre bouteille vide.");
      order.pickup.collected = true;
      order.status = "collected";
      order.statusHistory.push({ status: "collected", at: new Date().toISOString() });
      pushNotification(account, {
        title: "Bouteille retirée",
        body: `Commande ${order.number} terminée. Merci d’avoir choisi Dispagaz.`,
        href: `/dispagaz/app/commandes/${order.id}`,
      });
    }),
  );
}
