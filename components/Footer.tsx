"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUp, Check, LifeBuoy, Loader2, Mail, MessageCircle } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Content — replace "#" links and contact details with your own.      */
/* ------------------------------------------------------------------ */
const columns = [
  {
    title: "Product",
    links: [
      { label: "Mining rigs", href: "/shop" },
      { label: "Hosting", href: "/services#hosting" },
      { label: "Pool & payouts", href: "/services#pool" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
    //   { label: "Careers", href: "/careers" },
    //   { label: "Press", href: "/press" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "/contact" },
      { label: "Mining guides", href: "/faq" },
      { label: "FAQ", href: "/faq" },
    //   { label: "Blog", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie policy", href: "/cookies" },
      { label: "Risk disclosure", href: "/risk" },
    ],
  },
];

const contacts = [
  { icon: Mail, label: "Email us", detail: "hello@hanowallet.com", href: "mailto:hello@hanowallet.com" },
  { icon: MessageCircle, label: "Talk to sales", detail: "Book a call", href: "/contact" },
  { icon: LifeBuoy, label: "Get support", detail: "Help center", href: "/contact" },
];

const socials = [
  {
    label: "X",
    href: "#",
    path: "M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15.1V8.9l5.7 3.1-5.7 3.1z",
  },
  {
    label: "Telegram",
    href: "#",
    path: "M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.9-3.6-2.3 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.4 13 1.6 11.5c-1-.3-1-1 .2-1.5L20.6 2.8c.9-.3 1.6.2 1.3 1.5z",
  },
];

/* ------------------------------------------------------------------ */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const TEAL = "#5CCFB8";

// Path of your subscription route (app/api/subscribe/route.ts → "/api/subscribe").
// Change this if your route lives in a different folder.
const SUBSCRIBE_ENDPOINT = "/api/subscribe";

function useInView<T extends Element>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Link with an underline that draws in from the left on hover. */
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 text-[15px] text-white/65",
        "transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-white",
        "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CCFB8]",
        EASE,
      )}
    >
      {children}
    </Link>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address, like name@example.com.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json: { success?: boolean; message?: string } | null = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        setError(json?.message ?? "Something went wrong. Please try again later.");
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div
        role="status"
        className="flex animate-pop items-center gap-3 rounded-2xl border border-[#5CCFB8]/30 bg-[#5CCFB8]/10 p-4 motion-reduce:animate-none"
      >
        <span className="flex size-10 flex-none items-center justify-center rounded-full bg-[#5CCFB8] text-[#102F3B]">
          <Check className="size-5" strokeWidth={2.5} />
        </span>
        <span>
          <span className="block font-semibold text-white">You&rsquo;re on the list</span>
          <span className="text-sm text-white/65">Thanks for subscribing. We&rsquo;ll be in touch about once a month.</span>
        </span>
      </div>
    );
  }

  const invalid = status === "error";
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2.5">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <div
        className={clsx(
          "flex items-center mx-auto sm:gap-2 rounded-2xl border bg-white/[0.06] p-1.5 md:pl-4 max-md:px-2 transition-[border-color,box-shadow] duration-300",
          invalid
            ? "border-[#FCA5A5]/70 shadow-[0_0_0_4px_rgba(252,165,165,0.15)]"
            : "border-white/15 focus-within:border-[#5CCFB8] focus-within:shadow-[0_0_0_4px_rgba(92,207,184,0.18)]",
        )}
      >
        <Mail className="size-5 flex-none text-white/50" aria-hidden="true" />
        <input
          id="footer-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (invalid) setStatus("idle");
          }}
          aria-invalid={invalid}
          aria-describedby={invalid ? "footer-email-error" : "footer-email-hint"}
          className="h-11 min-w-0 sm:flex-1 bg-transparent text-[15px] text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group/sub inline-flex h-11 flex-none items-center gap-2 rounded-xl bg-[#5CCFB8] px-5 max-md:px-1 mx-auto text-sm font-semibold text-[#102F3B] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-80    border-hanosec border-2 hover:bg-transparent hover:text-hanosec dark:hover:text-white transition-all duration-500 cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Subscribing
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/sub:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      {invalid ? (
        <p id="footer-email-error" role="alert" className="text-sm text-[#FCA5A5]">
          {error}
        </p>
      ) : (
        <p id="footer-email-hint" className="text-sm text-white/50">
          About once a month. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */

export default function Footer() {
  const { ref, inView } = useInView<HTMLElement>();
  const wordRef = useRef<HTMLParagraphElement>(null);

  const moveSpot = (e: PointerEvent<HTMLDivElement>) => {
    const el = wordRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  const resetSpot = () => {
    wordRef.current?.style.setProperty("--x", "50%");
    wordRef.current?.style.setProperty("--y", "-40%");
  };

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const DELAYS: Record<number, string> = {
    0: "[animation-delay:0ms]",
    100: "[animation-delay:100ms]",
    200: "[animation-delay:200ms]",
    300: "[animation-delay:300ms]",
    400: "[animation-delay:400ms]",
    500: "[animation-delay:500ms]",
    600: "[animation-delay:600ms]",
  };
  const reveal = (d: keyof typeof DELAYS) =>
    clsx(inView ? "animate-rise" : "opacity-0", "motion-reduce:animate-none motion-reduce:opacity-100", DELAYS[d]);

  return (
    <footer ref={ref} aria-labelledby="footer-title" className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[32px] bg-[#0F2541] text-white">
        {/* texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        />

        <div className="relative mx-auto max-w-[1360px] px-6 pt-16 sm:px-10 sm:pt-20">
          {/* ---------------- Newsletter ---------------- */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className={clsx("lg:col-span-6", reveal(0))}>
              <h2 id="footer-title" className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.08] tracking-[-0.035em]">
                Stay ahead of every block
              </h2>
              <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/65">
                Mining insights, new hardware and hosting updates from the Hanowallet team, straight to your inbox.
              </p>
            </div>
            <div className={clsx("lg:col-span-5 lg:col-start-8", reveal(100))}>
              <Newsletter />
            </div>
          </div>

          {/* ---------------- Contact tiles ---------------- */}
          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            {contacts.map(({ icon: Icon, label, detail, href }, i) => (
              <Link
                key={label}
                href={href}
                className={clsx(
                  "group/tile relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-[background-color,border-color,transform] duration-300",
                  "hover:-translate-y-0.5 hover:border-[#5CCFB8]/40 hover:bg-white/[0.07]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CCFB8]",
                  EASE,
                  reveal(([200, 300, 400] as const)[i]),
                )}
              >
                <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-[#5CCFB8]/15 text-[#5CCFB8] transition-colors duration-300 group-hover/tile:bg-[#5CCFB8] group-hover/tile:text-[#102F3B]">
                  <Icon className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm text-white/60">{label}</span>
                  <span className="truncate font-semibold text-white">{detail}</span>
                </span>
                <ArrowRight
                  className={clsx(
                    "size-4 flex-none -translate-x-2 text-white/60 opacity-0 transition-all duration-300 group-hover/tile:translate-x-0 group-hover/tile:opacity-100",
                    EASE,
                  )}
                />
              </Link>
            ))}
          </div>

          {/* ---------------- Links ---------------- */}
          <div className="mt-16 grid gap-12 border-t border-white/10 pt-14 lg:grid-cols-12">
            <div className={clsx("flex flex-col gap-6 lg:col-span-4", reveal(300))}>
              <Link
                href="/"
                aria-label="Hanowallet home"
                className="group/logo flex w-fit items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CCFB8]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#1F4273] transition-transform duration-500 group-hover/logo:-rotate-6">
                  H
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  Hano<span className="text-[#5CCFB8]">wallet</span>
                </span>
              </Link>
              <p className="max-w-xs text-[15px] leading-relaxed text-white/65">
                Mining hardware, managed hosting and transparent payouts, designed especially for mining enthusiasts.
              </p>
              <ul className="flex gap-2" aria-label="Social media">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5CCFB8] hover:bg-[#5CCFB8] hover:text-[#102F3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CCFB8]"
                    >
                      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
              {columns.map((col, i) => (
                <div key={col.title} className={reveal(([300, 400, 500, 600] as const)[i])}>
                  <h3 className="text-sm font-semibold text-white">{col.title}</h3>
                  <ul className="mt-5 flex flex-col gap-3.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <FooterLink href={l.href}>{l.label}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* ---------------- Spotlight wordmark ---------------- */}
        <div
          onPointerMove={moveSpot}
          onPointerLeave={resetSpot}
          className="relative mx-auto mt-16 max-w-[1360px] select-none overflow-hidden px-4"
          aria-hidden="true"
        >
          <p
            ref={wordRef}
            className={clsx(
              "translate-y-[18%] bg-clip-text text-center text-[clamp(3.5rem,15.5vw,14rem)] font-bold leading-[0.85] tracking-[-0.065em] text-transparent",
              inView ? "animate-rise [animation-delay:500ms]" : "opacity-0",
              "motion-reduce:animate-none motion-reduce:opacity-100",
            )}
            style={{
              backgroundImage: `radial-gradient(circle 260px at var(--x, 50%) var(--y, -40%), ${TEAL}, rgba(92,207,184,0.35) 45%, rgba(255,255,255,0.09) 75%)`,
            }}
          >
            Hanowallet
          </p>
        </div>

        {/* ---------------- Bottom bar ---------------- */}
        <div className="relative border-t border-white/10 bg-[#0C1F37]">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-5 px-6 py-6 sm:px-10 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-white/70">© {new Date().getFullYear()} Hanowallet. All rights reserved.</p>
              <p className="max-w-2xl text-xs leading-relaxed text-white/50">
                Bitcoin mining involves financial risk. Rewards depend on network difficulty, Bitcoin&rsquo;s price and
                energy costs, and past results don&rsquo;t guarantee future earnings.
              </p>
            </div>
            <button
              type="button"
              onClick={toTop}
              className="group/top inline-flex h-11 w-fit flex-none items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5CCFB8]"
            >
              Back to top
              <ArrowUp className="size-4 transition-transform duration-300 group-hover/top:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}