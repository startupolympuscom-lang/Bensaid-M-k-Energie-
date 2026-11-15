import { products } from "@/data/products";
import type { Product, ProductCategory } from "@/types/dispagaz";
import { attempt, delay } from "@/services/storage";

/**
 * LPG catalog (mock, from data/products.ts). Later: catalog / pricing API.
 * `select*` functions are synchronous selectors used by the UI.
 */

export function selectProducts(filter?: { category?: ProductCategory; brand?: string }): Product[] {
  return products.filter(
    (p) =>
      (!filter?.category || p.category === filter.category) &&
      (!filter?.brand || p.brand === filter.brand),
  );
}

export function selectProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}

export function selectBrands(category?: ProductCategory): string[] {
  return [...new Set(selectProducts({ category }).map((p) => p.brand))];
}

export async function getProducts(filter?: { category?: ProductCategory; brand?: string }) {
  await delay(200);
  return attempt(() => selectProducts(filter));
}

export async function getProduct(id: string) {
  await delay(150);
  return attempt(() => {
    const product = selectProduct(id);
    if (!product) throw new Error("Produit introuvable.");
    return product;
  });
}
