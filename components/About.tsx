import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, Eye, Gauge, Heart, Server, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About us | Hanowallet",
  description:
    "Hanowallet brings efficient mining hardware, managed hosting and transparent payouts together, so Bitcoin mining feels easy from day one.",
};

/* ------------------------------------------------------------------ */
/* Content — the story and founder bio are drafts, rewrite them in     */
/* your own words. Add people to `team` and that section appears.      */
/* ------------------------------------------------------------------ */
const founder = {
  name: "Ibrahim Said Ibrahim",
  role: "Founder & CEO",
  photo: "/team/ibrahim-said-ibrahim.jpg",
  bio: [
    "Ibrahim founded Hanowallet with a simple goal: make Bitcoin mining accessible to anyone, without the noise, heat and guesswork that usually come with it.",
    "As CEO, he leads the team behind Hanowallet's hardware selection, hosting and payouts, with a focus on transparency and efficiency at every step.",
  ],
  // Add his profile links to show the buttons, e.g. linkedin: "https://www.linkedin.com/in/…"
  linkedin: "",
  x: "",
};

type Member = { name: string; role: string; photo?: string };
const team: Member[] = [
  // { name: "Full name", role: "Head of Operations", photo: "/team/name.jpg" },
];

const rigs = [
  { file: "antminer-s21-xp", name: "S21 XP" },
  { file: "antminer-s21-pro", name: "S21 Pro" },
  { file: "antminer-s21-hydro", name: "S21 Hydro" },
  { file: "whatsminer-m60s", name: "M60S" },
];

const services = [
  { icon: Cpu, title: "We pick the hardware", body: "Efficient rigs, compared side by side." },
  { icon: Server, title: "We host it for you", body: "Installed, maintained and monitored." },
  { icon: Wallet, title: "We pay you out", body: "Every reward sent to your Hanowallet." },
];

const values = [
  { icon: Eye, title: "Transparency", body: "Clear specs, clear costs and every payout on record." },
  { icon: Gauge, title: "Efficiency", body: "We choose rigs by J/TH, because efficiency decides what you keep." },
  { icon: Heart, title: "Simplicity", body: "No noise, heat or wiring at home. Mining should feel easy." },
  { icon: ShieldCheck, title: "Security", body: "Rewards go straight to your own wallet, protected at every step." },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const FLOAT_DELAYS = ["[animation-delay:0ms]", "[animation-delay:700ms]", "[animation-delay:1400ms]", "[animation-delay:2100ms]"];

const LINKEDIN_PATH =
  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z";
const X_PATH =
  "M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z";

export default function AboutPage() {
  const founderLinks = [
    { label: "LinkedIn", href: founder.linkedin, path: LINKEDIN_PATH },
    { label: "X", href: founder.x, path: X_PATH },
  ].filter((l) => l.href);

  return (
    <main className="bg-background">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 text-center sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex animate-rise items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground motion-reduce:animate-none">
            <Sparkles className="size-3.5" />
            About us
          </span>
          <h1 className="mt-5 animate-rise text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            Mining made simple, <span className="text-primary">for everyone</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            Hanowallet brings efficient hardware, managed hosting and transparent payouts together, so mining feels
            easy from day one.
          </p>
        </div>

        {/* floating rigs */}
        <div className="relative mx-auto mt-12 max-w-4xl animate-rise [animation-delay:260ms] motion-reduce:animate-none">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-[32px] bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_12%,transparent)_1px,transparent_1px)] px-6 pb-6 pt-10 [background-size:20px_20px] sm:grid-cols-4">
            {rigs.map((r, i) => (
              <figure key={r.file} className="group flex flex-col items-center">
                <div className="relative aspect-square w-full max-w-[180px]">
                  {/* soft shadow that breathes with the float */}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-[10%] left-1/2 h-3 w-1/2 -translate-x-1/2 animate-breathe rounded-full bg-[#1F4273]/15 blur-[2px] motion-reduce:animate-none ${FLOAT_DELAYS[i]}`}
                  />
                  <div className={`absolute inset-0 animate-float motion-reduce:animate-none ${FLOAT_DELAYS[i]}`}>
                    <div className={`relative h-full w-full transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110 ${EASE}`}>
                      <Image
                        src={`/rigs/${r.file}.png`}
                        alt={`${r.name} mining rig`}
                        fill
                        priority
                        sizes="180px"
                        className="scale-[1.25] object-contain"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="mt-1 rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-accent-foreground backdrop-blur transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-neutral-950">
                  {r.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= What we do ================= */}
      <section aria-label="What we do" className="px-6 pb-20">
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-3">
          {services.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className={`group flex h-full items-start gap-3.5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_10px_24px_-14px_rgba(16,47,59,0.3)] ${EASE}`}>
                <span className={`flex size-10 flex-none items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${EASE}`}>
                  <Icon className="size-[18px]" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-card-foreground">{title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{body}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= Story ================= */}
      <section aria-labelledby="story-title" className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#1F4273]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:18px_18px]"
              />
              <div className="absolute inset-[12%] animate-float motion-reduce:animate-none">
                <Image
                  src="/rigs/antminer-s21-hydro.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 360px, 80vw"
                  className="object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.35)]"
                />
              </div>
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1F4273] shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#5CCFB8] motion-reduce:animate-none" />
                  <span className="relative size-2 rounded-full bg-[#5CCFB8]" />
                </span>
                Mining quietly, so you don&rsquo;t have to
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 id="story-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Our story
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
                Bitcoin mining can feel complicated: comparing hardware, dealing with noise and heat, and watching power
                costs eat into rewards.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base">
                We started Hanowallet to take those worries away. We choose efficient rigs, run them for you and send
                every reward straight to your wallet, so you can simply enjoy watching it grow.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= Founder ================= */}
      <section aria-labelledby="founder-title" className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="grid items-center gap-10 overflow-hidden rounded-[32px] border border-border bg-card p-5 shadow-[0_16px_40px_-20px_rgba(16,47,59,0.3)] dark:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.75)] sm:p-6 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
              {/* portrait */}
              <figure className="group relative">
                <span
                  aria-hidden="true"
                  className={`absolute -inset-2 rotate-3 rounded-[30px] bg-accent transition-transform duration-700 group-hover:rotate-6 ${EASE}`}
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-[#1F4273]">
                  <Image
                    src={founder.photo}
                    alt={`Portrait of ${founder.name}, ${founder.role} of Hanowallet`}
                    fill
                    sizes="(min-width: 768px) 400px, 90vw"
                    className={`object-cover transition-transform duration-700 group-hover:scale-[1.04] ${EASE}`}
                  />
                </div>
                <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#1F4273] shadow-md backdrop-blur">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#5CCFB8] motion-reduce:animate-none" />
                    <span className="relative size-2 rounded-full bg-[#5CCFB8]" />
                  </span>
                  {founder.role}
                </figcaption>
              </figure>

              {/* text */}
              <div className="pb-4 md:pb-0 md:pr-6">
                <Reveal delay={80}>
                  <span className="text-sm font-medium text-primary">Meet the founder</span>
                </Reveal>
                <Reveal delay={140}>
                  <h2 id="founder-title" className="mt-2 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-card-foreground">
                    {founder.name}
                  </h2>
                  <p className="mt-1 text-[15px] text-muted-foreground">{founder.role}, Hanowallet</p>
                </Reveal>

                {founder.bio.map((para, i) => (
                  <Reveal key={i} delay={220 + i * 80}>
                    <p className={`${i === 0 ? "mt-6" : "mt-3"} text-[15px] leading-7 text-muted-foreground sm:text-base`}>
                      {para}
                    </p>
                  </Reveal>
                ))}

                <Reveal delay={400}>
                  <div className="mt-7 flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/contact"
                      className="group/btn inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950 border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
                    >
              
                      Get in touch
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </Link>
                    {founderLinks.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${founder.name} on ${l.label}`}
                        className="flex size-11 items-center justify-center rounded-xl border border-border text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-neutral-950"
                      >
                        <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
                          <path d={l.path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Values ================= */}
      <section aria-labelledby="values-title" className="bg-muted/40 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <h2 id="values-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What we care about
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground sm:text-base">
              Four small promises that guide everything we do.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 90}>
                <article
                  className={`group flex h-full flex-col items-center rounded-3xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_30px_-16px_rgba(16,47,59,0.35)] ${EASE}`}
                >
                  <span className="relative flex size-14 items-center justify-center">
                    <span
                      className={`absolute inset-0 rounded-2xl bg-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${EASE}`}
                    />
                    <Icon
                      className={`relative size-6 text-accent-foreground transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${EASE}`}
                    />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-card-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Team (shows once you add people) ================= */}
      {team.length > 0 && (
        <section aria-labelledby="team-title" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center">
              <h2 id="team-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Meet the team
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {team.map((m, i) => (
                <Reveal key={m.name} delay={i * 90}>
                  <figure className="group text-center">
                    <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-[28px] bg-accent">
                      {m.photo ? (
                        <Image
                          src={m.photo}
                          alt={m.name}
                          fill
                          sizes="200px"
                          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${EASE}`}
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-3xl font-bold text-accent-foreground">
                          {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <figcaption className="mt-3">
                      <p className="text-[15px] font-semibold text-foreground">{m.name}</p>
                      <p className="text-sm text-muted-foreground">{m.role}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="px-6 py-20 sm:py-24">
        <Reveal>
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 overflow-hidden rounded-[28px] border border-border bg-card p-8 text-center shadow-[0_12px_32px_-16px_rgba(16,47,59,0.25)] sm:flex-row sm:p-10 sm:text-left">
            <div className="relative size-24 flex-none animate-float motion-reduce:animate-none">
              <Image src="/rigs/whatsminer-m60s.png" alt="" fill sizes="96px" className="scale-[1.3] object-contain" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">Ready to start mining?</h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">Create your account in minutes, or say hello to our team.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link
                href="/register"
                className="group/btn inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950 border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
              >
                Get started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}