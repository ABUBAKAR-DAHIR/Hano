"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ArrowRight, ArrowUpRight, Droplets, Fan, Gauge, Leaf, Zap } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Rigs — specs are manufacturer headline figures; check them against  */
/* the latest spec sheets. Images live in /public/rigs (rigs.zip).     */
/* Leave `price` empty to show "Get a quote" instead.                  */
/* ------------------------------------------------------------------ */
type Rig = {
  id: string;
  name: string;
  maker: string;
  cooling: "Air-cooled" | "Hydro-cooled";
  hashrate: number; // TH/s
  efficiency: number; // J/TH (lower is better)
  power: number; // W
  image: string;
  price?: string;
};

const rigs: Rig[] = [
  { id: "bitmain-miner-s21-xp", name: "Antminer S21 XP", maker: "Bitmain", cooling: "Air-cooled", hashrate: 270, efficiency: 13.5, power: 3645, image: "/rigs/antminer-s21-xp.png" },
  { id: "bitmain-miner-s21-pro", name: "Antminer S21 Pro", maker: "Bitmain", cooling: "Air-cooled", hashrate: 234, efficiency: 15, power: 3510, image: "/rigs/antminer-s21-pro.png" },
  { id: "bitmain-miner-s21-hydro", name: "Antminer S21 Hydro", maker: "Bitmain", cooling: "Hydro-cooled", hashrate: 335, efficiency: 16, power: 5360, image: "/rigs/antminer-s21-hydro.png" },
  { id: "microbt-whatsminer-m60s", name: "Whatsminer M60S", maker: "MicroBT", cooling: "Air-cooled", hashrate: 186, efficiency: 18.5, power: 3441, image: "/rigs/whatsminer-m60s.png" },
];

const MAX_HASH = Math.max(...rigs.map((r) => r.hashrate));
const MIN_EFF = Math.min(...rigs.map((r) => r.efficiency));
const MAX_POWER = Math.max(...rigs.map((r) => r.power));
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ------------------------------------------------------------------ */

function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

/** Photo with an illustrated fallback until you add the real image. */
function RigPhoto({ rig, sizes, className }: { rig: Rig; sizes: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <svg viewBox="0 0 240 160" className={clsx("h-full w-full", className)} role="img" aria-label={rig.name}>
        <rect x="14" y="20" width="212" height="120" rx="12" className="fill-card stroke-border" strokeWidth="2" />
        {[72, 168].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="80" r="42" className="fill-muted stroke-border" strokeWidth="2" />
            <circle cx={cx} cy="80" r="28" fill="none" className="stroke-border" strokeWidth="2" />
            <path d={`M${cx - 42} 80h84M${cx} 38v84`} className="stroke-border" strokeWidth="2" />
            <circle cx={cx} cy="80" r="9" className="fill-primary" />
          </g>
        ))}
      </svg>
    );
  }
  return (
    <Image
      src={rig.image}
      alt={rig.name}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className={clsx("object-contain", className)}
    />
  );
}

/* ------------------------------------------------------------------ */

export default function FeaturedRigs() {
  const [active, setActive] = useState(0);
  const rig = rigs[active];
  const { ref: sectionRef, inView } = useInView<HTMLElement>();

  /* sliding highlight behind the selected row */
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hl, setHl] = useState<{ top: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = rowRefs.current[active];
      if (el) setHl({ top: el.offsetTop, height: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  /* subtle 3D tilt on the photo stage */
  const tiltRef = useRef<HTMLDivElement>(null);
  const onTilt = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !tiltRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tiltRef.current.style.setProperty("--ry", `${x * 10}deg`);
    tiltRef.current.style.setProperty("--rx", `${y * -8}deg`);
  };
  const resetTilt = () => {
    tiltRef.current?.style.setProperty("--ry", "0deg");
    tiltRef.current?.style.setProperty("--rx", "0deg");
  };

  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowDown" ? 1 : -1) + rigs.length) % rigs.length;
    setActive(next);
    rowRefs.current[next]?.focus();
  };

  // Literal class names so Tailwind can see them.
  const DELAYS: Record<number, string> = {
    0: "[animation-delay:0ms]",
    80: "[animation-delay:80ms]",
    160: "[animation-delay:160ms]",
    240: "[animation-delay:240ms]",
    320: "[animation-delay:320ms]",
    400: "[animation-delay:400ms]",
  };
  const reveal = (delay: keyof typeof DELAYS) =>
    clsx(
      inView ? "animate-rise" : "opacity-0",
      "motion-reduce:animate-none motion-reduce:opacity-100",
      DELAYS[delay],
    );

  const specs = [
    { icon: Gauge, label: "Hashrate", value: `${rig.hashrate} TH/s`, fill: rig.hashrate / MAX_HASH },
    { icon: Leaf, label: "Efficiency", value: `${rig.efficiency} J/TH`, fill: MIN_EFF / rig.efficiency },
    { icon: Zap, label: "Power draw", value: `${rig.power.toLocaleString("en-US")} W`, fill: rig.power / MAX_POWER },
  ];

  const isMostEfficient = rig.efficiency === MIN_EFF;
  const isFastest = rig.hashrate === MAX_HASH;

  return (
    <section
      id="rigs"
      ref={sectionRef}
      aria-labelledby="rigs-title"
      className="relative overflow-hidden bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1360px] px-6">
        {/* ---------------- Header ---------------- */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col items-start gap-5 lg:col-span-7">
            <span className={clsx("inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground", reveal(0))}>
              <Fan className="size-4" />
              Powerful mining equipment
            </span>
            <h2
              id="rigs-title"
              className={clsx("max-w-[27ch] text-[clamp(2.25rem,5.6vw,3.05rem)] font-bold leading-[1.05] tracking-[-0.04em] text-foreground", reveal(80))}
            >
              Explore our featured mining rigs
            </h2>
          </div>
          <div className={clsx("flex flex-col gap-4 text-[17px] leading-relaxed text-muted-foreground lg:col-span-5", reveal(160))}>
            {/* <p>
              Discover the power of our featured mining equipment. At Hanowallet, we present top-performing
              hardware that can take your mining operations to the next level.
            </p> */}
            <p>
              Every rig is selected for efficiency and profitability, so whether you&rsquo;re a seasoned miner or just
              starting out, you can optimize your setup with confidence.
            </p>
          </div>
        </div>

        {/* ---------------- Showcase + selector ---------------- */}
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Showcase */}
          <article
            id="rig-panel"
            role="tabpanel"
            aria-labelledby={`rig-tab-${rig.id}`}
            className={clsx("group/show flex flex-col overflow-hidden rounded-[28px] border border-border bg-card lg:col-span-7", reveal(240))}
          >
            <div
              onPointerMove={onTilt}
              onPointerLeave={resetTilt}
              className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_14%,transparent)_1px,transparent_1px)] [background-size:22px_22px] sm:aspect-[16/10]"
            >
              {/* badges */}
              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur">
                  {rig.cooling === "Hydro-cooled" ? <Droplets className="size-3.5" /> : <Fan className="size-3.5" />}
                  {rig.cooling}
                </span>
                {isMostEfficient && (
                  <span key={`eff-${rig.id}`} className="animate-pop rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground motion-reduce:animate-none dark:bg-chart-3 dark:text-[#102F3B]">
                    Most efficient
                  </span>
                )}
                {isFastest && (
                  <span key={`fast-${rig.id}`} className="animate-pop rounded-full bg-[#1F4273] px-3 py-1.5 text-xs font-semibold text-white motion-reduce:animate-none">
                    Highest hashrate
                  </span>
                )}
              </div>
              <span className="absolute right-5 top-5 z-10 text-sm font-medium text-accent-foreground/80">{rig.maker}</span>

              {/* photo with tilt */}
              <div
                ref={tiltRef}
                className={clsx(
                  "absolute inset-[3%] transition-transform duration-500 sm:inset-[5%] [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:[transform:none]",
                  EASE,
                )}
              >
                <div
                  key={rig.id}
                  className={clsx(
                    "relative h-full w-full animate-swap transition-transform duration-700 group-hover/show:-translate-y-1.5 group-hover/show:scale-[1.04] motion-reduce:animate-none",
                    EASE,
                  )}
                >
                  <RigPhoto rig={rig} sizes="(min-width: 1024px) 50vw, 90vw" className="drop-shadow-[0_30px_30px_rgba(16,47,59,0.25)]" />
                </div>
              </div>
            </div>

            {/* details */}
            <div className="flex flex-1 flex-col gap-7 p-6 sm:p-8">
              <div key={`title-${rig.id}`} className="flex flex-wrap items-end justify-between gap-4 animate-swap motion-reduce:animate-none">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">{rig.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rig.maker} · SHA-256 · {rig.cooling}
                  </p>
                </div>
                <p className="text-right">
                  <span className="block text-xs text-muted-foreground">Price</span>
                  <span className="text-xl font-bold text-card-foreground">{rig.price ?? "Get a quote"}</span>
                </p>
              </div>

              <dl className="grid gap-5 sm:grid-cols-3">
                {specs.map(({ icon: Icon, label, value, fill }) => (
                  <div key={label} className="flex flex-col gap-2.5 rounded-2xl bg-muted/60 p-4">
                    <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Icon className="size-4 text-primary" />
                      {label}
                    </dt>
                    <dd className="text-lg font-semibold tabular-nums text-card-foreground">{value}</dd>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                      <div
                        className={clsx("h-full rounded-full bg-primary transition-[width] duration-700", EASE)}
                        style={{ width: `${Math.round(fill * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  href={`/shop/${rig.id}`}
                  className="group/btn inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950 border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
                >
                  View details
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </Link>
                <Link
                  href={`/contact?rig=${rig.id}`}
                  className="inline-flex h-12 items-center rounded-xl border border-border px-6 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Request a quote
                </Link>
              </div>
            </div>
          </article>

          {/* Selector */}
          <div className={clsx("flex flex-col rounded-[28px] border border-border bg-card p-3 lg:col-span-5", reveal(320))}>
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <h3 className="text-base font-semibold text-card-foreground">Compare rigs</h3>
              <span className="text-xs text-muted-foreground">Bar shows efficiency</span>
            </div>

            <div
              role="tablist"
              aria-label="Featured mining rigs"
              aria-orientation="vertical"
              onKeyDown={onListKey}
              className="relative flex flex-col gap-1"
            >
              {hl && (
                <span
                  aria-hidden="true"
                  className={clsx("pointer-events-none absolute inset-x-0 rounded-2xl bg-accent transition-[top,height] duration-500", EASE)}
                  style={{ top: hl.top, height: hl.height }}
                />
              )}

              {rigs.map((r, i) => {
                const selected = i === active;
                return (
                  <button
                    key={r.id}
                    id={`rig-tab-${r.id}`}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="rig-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className="group/row relative flex items-center gap-4 rounded-2xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={clsx(
                        "relative size-16 flex-none overflow-hidden rounded-xl transition-colors duration-300",
                        selected ? "bg-card" : "bg-muted",
                      )}
                    >
                      <span className={clsx("absolute inset-0 scale-[1.3] transition-transform duration-500 group-hover/row:scale-[1.45]", EASE)}>
                        <RigPhoto rig={r} sizes="64px" />
                      </span>
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={clsx(
                            "truncate text-[15px] font-semibold transition-colors",
                            selected ? "text-accent-foreground" : "text-card-foreground",
                          )}
                        >
                          {r.name}
                        </span>
                        <span className="flex-none text-sm font-semibold tabular-nums text-card-foreground">
                          {r.hashrate} <span className="font-normal text-muted-foreground">TH/s</span>
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                          <span
                            className={clsx(
                              "block h-full rounded-full transition-[width] duration-1000",
                              EASE,
                              selected ? "bg-secondary dark:bg-chart-3" : "bg-muted-foreground/40",
                            )}
                            style={{ width: inView ? `${Math.round((MIN_EFF / r.efficiency) * 100)}%` : "0%" }}
                          />
                        </span>
                        <span className="w-16 flex-none text-right text-xs tabular-nums text-muted-foreground">
                          {r.efficiency} J/TH
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Link
              href="/shop"
              className="group/all mx-3 mb-3 mt-auto flex items-center justify-between rounded-2xl border border-dashed border-border px-4 py-4 text-[15px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:mt-6"
            >
              Browse the full shop
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover/all:-translate-y-0.5 group-hover/all:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ---------------- Closing band ---------------- */}
        <div
          className={clsx(
            "mt-6 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-[#1F4273] p-8 text-white sm:p-10 md:flex-row md:items-center",
            reveal(400),
          )}
        >
          <p className="max-w-2xl text-lg leading-relaxed text-white/85">
            <span className="font-semibold text-white">Find the rig that fits your goals.</span> Compare hashrate,
            efficiency and power side by side, then start mining with confidence today.
          </p>
          <Link
            href="/shop"
            className="group/cta inline-flex h-12 flex-none items-center gap-2 rounded-xl bg-[#5CCFB8] px-6 text-[15px] font-semibold text-[#102F3B] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F4273] border-[#5CCFB8] border-2 hover:bg-transparent hover:text-[#5CCFB8] dark:hover:text-white transition-all duration-500"
          >
            Start mining
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}