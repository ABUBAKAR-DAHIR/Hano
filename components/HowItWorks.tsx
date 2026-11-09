"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Cpu,
  Lock,
  Mail,
  Minus,
  Pause,
  Play,
  Plus,
  Server,
  UserPlus,
  Wallet,
} from "lucide-react";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const STEP_MS = 6500; // time per step while auto-playing

type Step = {
  short: string;
  title: string;
  body: string;
  points: string[];
  icon: typeof UserPlus;
  cta: { label: string; href: string };
  visual: () => ReactNode;
};

const steps: Step[] = [
  {
    short: "Create account",
    title: "Create your account",
    body: "Sign up in a few minutes and connect your Hanowallet, so every reward you mine has a safe place to land.",
    points: ["Quick email sign-up", "Connect your Hanowallet for payouts", "Manage everything in one place"],
    icon: UserPlus,
    cta: { label: "Create account", href: "/register" },
    visual: () => <AccountVisual />,
  },
  {
    short: "Pick a plan",
    title: "Choose your subscription",
    body: "Pick the hosting plan that matches how many miners you want to run. It covers the space and care your hardware needs.",
    points: ["Plans for one miner or a whole fleet", "Rack space, cooling and monitoring", "Upgrade as you grow"],
    icon: BadgeCheck,
    cta: { label: "Compare plans", href: "/services#hosting" },
    visual: () => <PlanVisual />,
  },
  {
    short: "Buy a rig",
    title: "Choose and buy your rig",
    body: "Compare hashrate, efficiency and power draw, then buy the miner that fits your goals and budget.",
    points: ["Leading models from Bitmain and MicroBT", "Clear specs, side by side", "Expert help when choosing"],
    icon: Cpu,
    cta: { label: "Browse rigs", href: "/shop" },
    visual: () => <RigVisual />,
  },
  {
    short: "We host it",
    title: "We host and set it up",
    body: "Your miner goes to our facility, where it's installed, configured and connected to a pool. No noise, heat or wiring at home.",
    points: ["Installed and configured for you", "Connected to a mining pool", "Monitored and maintained"],
    icon: Server,
    cta: { label: "About hosting", href: "/services#hosting" },
    visual: () => <HostingVisual />,
  },
  {
    short: "Start earning",
    title: "Start earning",
    body: "Follow your miner's performance and receive rewards straight to your Hanowallet, with every payout on record.",
    points: ["Rewards sent to your wallet", "Every payout recorded", "Track performance anytime"],
    icon: Wallet,
    cta: { label: "How payouts work", href: "/services#pool" },
    visual: () => <EarnVisual />,
  },
];

/* ------------------------------------------------------------------ */

function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function HowItWorks() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) setUserPaused(true);
  }, []);

  const playing = inView && !hovering && !userPaused;

  const go = useCallback((i: number) => setActive((i + steps.length) % steps.length), []);

  /* auto-advance with a progress bar on the active tab */
  const elapsed = useRef(0);
  useEffect(() => {
    elapsed.current = 0;
  }, [active]);
  useEffect(() => {
    barRefs.current.forEach((b, i) => {
      if (b) b.style.width = i < active ? "100%" : i === active ? `${(elapsed.current / STEP_MS) * 100}%` : "0%";
    });
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      elapsed.current += t - last;
      last = t;
      const p = Math.min(1, elapsed.current / STEP_MS);
      const bar = barRefs.current[active];
      if (bar) bar.style.width = `${p * 100}%`;
      if (p >= 1) {
        go(active + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, playing, go]);

  /* sliding highlight behind the active tab */
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      if (!el) return;
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
      // keep the active tab visible on small screens without scrolling the page
      const list = el.parentElement;
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: el.offsetLeft - 12, behavior: "smooth" });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(id);
    };
  }, [active]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + steps.length) % steps.length;
    go(next);
    tabRefs.current[next]?.focus();
  };

  const reveal = (delay: number) => ({
    className: clsx(seen ? "animate-rise" : "opacity-0", "motion-reduce:animate-none motion-reduce:opacity-100"),
    style: { animationDelay: `${delay}ms` },
  });

  const step = steps[active];
  const Icon = step.icon;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-title"
      className="relative overflow-hidden bg-background py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-6">
        {/* ---------------- Header ---------------- */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span
            {...reveal(0)}
            className={clsx(reveal(0).className, "inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground")}
          >
            How it works
          </span>
          <h2
            id="how-title"
            {...reveal(80)}
            className={clsx(
              reveal(80).className,
              "mt-5 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.035em] text-foreground",
            )}
          >
            From sign-up to your first payout <span className="text-primary">in five steps</span>
          </h2>
          <p {...reveal(160)} className={clsx(reveal(160).className, "mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg")}>
            We take care of the hardware, hosting and setup, so you can focus on the results.
          </p>
        </div>

        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)}
          onBlurCapture={() => setHovering(false)}
        >
          {/* ---------------- Stepper ---------------- */}
          <div {...reveal(240)} className={clsx(reveal(240).className, "mt-12 flex items-center gap-2")}>
            <div
              role="tablist"
              aria-label="Steps to start mining"
              onKeyDown={onTabKey}
              className="relative flex flex-1 gap-1 overflow-x-auto rounded-[22px] border border-border bg-card p-1.5 shadow-[0_10px_28px_-18px_rgba(16,47,59,0.35)] [scrollbar-width:none] dark:shadow-[0_10px_28px_-18px_rgba(0,0,0,0.7)]"
            >
              {pill && (
                <span
                  aria-hidden="true"
                  className={clsx("absolute inset-y-1.5 rounded-2xl bg-accent", ready && `transition-[left,width] duration-500 ${EASE}`)}
                  style={{ left: pill.left, width: pill.width }}
                />
              )}
              {steps.map((s, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <button
                    key={s.short}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`how-tab-${i}`}
                    aria-selected={on}
                    aria-controls="how-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    className="group relative flex min-w-[150px] flex-1 flex-col gap-2.5 rounded-2xl px-3.5 pb-3 pt-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={clsx(
                          "flex size-7 flex-none items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-all duration-500",
                          EASE,
                          on && "scale-110 bg-primary text-primary-foreground dark:text-neutral-950",
                          done && "bg-primary/15 text-primary",
                          !on && !done && "bg-muted text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      <span
                        className={clsx(
                          "truncate text-sm font-semibold transition-colors duration-300",
                          on ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {s.short}
                      </span>
                    </span>
                    <span className="h-1 w-full overflow-hidden rounded-full bg-border/70" aria-hidden="true">
                      <span
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        className="block h-full w-0 rounded-full bg-primary"
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {!reduced && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play steps automatically" : "Pause automatic steps"}
                className="hidden size-12 flex-none items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
              >
                {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            )}
          </div>

          {/* ---------------- Panel ---------------- */}
          <div
            id="how-panel"
            role="tabpanel"
            aria-labelledby={`how-tab-${active}`}
            {...reveal(320)}
            className={clsx(
              reveal(320).className,
              "mt-4 grid overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_24px_60px_-34px_rgba(16,47,59,0.5)] dark:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.85)] lg:grid-cols-[1fr_1.1fr]",
            )}
          >
            {/* text */}
            <div key={`text-${active}`} className="flex animate-swap flex-col p-7 motion-reduce:animate-none sm:p-10 lg:p-12">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground">
                  STEP {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-6 text-[clamp(1.6rem,2.6vw,2.1rem)] font-bold leading-tight tracking-[-0.03em] text-card-foreground">
                {step.title}
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground sm:text-base">{step.body}</p>

              <ul className="mt-6 flex flex-col gap-3">
                {step.points.map((p, i) => (
                  <li
                    key={p}
                    className="flex animate-rise items-center gap-3 text-[15px] text-card-foreground motion-reduce:animate-none"
                    style={{ animationDelay: `${150 + i * 90}ms` }}
                  >
                    <span className="flex size-5 flex-none items-center justify-center rounded-full bg-secondary text-[#102F3B] dark:bg-chart-3">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-9">
                <Link
                  href={step.cta.href}
                  className="group/cta inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(31,66,115,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950"
                >
                  {step.cta.label}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                </Link>
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(active - 1)}
                    aria-label="Previous step"
                    className="flex size-12 items-center justify-center rounded-xl border border-border text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(active + 1)}
                    aria-label="Next step"
                    className="flex size-12 items-center justify-center rounded-xl border border-border text-foreground transition-all duration-300 hover:translate-x-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* visual */}
            <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_13%,transparent)_1px,transparent_1px)] p-6 [background-size:20px_20px] sm:min-h-[460px] sm:p-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border-[28px] border-card/40"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full border-[20px] border-card/30"
              />
              <div key={`visual-${active}`} className="relative flex w-full animate-swap justify-center motion-reduce:animate-none">
                {seen && step.visual()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Step visuals — product-style UI cards. Names and figures are samples */
/* ================================================================== */

const card =
  "w-full max-w-[360px] rounded-[22px] border border-border bg-card p-5 shadow-[0_18px_40px_-20px_rgba(16,47,59,0.4)] dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]";

function AccountVisual() {
  return (
    <div className={card}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#1F4273] font-bold text-white">H</span>
        <div>
          <p className="text-[15px] font-semibold text-card-foreground">Welcome to Hanowallet</p>
          <p className="text-xs text-muted-foreground">Create your account</p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <span className="flex h-11 animate-rise items-center gap-2.5 rounded-xl border border-border px-3 text-sm text-card-foreground [animation-delay:150ms] motion-reduce:animate-none">
          <Mail className="size-4 text-muted-foreground" />
          you@example.com
          <span className="h-4 w-px animate-pulse bg-primary" />
        </span>
        <span className="flex h-11 animate-rise items-center gap-2.5 rounded-xl border border-border px-3 text-sm tracking-[0.3em] text-card-foreground [animation-delay:250ms] motion-reduce:animate-none">
          <Lock className="size-4 text-muted-foreground" />
          ••••••••••
        </span>
        <span className="flex h-11 animate-rise items-center justify-between rounded-xl border border-primary/30 bg-accent/50 px-3 text-sm text-card-foreground [animation-delay:350ms] motion-reduce:animate-none">
          <span className="flex items-center gap-2.5">
            <Wallet className="size-4 text-primary" /> Hanowallet
          </span>
          <span className="inline-flex animate-pop items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground [animation-delay:800ms] motion-reduce:animate-none dark:text-neutral-950">
            <Check className="size-3" strokeWidth={3} /> Connected
          </span>
        </span>
        <span className="mt-1 flex h-11 animate-rise items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground [animation-delay:450ms] motion-reduce:animate-none dark:text-neutral-950">
          Create account
        </span>
      </div>
    </div>
  );
}

function PlanVisual() {
  // Plan names are examples — match them to your real subscriptions.
  const plans = [
    { name: "Starter", detail: "1–5 miners" },
    { name: "Growth", detail: "6–20 miners" },
    { name: "Fleet", detail: "21+ miners" },
  ];
  const picked = 1;
  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-card-foreground">Choose a plan</p>
        <span className="flex rounded-full bg-muted p-0.5 text-[11px] font-semibold">
          <span className="rounded-full bg-card px-2.5 py-1 text-card-foreground shadow-sm">Monthly</span>
          <span className="px-2.5 py-1 text-muted-foreground">Yearly</span>
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {plans.map((p, i) => {
          const on = i === picked;
          return (
            <span
              key={p.name}
              className={clsx(
                "flex animate-rise items-center gap-3 rounded-xl border p-3 transition-colors motion-reduce:animate-none",
                on ? "border-primary bg-accent/50 ring-1 ring-primary" : "border-border",
              )}
              style={{ animationDelay: `${120 + i * 100}ms` }}
            >
              <span
                className={clsx(
                  "flex size-5 flex-none items-center justify-center rounded-full border-2",
                  on ? "border-primary bg-primary" : "border-border",
                )}
              >
                {on && <span className="size-1.5 animate-pop rounded-full bg-white [animation-delay:600ms] motion-reduce:animate-none" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-card-foreground">{p.name}</span>
                <span className="block text-xs text-muted-foreground">{p.detail}</span>
              </span>
              {on && (
                <span className="animate-pop rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-[#102F3B] [animation-delay:700ms] motion-reduce:animate-none dark:bg-chart-3">
                  Selected
                </span>
              )}
            </span>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
        {["Rack space and cooling", "24/7 monitoring", "Maintenance included"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <Check className="size-3.5 text-primary" strokeWidth={3} />
            {t}
          </li>
        ))}
      </ul>
      <span className="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground dark:text-neutral-950">
        Subscribe
      </span>
    </div>
  );
}

function RigVisual() {
  return (
    <div className="relative w-full max-w-[360px]">
      <div className={clsx(card, "p-0")}>
        <div className="relative h-44 overflow-hidden rounded-t-[22px] bg-[#1F4273]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-[10%] animate-float motion-reduce:animate-none">
            <Image
              src="/rigs/antminer-s21-xp.png"
              alt=""
              fill
              sizes="300px"
              className="scale-[1.2] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.35)]"
            />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#1F4273]">
            Air-cooled
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground">Bitmain</p>
          <p className="text-base font-semibold text-card-foreground">Antminer S21 XP</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <span className="rounded-lg bg-muted px-2.5 py-2">
              <span className="block text-muted-foreground">Hashrate</span>
              <span className="font-semibold tabular-nums text-card-foreground">270 TH/s</span>
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-2">
              <span className="block text-muted-foreground">Efficiency</span>
              <span className="font-semibold tabular-nums text-card-foreground">13.5 J/TH</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex h-11 items-center gap-3 rounded-xl border border-border px-3 text-sm font-semibold text-card-foreground">
              <Minus className="size-3.5 text-muted-foreground" /> 2 <Plus className="size-3.5 text-muted-foreground" />
            </span>
            <span className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground dark:text-neutral-950">
              Buy now
            </span>
          </div>
        </div>
      </div>
      {/* order toast */}
      <span className="absolute -right-3 top-32 flex animate-pop items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-card-foreground shadow-[0_14px_30px_-12px_rgba(16,47,59,0.45)] [animation-delay:900ms] motion-reduce:animate-none sm:-right-8">
        <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-[#102F3B] dark:bg-chart-3">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        Order confirmed
      </span>
    </div>
  );
}

function HostingVisual() {
  const yours = new Set([5, 6]);
  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-card-foreground">Facility rack</p>
        <span className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground [animation-delay:1200ms] motion-reduce:animate-none">
          <span className="size-1.5 rounded-full bg-secondary dark:bg-chart-3" />
          Online
        </span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={clsx(
              "flex h-11 animate-pop items-center justify-between rounded-lg border px-2 motion-reduce:animate-none",
              yours.has(i) ? "border-primary/60 bg-primary/10" : "border-border bg-muted",
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-5 rounded-full bg-muted-foreground/40" />
              <span className="h-0.5 w-5 rounded-full bg-muted-foreground/40" />
            </span>
            <span
              className={clsx(
                "size-1.5 rounded-full",
                yours.has(i) ? "animate-pulse bg-secondary dark:bg-chart-3" : "bg-muted-foreground/40",
              )}
            />
          </span>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block h-2.5 w-4 rounded-sm border border-primary/60 bg-primary/10" /> Your miners
      </p>
      <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm text-card-foreground">
        {["Installed and powered", "Configured", "Connected to pool"].map((t, i) => (
          <li
            key={t}
            className="flex animate-rise items-center gap-2 motion-reduce:animate-none"
            style={{ animationDelay: `${700 + i * 150}ms` }}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EarnVisual() {
  const payouts = [
    { when: "Today, 09:41", amount: "0.00512" },
    { when: "Yesterday, 09:40", amount: "0.00498" },
  ];
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-3">
      <div className="rounded-[22px] bg-[#1F4273] p-5 text-white shadow-[0_18px_40px_-18px_rgba(31,66,115,0.75)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/75">Hanowallet balance</span>
          <Wallet className="size-5 text-[#5CCFB8]" />
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">
          0.04821 <span className="text-base font-medium text-white/70">BTC</span>
        </p>
        <svg viewBox="0 0 300 60" className="mt-3 h-14 w-full" aria-hidden="true">
          <path
            d="M0 50 C30 50 30 44 60 44 C90 44 90 46 120 38 C150 30 150 34 180 26 C210 18 210 22 240 14 C270 6 270 8 300 4"
            fill="none"
            stroke="#5CCFB8"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            className="animate-draw motion-reduce:animate-none"
          />
        </svg>
      </div>
      <ul className={clsx(card, "flex flex-col gap-3 p-4")}>
        {payouts.map((p, i) => (
          <li
            key={p.when}
            className="flex animate-rise items-center gap-3 motion-reduce:animate-none"
            style={{ animationDelay: `${300 + i * 140}ms` }}
          >
            <span className="flex size-9 flex-none items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Check className="size-4" strokeWidth={2.5} />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-sm font-semibold text-card-foreground">Payout received</span>
              <span className="text-xs text-muted-foreground">{p.when}</span>
            </span>
            <span className="text-sm font-semibold tabular-nums text-card-foreground">+{p.amount} BTC</span>
          </li>
        ))}
      </ul>
    </div>
  );
}