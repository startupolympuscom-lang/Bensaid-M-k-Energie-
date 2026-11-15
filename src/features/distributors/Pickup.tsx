"use client";

import { useState } from "react";
import { Button } from "@/components/app/Button";
import { CheckIcon } from "@/components/app/Icons";
import { useToast } from "@/components/app/Toast";
import { formatDateTime } from "@/lib/dispagaz/format";
import {
  completeDistributorPickup,
  confirmEmptyBottleReturn,
  confirmTerminalPayment,
} from "@/services/orderService";
import type { Order } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------ QR placeholder */

/** Deterministic QR-like pattern from the code (placeholder, not scannable). */
export function QrPlaceholder({ seed, className }: { seed: string; className?: string }) {
  const n = 25;
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const next = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const cells: string[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!finder(x, y) && next() > 0.52) cells.push(`M${x} ${y}h1v1h-1z`);
  const eye = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#0D0D0D" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0D0D0D" />
    </g>
  );
  return (
    <svg
      viewBox={`-2 -2 ${n + 4} ${n + 4}`}
      className={cn("rounded-[12px] bg-white", className)}
      role="img"
      aria-label="QR code de retrait (démonstration)"
    >
      <path d={cells.join("")} fill="#0D0D0D" />
      {eye(0, 0)}
      {eye(n - 7, 0)}
      {eye(0, n - 7)}
    </svg>
  );
}

/* ------------------------------------------------------------ pickup code */

export function PickupCodeCard({ order }: { order: Order }) {
  if (!order.pickup) return null;
  const code = order.pickup.code;
  return (
    <section
      aria-label="Code de retrait"
      className="rounded-[22px] bg-dz-ink p-6 text-white sm:p-7"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <QrPlaceholder seed={order.pickup.reference + code} className="h-36 w-36 shrink-0 p-1.5" />
        <div className="text-center sm:text-left">
          <p className="text-sm text-white/65">Code de retrait</p>
          <p className="mt-1 text-[2.4rem] leading-none font-bold tracking-[0.12em] tabular-nums">
            {code.slice(0, 3)} {code.slice(3)}
          </p>
          <p className="mt-3 text-sm text-white/65">Référence {order.pickup.reference}</p>
          <p className="text-sm text-white/65">
            Réservée jusqu’au {formatDateTime(order.pickup.expiresAt)}
          </p>
          <p className="mt-2 text-xs text-white/45">QR code de démonstration</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ instructions */

const steps = [
  "Rendez-vous au point Dispagaz sélectionné.",
  "Scannez votre QR code ou saisissez votre code de retrait.",
  "Une première porte s’ouvre.",
  "Déposez votre bouteille GPL vide.",
  "Le système confirme la restitution.",
  "Une deuxième porte s’ouvre.",
  "Récupérez votre bouteille pleine.",
  "La transaction est terminée.",
];

export function PickupInstructions({ className }: { className?: string }) {
  return (
    <section aria-labelledby="pickup-howto" className={className}>
      <h2 id="pickup-howto" className="text-lg font-bold tracking-[-0.01em]">
        Comment retirer votre bouteille ?
      </h2>
      <ol className="mt-5 space-y-3.5">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-4">
            <span
              aria-hidden="true"
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                i === 3 || i === 6 ? "bg-dz-orange text-dz-ink" : "bg-dz-gray text-dz-ink",
              )}
            >
              {i + 1}
            </span>
            <span className="pt-0.5 text-[0.9375rem]">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-dz-muted">
        Points Dispagaz accessibles 24h/24 et 7j/7 lorsque indiqué.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------ exchange */

type DoorState = "locked" | "active" | "done";

function Door({
  index,
  title,
  caption,
  state,
}: {
  index: number;
  title: string;
  caption: string;
  state: DoorState;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-36 flex-col justify-between rounded-[18px] border-2 p-4 transition-colors duration-300",
        state === "done" && "border-dz-teal bg-dz-teal-tint",
        state === "active" && "border-dz-orange bg-dz-orange-tint/60",
        state === "locked" && "border-dz-line bg-dz-surface",
      )}
    >
      <p className="text-xs font-medium tracking-[0.08em] text-dz-muted uppercase">Porte {index}</p>
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-0.5 text-sm text-dz-muted">{caption}</p>
      </div>
      {state === "done" ? (
        <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-dz-teal text-white">
          <CheckIcon width={16} height={16} strokeWidth={2.4} />
        </span>
      ) : null}
    </div>
  );
}

/**
 * Empty bottle exchange at the automatic distributor (demo simulation):
 * the customer returns the empty bottle (door 1) before the full bottle is
 * released (door 2). Driven by `requiresEmptyBottleReturn` / `emptyBottleReturned`.
 */
export function EmptyBottleExchange({ order }: { order: Order }) {
  const toast = useToast();
  const [busy, setBusy] = useState<"pay" | "return" | "collect" | null>(null);
  const pickup = order.pickup;
  if (!pickup) return null;

  const payPending = order.payment.status === "to_pay_at_terminal";
  const returned = pickup.emptyBottleReturned;
  const collected = pickup.collected;

  async function run(kind: "pay" | "return" | "collect") {
    setBusy(kind);
    const fn =
      kind === "pay"
        ? confirmTerminalPayment
        : kind === "return"
          ? confirmEmptyBottleReturn
          : completeDistributorPickup;
    const result = await fn(order.id);
    setBusy(null);
    if (!result.ok) return toast(result.error, "error");
    toast(
      kind === "pay"
        ? "Paiement accepté au terminal."
        : kind === "return"
          ? "Restitution confirmée : la deuxième porte s’ouvre."
          : "Bouteille récupérée. Merci !",
      "success",
    );
  }

  return (
    <section
      aria-labelledby="exchange-title"
      className="rounded-[22px] border border-dz-line p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="exchange-title" className="text-lg font-bold tracking-[-0.01em]">
          Échange au distributeur
        </h2>
        <span className="rounded-full bg-dz-orange-tint px-2.5 py-1 text-xs font-medium text-dz-orange-ink">
          Simulation
        </span>
      </div>
      <p className="mt-1 text-[0.9375rem] text-dz-muted">
        Déposez votre bouteille vide pour libérer votre bouteille pleine.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3" aria-live="polite">
        <Door
          index={1}
          title="Bouteille vide"
          caption={
            returned ? "Restitution confirmée" : payPending ? "Après paiement" : "Déposez-la ici"
          }
          state={returned ? "done" : payPending ? "locked" : "active"}
        />
        <Door
          index={2}
          title="Bouteille pleine"
          caption={collected ? "Récupérée" : returned ? "Porte ouverte" : "Verrouillée"}
          state={collected ? "done" : returned ? "active" : "locked"}
        />
      </div>

      <div className="mt-5">
        {collected ? (
          <p className="text-center font-medium text-dz-teal" role="status">
            Transaction terminée.
          </p>
        ) : payPending ? (
          <Button
            block
            size="lg"
            variant="secondary"
            onClick={() => run("pay")}
            loading={busy === "pay"}
            loadingLabel="Paiement au terminal…"
          >
            Simuler le paiement au terminal
          </Button>
        ) : !returned ? (
          <Button
            block
            size="lg"
            variant="secondary"
            onClick={() => run("return")}
            loading={busy === "return"}
            loadingLabel="Vérification de la bouteille…"
          >
            Simuler le dépôt de la bouteille vide
          </Button>
        ) : (
          <Button
            block
            size="lg"
            onClick={() => run("collect")}
            loading={busy === "collect"}
            loadingLabel="Ouverture de la porte…"
          >
            Récupérer ma bouteille pleine
          </Button>
        )}
      </div>
    </section>
  );
}
