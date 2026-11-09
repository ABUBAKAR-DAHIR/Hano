import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, Cpu, LifeBuoy, Server, Sparkles, Wallet } from "lucide-react";
import InView from "./Inview";
import Reveal from "@/components/Reveal";
import ServiceNav from "@/components/ServiceNav";

export const metadata: Metadata = {
  title: "Services | Hanowallet",
  description:
    "Mining hardware, managed hosting, pool setup with payouts to your wallet, and friendly support. Everything you need to start mining Bitcoin.",
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type Service = {
  id: string;
  nav: string;
  icon: typeof Cpu;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  cta: { label: string; href: string };
  visual: ReactNode;
};

const services: Service[] = [
  {
    id: "hardware",
    nav: "Hardware",
    icon: Cpu,
    kicker: "Mining hardware",
    title: "Efficient rigs, carefully chosen",
    body: "We compare the latest ASIC miners on hashrate, efficiency and power draw, so you only choose from hardware that's worth running.",
    points: [
      "Models from leading manufacturers",
      "Clear specs, compared side by side",
      "Help choosing the right rig for your budget",
    ],
    cta: { label: "Browse rigs", href: "/shop" },
    visual: <HardwareVisual />,
  },
  {
    id: "hosting",
    nav: "Hosting",
    icon: Server,
    kicker: "Managed hosting",
    title: "We run it, you relax",
    body: "Your miners live in our facility with the power, cooling and connection they need, looked after by our team.",
    points: ["Installation and setup handled", "Power and cooling built for mining", "Monitoring and maintenance included"],
    cta: { label: "Ask about hosting", href: "/contact" },
    visual: <HostingVisual />,
  },
  {
    id: "pool",
    nav: "Pool & payouts",
    icon: Wallet,
    kicker: "Pool & payouts",
    title: "Rewards, straight to your wallet",
    body: "We connect your miners to a reliable pool and send every reward to your Hanowallet, with each payout on record.",
    points: ["Pool setup done for you", "Every payout recorded", "Follow your earnings in one place"],
    cta: { label: "See how it works", href: "/#how-it-works" },
    visual: <PoolVisual />,
  },
  {
    id: "support",
    nav: "Support",
    icon: LifeBuoy,
    kicker: "Support",
    title: "Real people, ready to help",
    body: "Questions about your rig, hosting or payouts? Our team is a message away and replies within one business day.",
    points: ["Help with setup and your account", "Advice on growing your fleet", "Guides and answers in our help center"],
    cta: { label: "Contact support", href: "/contact" },
    visual: <SupportVisual />,
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-background">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden px-6 pb-10 pt-32 text-center sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex animate-rise items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground motion-reduce:animate-none">
            <Sparkles className="size-3.5" />
            Our services
          </span>
          <h1 className="mt-5 animate-rise text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            Everything you need <span className="text-primary">to start mining</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            From choosing a rig to receiving your first payout, we take care of the hard parts so you don&rsquo;t
            have to.
          </p>
        </div>

        {/* overview tiles */}
        <div className="relative mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {services.map(({ id, nav, icon: Icon }, i) => (
            <a
              key={id}
              href={`#${id}`}
              className={`group flex animate-rise flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_28px_-16px_rgba(16,47,59,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:animate-none ${EASE}`}
              style={{ animationDelay: `${240 + i * 80}ms` }}
            >
              <span className="relative flex size-12 items-center justify-center">
                <span className={`absolute inset-0 rounded-2xl bg-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${EASE}`} />
                <Icon className={`relative size-[22px] text-accent-foreground transition-transform duration-500 group-hover:-rotate-6 ${EASE}`} />
              </span>
              <span className="text-sm font-semibold text-card-foreground">{nav}</span>
            </a>
          ))}
        </div>
      </section>

      <ServiceNav items={services.map(({ id, nav }) => ({ id, label: nav }))} />

      {/* ================= Services ================= */}
      {services.map((s, i) => {
        const Icon = s.icon;
        const flip = i % 2 === 1;
        return (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-40 px-6 py-16 sm:py-20">
            <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
              <div className={flip ? "md:order-last" : ""}>
                <Reveal>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    {s.kicker}
                  </span>
                </Reveal>
                <Reveal delay={80}>
                  <h2 id={`${s.id}-title`} className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {s.title}
                  </h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base">{s.body}</p>
                </Reveal>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {s.points.map((p, j) => (
                    <Reveal as="li" key={p} delay={240 + j * 80} className="flex items-center gap-2.5 text-[15px] text-foreground">
                      <span className="flex size-5 flex-none items-center justify-center rounded-full bg-secondary text-[#102F3B] dark:bg-chart-3">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {p}
                    </Reveal>
                  ))}
                </ul>
                <Reveal delay={480}>
                  <Link
                    href={s.cta.href}
                    className="group/cta mt-7 inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-neutral-950"
                  >
                    {s.cta.label}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                  </Link>
                </Reveal>
              </div>

              <Reveal delay={120}>
                <InView className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_12%,transparent)_1px,transparent_1px)] [background-size:20px_20px]">
                  {s.visual}
                </InView>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24 pt-8">
        <Reveal>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[28px] border border-border bg-card p-8 text-center shadow-[0_12px_32px_-16px_rgba(16,47,59,0.25)] sm:flex-row sm:p-10 sm:text-left">
            <div className="relative size-24 flex-none animate-float motion-reduce:animate-none">
              <Image src="/rigs/antminer-s21-pro.png" alt="" fill sizes="96px" className="scale-[1.3] object-contain" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">Not sure where to start?</h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">Tell us your goals and we&rsquo;ll suggest the right setup.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link
                href="/contact"
                className="border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500 group/btn inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950"
              >
                Talk to us
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Get started
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ================================================================== */
/* Visuals — they mount when scrolled into view (InView), so their     */
/* entrance animations play when people see them. Figures are samples. */
/* ================================================================== */

const softCard =
  "rounded-2xl border border-border bg-card shadow-[0_10px_24px_-14px_rgba(16,47,59,0.3)] dark:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.7)]";

function HardwareVisual() {
  const rigs = [
    { file: "antminer-s21-xp", name: "Antminer S21 XP", hash: 270, tag: "Most efficient" },
    { file: "antminer-s21-pro", name: "Antminer S21 Pro", hash: 234 },
    { file: "antminer-s21-hydro", name: "Antminer S21 Hydro", hash: 335 },
    { file: "whatsminer-m60s", name: "Whatsminer M60S", hash: 186 },
  ];
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-5">
      {rigs.map((r, i) => (
        <div
          key={r.file}
          className={`group relative flex animate-rise flex-col p-3 transition-transform duration-300 hover:-translate-y-1 motion-reduce:animate-none ${softCard} ${EASE}`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {r.tag && (
            <span className="absolute left-2 top-2 z-10 animate-pop rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-[#102F3B] [animation-delay:600ms] motion-reduce:animate-none dark:bg-chart-3">
              {r.tag}
            </span>
          )}
          <span className="relative flex-1">
            <Image
              src={`/rigs/${r.file}.png`}
              alt=""
              fill
              sizes="200px"
              className={`scale-[1.2] object-contain transition-transform duration-500 group-hover:scale-[1.32] ${EASE}`}
            />
          </span>
          <span className="mt-1 truncate text-[13px] font-semibold text-card-foreground">{r.name}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{r.hash} TH/s</span>
        </div>
      ))}
    </div>
  );
}

function HostingVisual() {
  const yours = new Set([3, 4, 9, 10]);
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <div className={`animate-rise p-4 motion-reduce:animate-none ${softCard}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-card-foreground">Rack A</span>
          <span className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground [animation-delay:1300ms] motion-reduce:animate-none">
            <span className="size-1.5 rounded-full bg-secondary dark:bg-chart-3" />
            Online
          </span>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-1.5" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              className={`flex h-7 animate-pop items-center justify-end rounded-md border px-1.5 motion-reduce:animate-none ${
                yours.has(i) ? "border-primary/50 bg-primary/10" : "border-border bg-muted"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span
                className={`size-1.5 rounded-full ${yours.has(i) ? "animate-pulse bg-secondary dark:bg-chart-3" : "bg-muted-foreground/30"}`}
                style={yours.has(i) ? { animationDelay: `${(i % 4) * 300}ms` } : undefined}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Power", "Cooling", "Monitoring"].map((t, i) => (
          <span
            key={t}
            className={`flex animate-rise items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-card-foreground motion-reduce:animate-none ${softCard}`}
            style={{ animationDelay: `${900 + i * 120}ms` }}
          >
            <Check className="size-3.5 text-primary" strokeWidth={3} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PoolVisual() {
  const payouts = [
    { when: "Today, 09:41", amount: "0.00512" },
    { when: "Yesterday, 09:40", amount: "0.00498" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6">
      <div className="animate-rise rounded-2xl bg-[#1F4273] p-5 text-white shadow-[0_16px_32px_-16px_rgba(31,66,115,0.7)] motion-reduce:animate-none">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/75">Hanowallet balance</span>
          <Wallet className="size-5 text-[#5CCFB8]" />
        </div>
        <p className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight">
          0.04821 <span className="text-sm font-medium text-white/70">BTC</span>
        </p>
        <svg viewBox="0 0 300 50" className="mt-2 h-10 w-full" aria-hidden="true">
          <path
            d="M0 42 C30 42 30 36 60 36 C90 36 90 38 120 30 C150 22 150 26 180 20 C210 14 210 16 240 10 C270 4 270 6 300 3"
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
      {payouts.map((p, i) => (
        <div
          key={p.when}
          className={`flex animate-rise items-center gap-3 p-3 motion-reduce:animate-none ${softCard}`}
          style={{ animationDelay: `${500 + i * 150}ms` }}
        >
          <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Check className="size-4" strokeWidth={2.5} />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-[13px] font-semibold text-card-foreground">Payout received</span>
            <span className="text-xs text-muted-foreground">{p.when}</span>
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-card-foreground">+{p.amount} BTC</span>
        </div>
      ))}
    </div>
  );
}

function SupportVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-6 text-[13px] leading-relaxed">
      <p className="ml-auto max-w-[78%] animate-rise rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground shadow-sm [animation-delay:150ms] motion-reduce:animate-none dark:text-neutral-950">
        Hi! One of my miners is showing offline.
      </p>
      <div className="flex max-w-[85%] animate-rise items-end gap-2 [animation-delay:900ms] motion-reduce:animate-none">
        <span className="flex size-7 flex-none items-center justify-center rounded-full bg-[#1F4273] text-xs font-bold text-white">H</span>
        <p className={`rounded-2xl rounded-bl-md px-4 py-2.5 text-card-foreground ${softCard}`}>
          Thanks for letting us know! We&rsquo;re checking it now and will update you shortly.
        </p>
      </div>
      <p className="ml-auto max-w-[78%] animate-rise rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground shadow-sm [animation-delay:1700ms] motion-reduce:animate-none dark:text-neutral-950">
        Amazing, thank you!
      </p>
      <div className="flex animate-rise items-end gap-2 [animation-delay:2400ms] motion-reduce:animate-none">
        <span className="flex size-7 flex-none items-center justify-center rounded-full bg-[#1F4273] text-xs font-bold text-white">H</span>
        <span className={`flex items-center gap-1 rounded-2xl rounded-bl-md px-4 py-3.5 ${softCard}`} aria-label="Typing">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}