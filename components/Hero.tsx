"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowRight, Check, Cpu, Zap } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Sample dashboard data — replace with your real figures.             */
/* Each range has 7 buckets; the total is the sum of the buckets.      */
/* ------------------------------------------------------------------ */
type Range = "24H" | "7D" | "30D";

const RANGES: Record<Range, { change: string; labels: string[]; values: number[] }> = {
  "24H": {
    change: "+1.1% today",
    labels: ["00h", "04h", "08h", "12h", "16h", "20h", "24h"],
    values: [0.00092, 0.00095, 0.00098, 0.00099, 0.00101, 0.00105, 0.00108],
  },
  "7D": {
    change: "+4.2% this week",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [0.0061, 0.0064, 0.0066, 0.0069, 0.0071, 0.0074, 0.00771],
  },
  "30D": {
    change: "+9.8% this month",
    labels: ["D1", "D5", "D10", "D15", "D20", "D25", "D30"],
    values: [0.0262, 0.0271, 0.0284, 0.0293, 0.0298, 0.0307, 0.03364],
  },
};

const W = 480;
const H = 160;
const PAD_TOP = 24;
const PAD_BOTTOM = 28;

function toPoints(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = W / values.length;
  return values.map((v, i) => ({
    x: step * (i + 0.5),
    y: PAD_TOP + (1 - (v - min) / span) * (H - PAD_TOP - PAD_BOTTOM),
  }));
}

/** Smooth cubic path; every range produces the same command structure so it can morph. */
function smoothPath(pts: { x: number; y: number }[]) {
  return pts.reduce((d, p, i) => {
    if (i === 0) return `M${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const mid = (p.x - prev.x) / 2;
    return `${d} C${prev.x + mid} ${prev.y} ${p.x - mid} ${p.y} ${p.x} ${p.y}`;
  }, "");
}

/* ------------------------------------------------------------------ */
/* Count-up hook: eases from the previous value to the new target.     */
/* ------------------------------------------------------------------ */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useCountUp(target: number, { duration = 1200, delay = 0 } = {}) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (reduced) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    let raf = 0;
    let start = 0;
    const timer = window.setTimeout(() => {
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
        current.current = from + (target - from) * eased;
        setValue(current.current);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay, reduced]);

  return value;
}

/* ------------------------------------------------------------------ */

const features = ["Managed hosting", "Hardware sourcing", "Transparent payouts"];
const racks = ["Rack A", "Rack B", "Rack C"];
const cardShadow =
  "shadow-[0_12px_32px_-14px_rgba(16,47,59,0.22)] dark:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.7)]";

export default function Hero() {
  const [range, setRange] = useState<Range>("7D");
  const [hover, setHover] = useState<number | null>(null);

  const data = RANGES[range];
  const pts = toPoints(data.values);
  const line = smoothPath(pts);
  const area = `${line} L${pts[pts.length - 1].x} ${H} L${pts[0].x} ${H} Z`;

  const active = hover ?? pts.length - 1;
  const ap = pts[active];

  const total = useCountUp(
    data.values.reduce((a, b) => a + b, 0),
    { delay: 400 },
  );
  const hashrate = useCountUp(412, { delay: 700 });
  const miners = useCountUp(24, { delay: 800 });
  const efficiency = useCountUp(17.5, { delay: 900 });

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * pts.length - 0.5);
    setHover(Math.max(0, Math.min(pts.length - 1, i)));
  };

  return (
    <section className="relative overflow-hidden bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:28px_28px]">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-16 px-10 max-md:px-6 py-16 md:py-32 lg:grid-cols-2">
        {/* ---------------- Copy ---------------- */}
        <div className="flex flex-col items-start gap-7 max-md:my-8">
          <span className="inline-flex animate-rise items-center gap-2.5 rounded-full bg-accent py-2 pl-2.5 pr-4 text-sm font-medium text-accent-foreground motion-reduce:animate-none">
            <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-secondary text-[#102F3B] dark:bg-chart-3">
              <Zap className="size-3" strokeWidth={3} />
            </span>
            Bitcoin mining, simplified
          </span>

          <h1 className="animate-rise text-[clamp(2.75rem,5.8vw,4.05rem)] font-bold leading-[1.02] tracking-[-0.045em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            A Better Mining{" "}
            <span className="relative whitespace-nowrap text-primary">
              Experience
              <svg
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute -bottom-[0.12em] left-0 h-[0.18em] w-full"
              >
                <path
                  d="M3 10 C 80 2, 200 2, 297 8"
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  className="animate-draw stroke-secondary [animation-delay:700ms] motion-reduce:animate-none dark:stroke-chart-3"
                />
              </svg>
            </span>
          </h1>

          <p className="max-w-[30rem] animate-rise text-xl leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none">
            Solutions designed especially for mining enthusiasts.
          </p>

          <div className="flex animate-rise flex-wrap gap-3 max-md:my-4 pt-1 [animation-delay:240ms] motion-reduce:animate-none">
            <a
              href="#"
              className=" group inline-flex h-[54px] items-center gap-2.5 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(31,66,115,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950 border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
            >
              Start mining
              <ArrowRight
                className="size-[18px] transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.2}
              />
            </a>
            <a
              href="#"
              className="inline-flex h-[54px] items-center rounded-xl border border-border bg-card px-6 text-base font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore services
            </a>
          </div>

          <ul className="flex animate-rise flex-wrap gap-x-7 gap-y-3 pt-3 text-[15px] text-foreground [animation-delay:320ms] motion-reduce:animate-none">
            {features.map((f) => (
              <li key={f} className="inline-flex items-center gap-2">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Visual ---------------- */}
        <div className="relative py-14 sm:pb-16">
          {/* mint backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[14%] right-0 animate-fade rounded-[32px] bg-accent transition-colors duration-400 motion-reduce:animate-none"
          />

          {/* dashboard card */}
          <div
            className={`relative flex animate-rise flex-col gap-5 rounded-[22px] border border-border bg-card p-6 tabular-nums [animation-delay:150ms] motion-reduce:animate-none sm:mr-14 ${cardShadow}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-[38px] items-center justify-center rounded-[10px] bg-[#1F4273] text-white">
                  <Cpu className="size-[18px]" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-card-foreground">Mining overview</span>
                  <span className="text-[13px] text-muted-foreground">All miners</span>
                </span>
              </div>

              {/* range switch with sliding indicator */}
              <div role="group" aria-label="Time range" className="relative grid grid-cols-3 rounded-[10px] bg-muted p-1">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-[7px] bg-card shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateX(${(Object.keys(RANGES) as Range[]).indexOf(range) * 100}%)` }}
                />
                {(Object.keys(RANGES) as Range[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRange(r);
                      setHover(null);
                    }}
                    aria-pressed={range === r}
                    className={`relative rounded-[7px] px-3 py-1.5 text-xs transition-colors duration-300 ${
                      range === r ? "font-semibold text-card-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] text-muted-foreground">Total rewards</span>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-[30px] max-sm:text-[20px] font-bold tracking-[-0.03em] text-card-foreground">
                  {total.toFixed(5)} <span className="text-lg font-medium text-muted-foreground">BTC</span>
                </span>
                <span
                  key={range}
                  className="animate-pop rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground [animation-delay:200ms] motion-reduce:animate-none"
                >
                  {data.change}
                </span>
              </div>
            </div>

            {/* chart */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="block h-auto w-full cursor-crosshair touch-none overflow-visible"
                  role="img"
                  aria-label={`Rewards for the last ${range}`}
                  onPointerMove={onMove}
                  onPointerLeave={() => setHover(null)}
                >
                  <g className="stroke-border" strokeWidth="1" strokeDasharray="4 6">
                    <line x1="0" y1="24" x2={W} y2="24" />
                    <line x1="0" y1="78" x2={W} y2="78" />
                    <line x1="0" y1="132" x2={W} y2="132" />
                  </g>

                  <path
                    d={area}
                    style={{ d: `path("${area}")` } as CSSProperties}
                    className="animate-fade fill-primary/10 transition-[d] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [animation-delay:1000ms] motion-reduce:animate-none"
                  />
                  <path
                    d={line}
                    style={{ d: `path("${line}")` } as CSSProperties}
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    className="animate-draw stroke-primary transition-[d] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [animation-delay:450ms] motion-reduce:animate-none"
                  />

                  {/* crosshair + highlighted point */}
                  <g
                    className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ transform: `translate(${ap.x}px, ${ap.y}px)` }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={H}
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      className="animate-fade stroke-primary/50 [animation-delay:1500ms] motion-reduce:animate-none"
                    />
                    <g className="animate-pop [animation-delay:1500ms] motion-reduce:animate-none">
                      <circle
                        r="9"
                        className="origin-center animate-pulse-ring fill-secondary/40 [transform-box:fill-box] motion-reduce:animate-none dark:fill-chart-3/40"
                      />
                      <circle r="4.5" strokeWidth="2" className="fill-secondary stroke-card dark:fill-chart-3" />
                    </g>
                  </g>
                </svg>

                {/* tooltip */}
                <div
                  aria-hidden={hover === null}
                  className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs tabular-nums text-background shadow-lg transition-[left,top,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    hover === null ? "opacity-0" : "opacity-100"
                  }`}
                  style={{ left: `${(ap.x / W) * 100}%`, top: `${(ap.y / H) * 100}%` }}
                >
                  <span className="opacity-70">{data.labels[active]}</span>{" "}
                  <span className="font-semibold">{data.values[active].toFixed(5)} BTC</span>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center font-mono text-[11px] text-muted-foreground">
                {data.labels.map((l, i) => (
                  <span
                    key={`${range}-${l}`}
                    className={`transition-colors duration-200 ${i === active && hover !== null ? "text-foreground" : ""}`}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border pt-[18px]">
              <Stat label="Hashrate" value={`${Math.round(hashrate)} TH/s`} />
              <Stat label="Active miners" value={`${Math.round(miners)} / 24`} divider />
              <Stat label="Efficiency" value={`${efficiency.toFixed(1)} J/TH`} divider />
            </div>
          </div>

          {/* fleet status card */}
          <div
            className={`absolute right-0 top-3 hidden w-[210px] animate-rise flex-col gap-3 rounded-[18px] border border-border bg-card p-4 [animation-delay:500ms] motion-reduce:animate-none sm:flex ${cardShadow}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-card-foreground">Fleet status</span>
              <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-accent-foreground">
                Live
              </span>
            </div>
            {racks.map((r, i) => (
              <div
                key={r}
                className="flex animate-rise items-center gap-2.5 text-[13px] text-card-foreground motion-reduce:animate-none"
                style={{ animationDelay: `${800 + i * 120}ms` }}
              >
                <span className="relative flex size-2">
                  <span
                    className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary motion-reduce:animate-none dark:bg-chart-3"
                    style={{ animationDelay: `${i * 700}ms` }}
                  />
                  <span className="relative size-2 rounded-full bg-secondary dark:bg-chart-3" />
                </span>
                <span className="flex-1">{r}</span>
                <span className="text-muted-foreground">Online</span>
              </div>
            ))}
          </div>

          {/* payout card */}
          <div
            className={`absolute bottom-5 -left-7 hidden animate-rise-float items-center gap-3.5 rounded-[18px] border border-border bg-card py-3.5 pl-3.5 pr-5 tabular-nums motion-reduce:animate-none sm:flex ${cardShadow}`}
          >
            <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Check className="size-[22px]" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold text-card-foreground">Payout sent to Hanowallet</span>
              <span className="text-[13px] text-muted-foreground">0.00512 BTC · Today, 09:41</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${divider ? "border-l border-border pl-4" : ""}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-[17px] font-semibold text-card-foreground">{value}</span>
    </div>
  );
}