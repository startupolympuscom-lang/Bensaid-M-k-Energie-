"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "block w-full rounded-[14px] border bg-white px-4 text-base text-dz-ink placeholder:text-dz-subtle/80 transition-[border-color,box-shadow] duration-150 focus:border-dz-orange-strong focus:shadow-[0_0_0_3px_rgb(255_122_0/0.22)] focus:outline-none disabled:bg-dz-surface";

function controlClasses(error?: string) {
  return cn(control, error ? "border-dz-danger" : "border-dz-field hover:border-dz-muted");
}

type FieldShellProps = {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function FieldShell({ id, label, optional, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-dz-ink">
        {label}
        {optional ? <span className="font-normal text-dz-subtle"> · facultatif</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-dz-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-dz-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
  /** Element rendered inside the field, on the right (e.g. show password). */
  suffix?: ReactNode;
};

export function Input({
  label,
  optional,
  hint,
  error,
  containerClassName,
  className,
  suffix,
  ...props
}: InputProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      optional={optional}
      hint={hint}
      error={error}
      className={containerClassName}
    >
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(controlClasses(error), "h-13", suffix ? "pr-14" : undefined, className)}
          {...props}
        />
        {suffix ? (
          <div className="absolute inset-y-0 right-1.5 flex items-center">{suffix}</div>
        ) : null}
      </div>
    </FieldShell>
  );
}

type TextareaProps = Omit<ComponentProps<"textarea">, "id"> & {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export function Textarea({
  label,
  optional,
  hint,
  error,
  containerClassName,
  className,
  ...props
}: TextareaProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      optional={optional}
      hint={hint}
      error={error}
      className={containerClassName}
    >
      <textarea
        id={id}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(controlClasses(error), "resize-y py-3 leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  label: string;
  optional?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  containerClassName?: string;
};

export function Select({
  label,
  optional,
  error,
  options,
  containerClassName,
  className,
  ...props
}: SelectProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      optional={optional}
      error={error}
      className={containerClassName}
    >
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(controlClasses(error), "h-13 appearance-none pr-11", className)}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-dz-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </FieldShell>
  );
}

/** Checkbox with a large tap target. */
export function Checkbox({
  label,
  description,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: string; description?: string }) {
  return (
    <label className={cn("flex min-h-11 cursor-pointer items-start gap-3 py-1", className)}>
      <input
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-dz-field accent-dz-orange"
        {...props}
      />
      <span className="text-[0.9375rem] leading-snug">
        <span className="text-dz-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-sm text-dz-subtle">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/** Switch (role="switch"). */
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p id={`${id}-label`} className="text-[0.9375rem] text-dz-ink">
          {label}
        </p>
        {description ? (
          <p id={`${id}-desc`} className="mt-0.5 text-sm text-dz-subtle">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-desc` : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-dz-orange" : "bg-dz-field/60",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

/** Segmented control (radio group). */
export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  const name = useId();
  return (
    <fieldset className={className}>
      <legend className="sr-only">{label}</legend>
      <div className="inline-flex w-full rounded-[14px] bg-dz-gray p-1 sm:w-auto">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[11px] px-4 text-[0.9375rem] font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-dz-orange-strong sm:flex-none",
              value === o.value
                ? "bg-white text-dz-ink shadow-sm"
                : "text-dz-muted hover:text-dz-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
