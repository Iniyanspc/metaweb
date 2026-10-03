"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { PagesContent } from "@/lib/content/types";
import { contactSchema, fieldErrors, type ContactState, type FieldErrors } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { sendContact } from "./actions";

type Copy = PagesContent["contact"]["form"];

const control =
  "w-full rounded-[24px] border border-line bg-canvas px-5 py-3 text-body text-ink transition-colors duration-160 placeholder:text-muted " +
  "hover:border-ink focus-visible:border-ink focus-visible:shadow-(--focus-ring) aria-invalid:border-pink-ink";

/** Topics passed from links like /contact?topic=other-industry preselect a sensible answer. */
const TOPIC_INDUSTRY: Record<string, string> = {
  "other-industry": "Other",
  custom: "Other",
};

export function ContactForm({ copy }: { copy: Copy }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const topic = useSearchParams().get("topic") ?? "";
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errors = state.status === "invalid" ? { ...state.errors, ...clientErrors } : clientErrors;

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-card border border-line p-8 outline-none md:p-12">
        <span aria-hidden className="block size-3 rounded-full bg-ink" />
        <p className="mt-6 font-display text-h3">
          <PlaceholderText text={copy.success} />
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onSubmit={(e) => {
        const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
        if (!parsed.success) {
          e.preventDefault();
          const errs = fieldErrors(parsed.error);
          setClientErrors(errs);
          const first = Object.keys(errs)[0];
          formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        } else {
          setClientErrors({});
        }
      }}
      className="grid gap-6 sm:grid-cols-2"
    >
      <Field name="name" label={copy.name} error={errors.name}>
        {(p) => <input {...p} type="text" autoComplete="name" required className={control} />}
      </Field>
      <Field name="email" label={copy.email} error={errors.email}>
        {(p) => <input {...p} type="email" autoComplete="email" required className={control} />}
      </Field>
      <Field name="company" label={copy.company} error={errors.company}>
        {(p) => <input {...p} type="text" autoComplete="organization" required className={control} />}
      </Field>
      <Field name="jobTitle" label={copy.jobTitle} error={errors.jobTitle} optional>
        {(p) => <input {...p} type="text" autoComplete="organization-title" className={control} />}
      </Field>
      <Field name="industry" label={copy.industry} error={errors.industry}>
        {(p) => (
          <Select {...p} options={copy.industryOptions} defaultValue={TOPIC_INDUSTRY[topic] ?? ""} />
        )}
      </Field>
      <Field name="building" label={copy.building} error={errors.building}>
        {(p) => <Select {...p} options={copy.buildingOptions} defaultValue={topic === "product" ? "Not sure yet" : ""} />}
      </Field>
      <Field name="scope" label={copy.scope} error={errors.scope} className="sm:col-span-2">
        {(p) => <Select {...p} options={copy.scopeOptions} defaultValue="" />}
      </Field>
      <Field name="message" label={copy.message} error={errors.message} className="sm:col-span-2">
        {(p) => <textarea {...p} rows={6} required className={cn(control, "resize-y")} />}
      </Field>

      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="topic" value={topic} />

      <div className="flex flex-col gap-4 sm:col-span-2">
        {state.status === "error" && (
          <p role="alert" className="text-small text-pink-ink">
            <PlaceholderText text={copy.errorServer} />
          </p>
        )}
        <div>
          <button type="submit" disabled={pending} className={buttonClasses({ size: "lg" })}>
            {pending ? copy.sending : copy.submit}
          </button>
        </div>
      </div>
    </form>
  );
}

interface ControlProps {
  id: string;
  name: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

function Field({
  name,
  label,
  error,
  optional,
  className,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children({ id, name, ...(error ? { "aria-invalid": true, "aria-describedby": errorId } : {}) })}
      {error && (
        <p id={errorId} className="text-small text-pink-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({ options, defaultValue, ...props }: ControlProps & { options: string[]; defaultValue: string }) {
  return (
    <span className="relative block">
      <select {...props} defaultValue={defaultValue} required className={cn(control, "appearance-none pr-12")}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 12 12" className="pointer-events-none absolute top-1/2 right-5 size-3 -translate-y-1/2">
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
