"use client";

import { useMemo, useState } from "react";
import { BottleImage } from "@/components/app/BottleImage";
import { Button } from "@/components/app/Button";
import { SegmentedControl, Toggle } from "@/components/app/Field";
import { MinusIcon, PlusIcon } from "@/components/app/Icons";
import { Drawer } from "@/components/app/Overlay";
import { demoConfig } from "@/data/config";
import { productCategories } from "@/data/products";
import { formatMAD } from "@/lib/dispagaz/format";
import { availabilityLabels } from "@/lib/dispagaz/labels";
import { productsAt } from "@/services/distributorService";
import { computeTotals, updateDraft } from "@/services/orderService";
import { selectProducts } from "@/services/productService";
import type {
  Distributor,
  Fulfillment,
  OrderDraft,
  Product,
  ProductCategory,
} from "@/types/dispagaz";
import { cn } from "@/lib/cn";

const categoryLabel = (c: ProductCategory) => productCategories.find((x) => x.id === c)?.label ?? c;

export function ProductCard({
  product,
  stock,
  onChoose,
}: {
  product: Product;
  /** Units available at the selected Point Dispagaz (pickup only). */
  stock?: number;
  onChoose: () => void;
}) {
  const unavailable = stock !== undefined ? stock <= 0 : product.availability === "out_of_stock";
  const availability =
    stock !== undefined
      ? `${stock} disponible${stock > 1 ? "s" : ""}`
      : availabilityLabels[product.availability];
  return (
    <article
      className={cn(
        "flex items-center gap-4 rounded-[18px] border border-dz-line bg-white p-4",
        unavailable && "opacity-60",
      )}
    >
      <div className="flex h-24 w-20 shrink-0 items-end justify-center rounded-[14px] bg-dz-surface pb-1.5">
        <BottleImage weightKg={product.weightKg} category={product.category} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-dz-muted">{product.brand}</p>
        <h2 className="font-bold">
          {categoryLabel(product.category)} {product.size}
        </h2>
        <p className="mt-1 font-bold tabular-nums">{formatMAD(product.price)}</p>
        <p
          className={cn(
            "text-xs",
            unavailable
              ? "text-dz-subtle"
              : product.availability === "limited" && stock === undefined
                ? "text-dz-orange-ink"
                : "text-dz-teal",
          )}
        >
          {availability}
        </p>
      </div>
      <Button
        variant="tertiary"
        className="h-11 shrink-0 px-4"
        disabled={unavailable}
        onClick={onChoose}
      >
        Choisir
      </Button>
    </article>
  );
}

function Stepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-dz-line hover:border-dz-ink/30 disabled:opacity-40"
      >
        <MinusIcon width={20} height={20} />
      </button>
      <output
        aria-live="polite"
        aria-label="Quantité"
        className="w-10 text-center text-2xl font-bold tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-dz-line hover:border-dz-ink/30 disabled:opacity-40"
      >
        <PlusIcon width={20} height={20} />
      </button>
    </div>
  );
}

export function TotalsRows({ draft }: { draft: OrderDraft }) {
  const totals = computeTotals(draft);
  if (!totals) return null;
  const rows: [string, string][] = [
    ["Prix unitaire", formatMAD(totals.unitPrice)],
    ["Quantité", String(totals.quantity)],
    ["Sous-total", formatMAD(totals.subtotal)],
  ];
  if (totals.depositTotal) rows.push(["Consigne", formatMAD(totals.depositTotal)]);
  if (draft.fulfillment === "delivery")
    rows.push(["Frais de livraison", formatMAD(totals.deliveryFee)]);
  return (
    <dl className="space-y-2.5">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between text-[0.9375rem]">
          <dt className="text-dz-muted">{label}</dt>
          <dd className="tabular-nums">{value}</dd>
        </div>
      ))}
      <div className="flex justify-between border-t border-dz-line pt-3 text-lg font-bold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatMAD(totals.total)}</dd>
      </div>
    </dl>
  );
}

export function ProductStep({
  fulfillment,
  distributor,
  draft,
  onContinue,
}: {
  fulfillment: Fulfillment;
  distributor?: Distributor;
  draft: OrderDraft;
  onContinue: () => void;
}) {
  const list = useMemo(
    () => (fulfillment === "pickup" && distributor ? productsAt(distributor) : selectProducts()),
    [fulfillment, distributor],
  );
  const categories = productCategories.filter((c) => list.some((p) => p.category === c.id));
  const selected = list.find((p) => p.id === draft.productId);
  const [category, setCategory] = useState<ProductCategory>(
    selected?.category ?? categories[0]?.id ?? "butane",
  );
  const [brand, setBrand] = useState<string>("all");
  const [choice, setChoice] = useState<{
    product: Product;
    quantity: number;
    exchange: boolean;
  } | null>(null);

  const inCategory = list.filter((p) => p.category === category);
  const brands = [...new Set(inCategory.map((p) => p.brand))];
  const shown = inCategory
    .filter((p) => brand === "all" || p.brand === brand)
    .sort((a, b) => a.weightKg - b.weightKg || a.price - b.price);
  const stockOf = (p: Product) => (distributor ? (distributor.inventory[p.id] ?? 0) : undefined);

  const maxQty = choice
    ? Math.min(demoConfig.maxQuantity, stockOf(choice.product) ?? demoConfig.maxQuantity)
    : demoConfig.maxQuantity;
  const previewDraft: OrderDraft | null = choice
    ? {
        ...draft,
        fulfillment,
        productId: choice.product.id,
        quantity: choice.quantity,
        exchangeEmptyBottle: choice.exchange,
      }
    : null;

  return (
    <div>
      <h1 className="text-[1.6rem] leading-tight font-bold tracking-[-0.025em] sm:text-[1.85rem]">
        Choisissez votre bouteille
      </h1>
      {distributor ? (
        <p className="mt-1.5 text-dz-muted">Bouteilles disponibles au point {distributor.name}.</p>
      ) : (
        <p className="mt-1.5 text-dz-muted">Prix indicatifs de démonstration.</p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {categories.length > 1 ? (
          <SegmentedControl<ProductCategory>
            label="Catégorie"
            value={category}
            onChange={(v) => {
              setCategory(v);
              setBrand("all");
            }}
            options={categories.map((c) => ({ value: c.id, label: c.label }))}
          />
        ) : null}
        {brands.length > 1 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Marque">
            {["all", ...brands].map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={brand === b}
                onClick={() => setBrand(b)}
                className={cn(
                  "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                  brand === b
                    ? "border-dz-ink bg-dz-ink text-white"
                    : "border-dz-line text-dz-muted hover:text-dz-ink",
                )}
              >
                {b === "all" ? "Toutes les marques" : b}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {shown.map((p) => (
          <li key={p.id}>
            <ProductCard
              product={p}
              stock={stockOf(p)}
              onChoose={() =>
                setChoice({
                  product: p,
                  quantity: p.id === draft.productId ? draft.quantity : 1,
                  exchange: p.id === draft.productId ? draft.exchangeEmptyBottle : true,
                })
              }
            />
          </li>
        ))}
      </ul>

      <Drawer
        open={choice !== null}
        onClose={() => setChoice(null)}
        title={
          choice
            ? `${choice.product.brand} · ${categoryLabel(choice.product.category)} ${choice.product.size}`
            : ""
        }
        description={choice ? `${formatMAD(choice.product.price)} la bouteille` : undefined}
        footer={
          <Button
            size="lg"
            block
            onClick={() => {
              if (!choice) return;
              updateDraft({
                fulfillment,
                productId: choice.product.id,
                quantity: Math.min(choice.quantity, maxQty),
                exchangeEmptyBottle: fulfillment === "pickup" ? true : choice.exchange,
              });
              setChoice(null);
              onContinue();
            }}
          >
            Continuer
          </Button>
        }
      >
        {choice && previewDraft ? (
          <div className="space-y-7">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium">Quantité</p>
              <Stepper
                value={choice.quantity}
                max={maxQty}
                onChange={(quantity) => setChoice({ ...choice, quantity })}
              />
            </div>
            {fulfillment === "delivery" ? (
              <Toggle
                checked={choice.exchange}
                onChange={(exchange) => setChoice({ ...choice, exchange })}
                label="J’échange une bouteille vide"
                description={
                  choice.exchange
                    ? "Le livreur récupère votre bouteille vide."
                    : `Sans bouteille vide, une consigne de ${formatMAD(choice.product.deposit)} par bouteille s’applique.`
                }
              />
            ) : (
              <p className="rounded-[14px] bg-dz-surface px-4 py-3 text-sm text-dz-muted">
                Au distributeur, vous déposez votre bouteille vide avant de récupérer la pleine.
              </p>
            )}
            <TotalsRows draft={previewDraft} />
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
