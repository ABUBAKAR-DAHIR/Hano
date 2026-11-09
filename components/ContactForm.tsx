"use client";

import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Topic = "rig" | "hosting" | "support" | "partnership" | "other";

const topics: { id: Topic; label: string }[] = [
  { id: "rig", label: "Buying a rig" },
  { id: "hosting", label: "Hosting" },
  { id: "support", label: "Support" },
  { id: "partnership", label: "Partnership" },
  { id: "other", label: "Something else" },
];

const fleetSizes = ["1–5 miners", "6–20 miners", "21–100 miners", "More than 100"];

// Matches the ids used in FeaturedRigs, so /contact?rig=s21-xp pre-fills the form.
const rigNames: Record<string, string> = {
  "s21-xp": "Antminer S21 XP",
  "s21-pro": "Antminer S21 Pro",
  "s21-hydro": "Antminer S21 Hydro",
  m60s: "Whatsminer M60S",
};

const MAX_MESSAGE = 1000;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ---------------- API ---------------- */
const API_URL = "/api/message";
const REQUEST_TIMEOUT_MS = 15_000;

// Form values → Prisma enum values expected by the API
const topicToApi: Record<Topic, string> = {
  rig: "BUYING_A_RIG",
  hosting: "HOSTING",
  support: "SUPPORT",
  partnership: "PARTNERSHIP",
  other: "OTHER",
};

const fleetToApi: Record<string, string> = {
  "1–5 miners": "ONE_TO_FIVE",
  "6–20 miners": "SIX_TO_TWENTY",
  "21–100 miners": "TWENTY_ONE_TO_ONE_HUNDRED",
  "More than 100": "OVER_ONE_HUNDRED",
};

type ApiResponse = {
  ok?: boolean;
  id?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function fallbackError(status: number) {
  if (status === 429) return "You've sent a few messages already. Please wait a few minutes and try again.";
  if (status >= 500) return "Our server ran into a problem. Please try again in a moment.";
  return "Something went wrong. Please try again.";
}

type Values = {
  name: string;
  email: string;
  company: string;
  fleet: string;
  message: string;
  consent: boolean;
};
type Field = keyof Values;

// API field names → form field names
const serverFieldMap: Record<string, Field> = {
  fullName: "name",
  email: "email",
  company: "company",
  minerCount: "fleet",
  message: "message",
  consent: "consent",
};

const fieldOrder: Field[] = ["name", "email", "company", "fleet", "message", "consent"];

function validate(v: Values, topic: Topic) {
  const e: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) e.name = "Enter your name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email address, like name@example.com.";
  if ((topic === "rig" || topic === "hosting") && !v.fleet) e.fleet = "Choose how many miners you're planning.";
  if (v.message.trim().length < 10) e.message = "Tell us a little more, at least 10 characters.";
  if (!v.consent) e.consent = "Agree to the privacy policy so we can reply.";
  return e;
}

const inputBase =
  "w-full rounded-xl border bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-200 focus:outline-none";
const inputOk = "border-border hover:border-muted-foreground/40 focus:border-primary focus:ring-4 focus:ring-primary/15";
const inputErr = "border-destructive focus:ring-4 focus:ring-destructive/15";

export default function ContactForm() {
  const params = useSearchParams();
  const rigParam = params.get("rig");
  const rigName = rigParam ? rigNames[rigParam] : undefined;

  const [topic, setTopic] = useState<Topic>("rig");
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    company: "",
    fleet: "",
    message: rigName ? `Hi! I'm interested in the ${rigName}. Could you send me pricing and availability?` : "",
    consent: false,
  });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot, invisible to people

  const errors = useMemo(() => validate(values, topic), [values, topic]);
  const show = (f: Field) => (touched[f] || submitted ? errors[f] : undefined) ?? serverErrors[f];
  const needsFleet = topic === "rig" || topic === "hosting";
  const sending = status === "sending";

  const set = <K extends Field>(k: K, v: Values[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    // Editing a field clears the server's error for it
    setServerErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };
  const blur = (f: Field) => setTouched((t) => ({ ...t, [f]: true }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;

    setSubmitted(true);
    setFormError(null);

    const firstBad = fieldOrder.find((f) => errors[f]);
    if (firstBad) {
      document.getElementById(`contact-${firstBad}`)?.focus();
      return;
    }

    setStatus("sending");
    const toastId = toast.loading("Sending your message…");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          topic: topicToApi[topic],
          fullName: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim() || undefined,
          minerCount: needsFleet ? fleetToApi[values.fleet] : undefined,
          message: values.message.trim(),
          consent: values.consent,
          website,
        }),
      });

      const data: ApiResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 422 && data.fieldErrors) {
          const mapped: Partial<Record<Field, string>> = {};
          for (const [key, msg] of Object.entries(data.fieldErrors)) {
            const field = serverFieldMap[key];
            if (field) mapped[field] ??= msg;
          }
          setServerErrors(mapped);
          const firstServerBad = fieldOrder.find((f) => mapped[f]);
          if (firstServerBad) document.getElementById(`contact-${firstServerBad}`)?.focus();
        }
        throw new Error(data.error ?? fallbackError(res.status));
      }

      toast.success("Message sent", {
        id: toastId,
        description: `We'll reply to ${values.email.trim()} within one business day.`,
      });
      setStatus("sent");
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? "The request took too long. Check your connection and try again."
          : err instanceof TypeError
            ? "We couldn't reach the server. Check your connection and try again."
            : err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.";

      setFormError(message);
      toast.error("Message not sent", { id: toastId, description: message });
      setStatus("idle");
    } finally {
      clearTimeout(timeout);
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", company: "", fleet: "", message: "", consent: false });
    setTouched({});
    setSubmitted(false);
    setServerErrors({});
    setFormError(null);
    setWebsite("");
    setStatus("idle");
  };

  const card =
    "rounded-[28px] border border-border bg-card p-6 shadow-[0_12px_32px_-14px_rgba(16,47,59,0.18)] dark:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.7)] sm:p-10";

  /* ---------------- Sent ---------------- */
  if (status === "sent") {
    return (
      <div className={clsx(card, "flex min-h-[560px] flex-col items-center justify-center text-center")} role="status">
        <span className="relative flex size-20 animate-pop items-center justify-center rounded-full bg-accent text-accent-foreground motion-reduce:animate-none">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary/40 motion-reduce:animate-none" />
          <Check className="relative size-9" strokeWidth={2.5} />
        </span>
        <h2 className="mt-8 animate-rise text-3xl font-bold tracking-tight text-card-foreground [animation-delay:150ms] motion-reduce:animate-none">
          Message sent
        </h2>
        <p className="mt-3 max-w-sm animate-rise text-[17px] leading-relaxed text-muted-foreground [animation-delay:250ms] motion-reduce:animate-none">
          Thanks, {values.name.split(" ")[0]}. We&rsquo;ll reply to <span className="font-medium text-foreground">{values.email}</span>{" "}
          within one business day.
        </p>
        <div className="mt-8 flex animate-rise flex-wrap justify-center gap-3 [animation-delay:350ms] motion-reduce:animate-none">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center rounded-xl border border-border px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Send another message
          </button>
          <Link
            href="/shop"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950 border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
          >
            Browse mining rigs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- Form ---------------- */
  const errorText = (f: Field) =>
    show(f) ? (
      <p id={`contact-${f}-error`} className="mt-2 animate-swap text-sm text-destructive motion-reduce:animate-none">
        {show(f)}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={sending} className={card} aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="text-2xl font-bold tracking-tight text-card-foreground">
        Send us a message
      </h2>
      <p className="mt-2 text-[15px] text-muted-foreground">Fields marked with * are required.</p>

      {/* Honeypot: hidden from people and screen readers, bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Topic */}
      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-card-foreground">What can we help with?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label key={t.id} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t.id}
                checked={topic === t.id}
                onChange={() => setTopic(t.id)}
                className="peer sr-only"
              />
              <span
                className={clsx(
                  "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-300",
                  EASE,
                  "border-border text-muted-foreground hover:border-primary/50",
                  "hover:border-primary border-transparent hover:border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500",
                  "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground dark:peer-checked:text-neutral-950",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                )}
              >
                {topic === t.id && <Check className="size-4 animate-pop motion-reduce:animate-none" strokeWidth={2.5} />}
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="text-sm font-semibold text-card-foreground">
            Full name *
          </label>
          <input
            id="contact-name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={!!show("name")}
            aria-describedby={show("name") ? "contact-name-error" : undefined}
            placeholder="Your full name"
            className={clsx(inputBase, "mt-2 h-12", show("name") ? inputErr : inputOk)}
          />
          {errorText("name")}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="text-sm font-semibold text-card-foreground">
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={!!show("email")}
            aria-describedby={show("email") ? "contact-email-error" : undefined}
            placeholder="you@example.com"
            className={clsx(inputBase, "mt-2 h-12", show("email") ? inputErr : inputOk)}
          />
          {errorText("email")}
        </div>

        {/* Company */}
        <div className={needsFleet ? "" : "sm:col-span-2"}>
          <label htmlFor="contact-company" className="text-sm font-semibold text-card-foreground">
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="contact-company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            aria-invalid={!!show("company")}
            aria-describedby={show("company") ? "contact-company-error" : undefined}
            className={clsx(inputBase, "mt-2 h-12", show("company") ? inputErr : inputOk)}
          />
          {errorText("company")}
        </div>

        {/* Fleet size — only for buying / hosting */}
        {needsFleet && (
          <div className="animate-swap motion-reduce:animate-none">
            <label htmlFor="contact-fleet" className="text-sm font-semibold text-card-foreground">
              How many miners? *
            </label>
            <div className="relative mt-2">
              <select
                id="contact-fleet"
                value={values.fleet}
                onChange={(e) => set("fleet", e.target.value)}
                onBlur={() => blur("fleet")}
                aria-invalid={!!show("fleet")}
                aria-describedby={show("fleet") ? "contact-fleet-error" : undefined}
                className={clsx(
                  inputBase,
                  "h-12 cursor-pointer appearance-none pr-10",
                  !values.fleet && "text-muted-foreground",
                  show("fleet") ? inputErr : inputOk,
                )}
              >
                <option value="" disabled>
                  Choose a range
                </option>
                {fleetSizes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errorText("fleet")}
          </div>
        )}

        {/* Message */}
        <div className="sm:col-span-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="contact-message" className="text-sm font-semibold text-card-foreground">
              Message *
            </label>
            <span
              className={clsx(
                "text-xs tabular-nums",
                values.message.length > MAX_MESSAGE * 0.9 ? "text-destructive" : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {values.message.length}/{MAX_MESSAGE}
            </span>
          </div>
          <textarea
            id="contact-message"
            rows={6}
            maxLength={MAX_MESSAGE}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={!!show("message")}
            aria-describedby={show("message") ? "contact-message-error" : undefined}
            placeholder="Tell us about your goals, budget or the rig you're interested in."
            className={clsx(inputBase, "mt-2 resize-y py-3 leading-relaxed", show("message") ? inputErr : inputOk)}
          />
          {errorText("message")}
        </div>
      </div>

      {/* Consent */}
      <div className="mt-6">
        <label className="group/consent flex cursor-pointer items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            onBlur={() => blur("consent")}
            aria-invalid={!!show("consent")}
            aria-describedby={show("consent") ? "contact-consent-error" : undefined}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={clsx(
              "mt-0.5 flex size-5 flex-none items-center justify-center rounded-md border-2 transition-colors duration-200",
              "peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
              show("consent") ? "border-destructive" : "border-border group-hover/consent:border-primary/60",
            )}
          >
            <Check
              className={clsx(
                "size-3.5 text-primary-foreground transition-transform duration-200 dark:text-neutral-950",
                values.consent ? "scale-100" : "scale-0",
              )}
              strokeWidth={3}
            />
          </span>
          <span className="text-sm leading-relaxed text-muted-foreground">
            I agree to the{" "}
            <Link href="/privacy" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
              privacy policy
            </Link>{" "}
            and to Hanowallet contacting me about this request. *
          </span>
        </label>
        {errorText("consent")}
      </div>

      {/* Request error (network, rate limit, server) */}
      {formError && (
        <div
          role="alert"
          className="mt-6 flex animate-swap items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive motion-reduce:animate-none"
        >
          <AlertCircle className="mt-0.5 size-4 flex-none" />
          <p>{formError}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">We reply within one business day.</p>
        <button
          type="submit"
          disabled={sending}
          className="group/send inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(31,66,115,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 dark:text-neutral-950 sm:w-auto border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500 cursor-pointer"
        >
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending message
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/send:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}