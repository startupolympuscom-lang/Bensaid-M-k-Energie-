import { distributors as baseDistributors } from "@/data/distributors";
import { products } from "@/data/products";
import type { DemoDatabase, Distributor, Product } from "@/types/dispagaz";
import { attempt, delay, demoStore } from "@/services/storage";

/**
 * Points Dispagaz — automatic LPG distributors (mock).
 * Each point has latitude/longitude, address, distance, opening hours,
 * 24/7 flag, status and inventory. Later: Google Maps / Mapbox geolocation
 * and the distributor machine APIs (real-time stock and status).
 */

export function selectDistributors(db: DemoDatabase): Distributor[] {
  return baseDistributors
    .map((d) => {
      const delta = db.inventoryDelta[d.id] ?? {};
      const inventory = { ...d.inventory };
      for (const [productId, change] of Object.entries(delta)) {
        inventory[productId] = Math.max(0, (inventory[productId] ?? 0) + change);
      }
      return { ...d, inventory };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function selectDistributor(db: DemoDatabase, id: string | undefined) {
  return selectDistributors(db).find((d) => d.id === id);
}

/** Products in stock at a point. */
export function productsAt(distributor: Distributor): Product[] {
  return products.filter((p) => (distributor.inventory[p.id] ?? 0) > 0);
}

export function isPickupPossible(distributor: Distributor) {
  return distributor.status === "open" && productsAt(distributor).length > 0;
}

export async function getDistributors() {
  await delay(250);
  return attempt(() => selectDistributors(demoStore.read().db));
}

export async function getDistributor(id: string) {
  await delay(150);
  return attempt(() => {
    const distributor = selectDistributor(demoStore.read().db, id);
    if (!distributor) throw new Error("Point Dispagaz introuvable.");
    return distributor;
  });
}
