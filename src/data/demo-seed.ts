import { demoConfig } from "@/data/config";
import { distributors } from "@/data/distributors";
import { products } from "@/data/products";
import {
  createId,
  createOrderNumber,
  createPickupCode,
  createReference,
} from "@/lib/dispagaz/format";
import type { Address, Order, OrderItem, OrderStatus, WalletTransaction } from "@/types/dispagaz";

/**
 * Demo history given to every new account after onboarding, so the app is
 * never empty: two past orders (one delivered, one collected at a Point
 * Dispagaz) and wallet movements ending on a 350,00 MAD balance.
 * All values are fictional demonstration data.
 */

const DAY = 86_400_000;

function item(productId: string, quantity: number): OrderItem {
  const p = products.find((x) => x.id === productId)!;
  return {
    productId: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    size: p.size,
    unitPrice: p.price,
    quantity,
  };
}

function history(start: number, statuses: OrderStatus[], stepMinutes: number) {
  return statuses.map((status, i) => ({
    status,
    at: new Date(start + i * stepMinutes * 60_000).toISOString(),
  }));
}

export function buildDemoHistory(now: number, address: Address) {
  const transactions: WalletTransaction[] = [];
  let balance = 0;
  const tx = (t: Omit<WalletTransaction, "id" | "balanceAfter">) => {
    balance += t.amount;
    transactions.unshift({ ...t, id: createId("txn"), balanceAfter: balance });
  };

  const t0 = now - 21 * DAY;
  tx({
    type: "recharge",
    amount: 30000,
    reference: createReference("RCH"),
    description: "Recharge par carte •••• 4242",
    createdAt: new Date(t0).toISOString(),
  });
  tx({
    type: "ajustement",
    amount: 10000,
    reference: createReference("ADJ"),
    description: "Crédit de bienvenue (démo)",
    createdAt: new Date(t0 + 60_000).toISOString(),
  });

  // Past home delivery
  const tA = now - 14 * DAY;
  const deliveryItem = item("atlas-butane-12", 1);
  const deliveryOrder: Order = {
    id: createId("ord"),
    number: createOrderNumber(new Date(tA)),
    createdAt: new Date(tA).toISOString(),
    fulfillment: "delivery",
    items: [deliveryItem],
    exchangeEmptyBottle: true,
    subtotal: deliveryItem.unitPrice,
    depositTotal: 0,
    deliveryFee: demoConfig.deliveryFee,
    total: deliveryItem.unitPrice + demoConfig.deliveryFee,
    payment: { method: "wallet", status: "paid", reference: createReference("WAL") },
    address: { ...address },
    status: "delivered",
    statusHistory: history(
      tA,
      ["received", "confirmed", "preparing", "out_for_delivery", "delivered"],
      35,
    ),
  };
  tx({
    type: "commande",
    amount: -deliveryOrder.total,
    reference: deliveryOrder.payment.reference,
    description: `Commande ${deliveryOrder.number}`,
    orderId: deliveryOrder.id,
    createdAt: deliveryOrder.createdAt,
  });

  // Past Point Dispagaz pickup
  const tB = now - 7 * DAY;
  const point = distributors[0];
  const pickupItem = item("atlas-butane-6", 1);
  const pickupOrder: Order = {
    id: createId("ord"),
    number: createOrderNumber(new Date(tB)),
    createdAt: new Date(tB).toISOString(),
    fulfillment: "pickup",
    items: [pickupItem],
    exchangeEmptyBottle: true,
    subtotal: pickupItem.unitPrice,
    depositTotal: 0,
    deliveryFee: 0,
    total: pickupItem.unitPrice,
    payment: { method: "wallet", status: "paid", reference: createReference("WAL") },
    distributor: { id: point.id, name: point.name, address: point.address, is24_7: point.is24_7 },
    pickup: {
      reference: createReference("RET"),
      code: createPickupCode(),
      expiresAt: new Date(tB + demoConfig.reservationHours * 3_600_000).toISOString(),
      requiresEmptyBottleReturn: true,
      emptyBottleReturned: true,
      collected: true,
    },
    status: "collected",
    statusHistory: history(tB, ["reserved", "collected"], 90),
  };
  tx({
    type: "commande",
    amount: -pickupOrder.total,
    reference: pickupOrder.payment.reference,
    description: `Commande ${pickupOrder.number}`,
    orderId: pickupOrder.id,
    createdAt: pickupOrder.createdAt,
  });

  tx({
    type: "recharge",
    amount: 5000,
    reference: createReference("RCH"),
    description: "Recharge par carte •••• 4242",
    createdAt: new Date(now - 3 * DAY).toISOString(),
  });

  return { orders: [pickupOrder, deliveryOrder], transactions, balance };
}
