"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/Button";
import { services } from "@/lib/site";

type Field = "name" | "email" | "company" | "interest" | "message";
type Errors = Partial<Record<Field, string>>;

const initial = { name: "", email: "", company: "", interest: "", message: "" };

function validate(values: typeof initial): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Enter your name.";
  else if (values.name.trim().length > 120) errors.name = "Name must be 120 characters or fewer.";

  if (!values.email.trim()) errors.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Enter a valid email, for example you@company.com.";

  if (!values.company.trim()) errors.company = "Enter your company name.";

  if (!values.message.trim()) errors.message = "Tell us briefly what you are working on.";
  else if (values.message.trim().length < 20)
    errors.message = "Add a little more detail, at least 20 characters.";
  else if (values.message.length > 2000) errors.message = "Message must be 2,000 characters or fewer.";

  return errors;
}

/* `.field` carries every visual state (hover, invalid, disabled) — see globals.css. */
const fieldClass = "field";

export function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "failed">("idle");
  const [failure, setFailure] = useState("");
  /** Honeypot — hidden from people, irresistible to naive bots. */
  const [honeypot, setHoneypot] = useState("");

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Live-correct only once a field is already known invalid.
    if (errors[field]) {
      const next = validate({ ...values, [field]: value });
      setErrors((e) => ({ ...e, [field]: next[field] }));
    }
  };

  const blur = (field: Field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const next = validate(values);
    setErrors((e) => ({ ...e, [field]: next[field] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, company: true, message: true });

    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });

      if (res.status === 429) {
        setFailure("Too many messages just now. Please wait a minute and try again.");
        setStatus("failed");
        return;
      }

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus("sent");
      setValues(initial);
      setTouched({});
    } catch {
      setFailure("Something went wrong sending that. Please email sales@ease-plus.com directly.");
      setStatus("failed");
    }
  };

  const describedBy = (field: Field, hint?: string) =>
    [errors[field] && touched[field] ? `${field}-error` : null, hint ? `${field}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const errorFor = (field: Field) =>
    errors[field] && touched[field] ? (
      <p id={`${field}-error`} role="alert" className="text-sm text-danger">
        {errors[field]}
      </p>
    ) : null;

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        className="grid gap-[var(--spacing-6)] rounded-[var(--radius-sm)] border border-success
                   bg-raised p-[var(--spacing-10)]"
      >
        <span className="text-2xl" aria-hidden>
          ✓
        </span>
        <h2 className="t-h3 text-fg-strong">Message received</h2>
        <p className="t-body">
          Thank you. We will reply within one business day, usually sooner. For anything urgent,
          call the numbers listed on this page.
        </p>
        <div>
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-[var(--spacing-8)]">
      <div className="grid gap-[var(--spacing-8)] sm:grid-cols-2">
        <div className="grid gap-[var(--spacing-3)]">
          <label htmlFor="name" className="field-label">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name && touched.name)}
            aria-describedby={describedBy("name")}
            placeholder="Alex Tan"
            className={fieldClass}
            disabled={status === "loading"}
          />
          {errorFor("name")}
        </div>

        <div className="grid gap-[var(--spacing-3)]">
          <label htmlFor="email" className="field-label">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email && touched.email)}
            aria-describedby={describedBy("email", "hint")}
            placeholder="you@company.com"
            className={fieldClass}
            disabled={status === "loading"}
          />
          <p id="email-hint" className="field-hint">
            Use a company domain so we can route your enquiry.
          </p>
          {errorFor("email")}
        </div>
      </div>

      <div className="grid gap-[var(--spacing-8)] sm:grid-cols-2">
        <div className="grid gap-[var(--spacing-3)]">
          <label htmlFor="company" className="field-label">
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            onBlur={() => blur("company")}
            aria-invalid={Boolean(errors.company && touched.company)}
            aria-describedby={describedBy("company")}
            placeholder="Acme Commerce"
            className={fieldClass}
            disabled={status === "loading"}
          />
          {errorFor("company")}
        </div>

        <div className="grid gap-[var(--spacing-3)]">
          <label htmlFor="interest" className="field-label">
            Area of interest{" "}
            <span className="font-normal text-fg-muted">(optional)</span>
          </label>
          <select
            id="interest"
            name="interest"
            value={values.interest}
            onChange={(e) => set("interest", e.target.value)}
            className={`${fieldClass} cursor-pointer appearance-none`}
            disabled={status === "loading"}
          >
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-[var(--spacing-3)]">
        <label htmlFor="message" className="field-label">
          What are you working on?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errors.message && touched.message)}
          aria-describedby={describedBy("message", "hint")}
          placeholder="A short description of the platform, market, or payment problem you are facing."
          className={`${fieldClass} min-h-40 resize-y`}
          disabled={status === "loading"}
        />
        <p id="message-hint" className="field-hint">
          {values.message.length}/2000 characters
        </p>
        {errorFor("message")}
      </div>

      {/* Honeypot. Hidden from assistive tech and off the tab order, so only bots fill it. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-[var(--spacing-8)]">
        <Button type="submit" size="lg" loading={status === "loading"}>
          Send message
        </Button>

        <AnimatePresence>
          {status === "failed" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="text-sm text-danger"
            >
              {failure}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
