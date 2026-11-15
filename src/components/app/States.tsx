import type { ReactNode } from "react";
import { CheckIcon } from "@/components/app/Icons";
import { Spinner } from "@/components/app/Button";
import { cn } from "@/lib/cn";

export function LoadingState({
  label = "Chargement…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn("flex min-h-[40vh] items-center justify-center gap-3 text-dz-muted", className)}
    >
      <Spinner className="text-dz-orange" />
      <span className="text-[0.9375rem]">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
  className,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[20px] bg-dz-surface px-6 py-12 text-center", className)}>
      <p className="text-lg font-bold tracking-[-0.01em]">{title}</p>
      {text ? <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] text-dz-muted">{text}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Confirmation screen: check mark, title, details, actions. */
export function SuccessState({
  title,
  text,
  children,
  actions,
}: {
  title: string;
  text?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="dz-step-in mx-auto max-w-lg text-center" aria-live="polite">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dz-teal-tint text-dz-teal">
        <CheckIcon width={30} height={30} strokeWidth={2.2} />
      </span>
      <h1 className="mt-6 text-[1.85rem] leading-tight font-bold tracking-[-0.025em]">{title}</h1>
      {text ? <p className="mx-auto mt-2 max-w-sm text-dz-muted">{text}</p> : null}
      {children ? <div className="mt-8 text-left">{children}</div> : null}
      {actions ? <div className="mt-8 flex flex-col gap-3">{actions}</div> : null}
    </section>
  );
}

/** Label/value rows used in summaries. */
export function DetailList({
  rows,
  className,
}: {
  rows: [string, ReactNode][];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "divide-y divide-dz-line rounded-[18px] border border-dz-line bg-white",
        className,
      )}
    >
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-6 px-5 py-3.5">
          <dt className="text-[0.9375rem] text-dz-muted">{label}</dt>
          <dd className="text-right text-[0.9375rem] font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-bold tracking-[-0.025em] lg:text-[2rem]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1.5 text-dz-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
