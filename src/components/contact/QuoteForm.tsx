"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitQuote } from "@/app/contact/actions";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { activities } from "@/content/activities";
import { cn } from "@/lib/cn";
import {
  HONEYPOT_FIELD,
  QUOTE_FIELDS,
  initialQuoteState,
  readQuoteValues,
  validateQuote,
  type QuoteErrors,
  type QuoteField,
} from "@/lib/quote";

const inputBase =
  "block w-full rounded-xl border bg-white px-4 text-[1rem] text-ink placeholder:text-ink-subtle/80 transition-[border-color,box-shadow] duration-200 focus:outline-2 focus:outline-offset-0 focus:outline-teal focus:border-teal";

function inputClasses(hasError: boolean) {
  return cn(inputBase, hasError ? "border-error" : "border-field hover:border-ink-muted");
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-heading text-sm leading-5 font-medium text-ink"
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-orange-deep">
          {" "}
          *
        </span>
      ) : (
        <span className="font-sans leading-5 font-normal text-ink-subtle"> (facultatif)</span>
      )}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm leading-snug text-error">
      {message}
    </p>
  );
}

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(submitQuote, initialQuoteState);
  // Errors edited locally (client validation / cleared fields), tied to the current attempt.
  const [local, setLocal] = useState<{ attempt: number; errors: QuoteErrors } | null>(null);
  const [dismissedAttempt, setDismissedAttempt] = useState(-1);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const serverErrors: QuoteErrors = state.status === "invalid" ? state.errors : {};
  const errors: QuoteErrors =
    local && local.attempt === state.attempt ? local.errors : serverErrors;
  const values = state.status === "invalid" || state.status === "error" ? state.values : undefined;
  const errorCount = Object.values(errors).filter(Boolean).length;
  const showSuccess = state.status === "success" && dismissedAttempt !== state.attempt;

  // Move focus to the outcome after each server response.
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    else if (state.status === "invalid" || state.status === "error") summaryRef.current?.focus();
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const clientErrors = validateQuote(readQuoteValues(new FormData(form)));
    const first = QUOTE_FIELDS.find((field) => clientErrors[field]);
    if (first) {
      event.preventDefault();
      setLocal({ attempt: state.attempt, errors: clientErrors });
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    } else {
      setLocal(null);
    }
  }

  function clearError(name: string) {
    if (!(QUOTE_FIELDS as readonly string[]).includes(name)) return;
    const field = name as QuoteField;
    if (!errors[field]) return;
    setLocal({ attempt: state.attempt, errors: { ...errors, [field]: undefined } });
  }

  const describedBy = (field: QuoteField) => (errors[field] ? `${field}-error` : undefined);

  if (showSuccess) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-card border border-line bg-white p-8 outline-none sm:p-10"
      >
        <span aria-hidden="true" className="block h-[3px] w-8 rounded-full bg-teal" />
        <h3 className="type-h3 mt-6 text-[1.5rem]">Merci, votre demande a bien été envoyée.</h3>
        <p className="type-body mt-3">
          Notre équipe étudie votre besoin et revient vers vous dans les meilleurs délais.
        </p>
        <button
          type="button"
          onClick={() => setDismissedAttempt(state.attempt)}
          className="mt-8 font-heading text-[0.9375rem] font-medium text-ink underline decoration-orange decoration-2 underline-offset-[7px]"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      key={state.attempt}
      action={formAction}
      onSubmit={handleSubmit}
      onChange={(event) => {
        const target = event.target as unknown as { name?: unknown };
        if (typeof target.name === "string") clearError(target.name);
      }}
      noValidate
      aria-busy={pending}
      className="grid gap-x-5 gap-y-6 sm:grid-cols-2"
    >
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        className={cn(
          "outline-none sm:col-span-2",
          !(errorCount > 0 || state.status === "error") && "sr-only",
        )}
      >
        {state.status === "error" && !local ? (
          <p className="rounded-xl border border-error/30 bg-white px-4 py-3 text-[0.9375rem] text-error">
            {state.message}
          </p>
        ) : errorCount > 0 ? (
          <p className="rounded-xl border border-error/30 bg-white px-4 py-3 text-[0.9375rem] text-error">
            {errorCount === 1
              ? "Un champ doit être corrigé avant l’envoi."
              : `${errorCount} champs doivent être corrigés avant l’envoi.`}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="name" required>
          Nom complet
        </Label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          defaultValue={values?.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          className={cn(inputClasses(!!errors.name), "h-12")}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <div>
        <Label htmlFor="company">Entreprise</Label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={120}
          defaultValue={values?.company}
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={describedBy("company")}
          className={cn(inputClasses(!!errors.company), "h-12")}
        />
        <FieldError id="company-error" message={errors.company} />
      </div>

      <div>
        <Label htmlFor="phone" required>
          Téléphone
        </Label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={24}
          placeholder="06 12 34 56 78"
          defaultValue={values?.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy("phone")}
          className={cn(inputClasses(!!errors.phone), "h-12")}
        />
        <FieldError id="phone-error" message={errors.phone} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={160}
          defaultValue={values?.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email")}
          className={cn(inputClasses(!!errors.email), "h-12")}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <fieldset
        role="radiogroup"
        className="sm:col-span-2"
        aria-labelledby="need-legend"
        aria-describedby={describedBy("need")}
        aria-required="true"
        aria-invalid={errors.need ? true : undefined}
      >
        <legend
          id="need-legend"
          className="mb-3 font-heading text-sm leading-5 font-medium text-ink"
        >
          Type de besoin
          <span aria-hidden="true" className="text-orange-deep">
            {" "}
            *
          </span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {activities.map((activity) => (
            <label
              key={activity.id}
              className={cn(
                "inline-flex h-11 cursor-pointer items-center rounded-full border bg-white px-4.5 text-[0.9375rem] text-ink-soft transition-colors duration-200 select-none",
                "hover:border-ink-muted has-checked:border-charcoal has-checked:bg-charcoal has-checked:text-white",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal",
                errors.need ? "border-error" : "border-field",
              )}
            >
              <input
                type="radio"
                name="need"
                value={activity.id}
                defaultChecked={values?.need === activity.id}
                className="sr-only"
              />
              {activity.title}
            </label>
          ))}
        </div>
        <FieldError id="need-error" message={errors.need} />
      </fieldset>

      <div className="sm:col-span-2">
        <Label htmlFor="message" required>
          Message
        </Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          placeholder="Quantités, fréquence, lieu d’installation, délais…"
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          className={cn(inputClasses(!!errors.message), "resize-y py-3 leading-relaxed")}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot — hidden from people and assistive technologies */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Ne pas remplir ce champ</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-5 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[24rem] text-[0.8125rem] leading-relaxed text-ink-subtle">
          Les informations transmises sont utilisées uniquement pour répondre à votre demande.
        </p>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            buttonClasses("primary"),
            "w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto",
          )}
        >
          <span>{pending ? "Envoi en cours…" : "Envoyer la demande"}</span>
          {pending ? null : <ButtonArrow />}
        </button>
      </div>
    </form>
  );
}
