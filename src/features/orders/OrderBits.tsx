import Link from "next/link";
import { CheckIcon, ChevronRightIcon } from "@/components/app/Icons";
import { formatDate, formatDateTime, formatMAD } from "@/lib/dispagaz/format";
import {
  cityLine,
  deliverySteps,
  fulfillmentLabels,
  orderStatusLabels,
} from "@/lib/dispagaz/labels";
import { appRoutes } from "@/lib/dispagaz/routes";
import type { Order, OrderStatus as Status } from "@/types/dispagaz";
import { cn } from "@/lib/cn";

export function orderProductLine(order: Order) {
  const item = order.items[0];
  return `${item.quantity} × ${item.brand} ${item.name}`;
}

export function StatusPill({ status }: { status: Status }) {
  const done = status === "delivered" || status === "collected";
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium whitespace-nowrap",
        status === "cancelled"
          ? "bg-dz-gray text-dz-muted"
          : done
            ? "bg-dz-teal-tint text-dz-teal"
            : "bg-dz-orange-tint text-dz-orange-ink",
      )}
    >
      {orderStatusLabels[status]}
    </span>
  );
}

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={appRoutes.orderDetail(order.id)}
      className="group flex items-center gap-4 rounded-[18px] border border-dz-line bg-white p-5 transition-[border-color,box-shadow] hover:border-dz-ink/25 hover:shadow-[0_10px_30px_-20px_rgb(0_0_0/0.3)]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-bold">{order.number}</p>
          <StatusPill status={order.status} />
        </div>
        <p className="mt-1.5 truncate text-[0.9375rem]">{orderProductLine(order)}</p>
        <p className="truncate text-sm text-dz-muted">
          {order.fulfillment === "pickup"
            ? `Point Dispagaz · ${order.distributor?.name ?? ""}`
            : `${fulfillmentLabels.delivery} · ${order.address ? cityLine(order.address) : ""}`}
        </p>
        <p className="mt-1 text-xs text-dz-subtle">{formatDate(order.createdAt)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <p className="font-bold tabular-nums">{formatMAD(order.total)}</p>
        <ChevronRightIcon className="text-dz-subtle transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

/** Minimal vertical progress for home deliveries. */
export function OrderStatusTimeline({ order }: { order: Order }) {
  const currentIndex = deliverySteps.indexOf(order.status);
  const atOf = (s: Status) => order.statusHistory.find((h) => h.status === s)?.at;
  return (
    <ol className="relative" aria-label="Suivi de la commande">
      {deliverySteps.map((step, i) => {
        const done = i < currentIndex || order.status === "delivered";
        const current = i === currentIndex && order.status !== "delivered";
        const at = atOf(step);
        return (
          <li
            key={step}
            className="relative flex gap-4 pb-6 last:pb-0"
            aria-current={current ? "step" : undefined}
          >
            {i < deliverySteps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-8 bottom-0 left-[13px] w-0.5",
                  done ? "bg-dz-teal" : "bg-dz-line",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                done && "border-dz-teal bg-dz-teal text-white",
                current && "border-dz-orange bg-white",
                !done && !current && "border-dz-line bg-white",
              )}
            >
              {done ? <CheckIcon width={14} height={14} strokeWidth={2.6} /> : null}
              {current ? <span className="h-2.5 w-2.5 rounded-full bg-dz-orange" /> : null}
            </span>
            <div className="pt-0.5">
              <p className={cn("font-medium", !done && !current && "text-dz-subtle")}>
                {orderStatusLabels[step]}
              </p>
              {at && (done || current) ? (
                <p className="text-sm text-dz-muted">{formatDateTime(at)}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Small checkout progress: "1 Mode · 2 Produit · 3 Adresse · 4 Paiement". */
export function CheckoutProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Étapes de la commande">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            className="flex min-w-0 flex-1 flex-col gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-1 rounded-full transition-colors duration-300",
                done || active ? "bg-dz-orange" : "bg-dz-gray",
              )}
            />
            <span
              className={cn(
                "truncate text-xs font-medium sm:text-sm",
                active ? "text-dz-ink" : "text-dz-subtle",
              )}
            >
              <span className="tabular-nums">{i + 1}</span> {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
