"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Top questions for the homepage — the full list lives on /faq.       */
/* `id` matches the /faq page, so "Read more" opens the same answer.   */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    id: "need-technical-experience",
    q: "Do I need technical experience?",
    a: "Not at all. We help you choose a rig, then install, configure and connect it to a pool for you. You simply follow your miner's performance and receive rewards in your Hanowallet.",
  },
  {
    id: "hosting-includes",
    q: "What does managed hosting include?",
    a: "We install your miner, configure it, connect it to a pool, and handle monitoring and maintenance in our facility, so you don't have to deal with noise, heat or wiring.",
  },
  {
    id: "choose-the-right-rig",
    q: "How do I choose the right rig?",
    a: "Start with your budget and electricity cost, then compare hashrate and efficiency. A more efficient rig usually costs more upfront but keeps more of its rewards over time. Tell us your goals and we'll suggest options.",
  },
  {
    id: "how-rewards-are-paid",
    q: "How are mining rewards paid out?",
    a: "Rewards are sent straight to your Hanowallet, and every payout is recorded so you can follow your earnings over time.",
  },
  {
    id: "how-much-can-i-earn",
    q: "How much can I earn?",
    a: "Earnings depend on your miner's hashrate and efficiency, the network difficulty, transaction fees, your uptime and Bitcoin's price. They change over time and aren't guaranteed, but we're happy to help you estimate them for a specific setup.",
  },
  {
    id: "what-is-j-th",
    q: "What does J/TH mean?",
    a: "J/TH means joules per terahash: how much energy a miner uses for each trillion hashes. Lower is better, because a more efficient miner spends less on electricity for the same work.",
  },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function useInView<T extends Element>(threshold = 0.15) {
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

export default function HomeFaq() {
  const [open, setOpen] = useState<string | null>(faqs[0].id);
  const { ref, inView } = useInView<HTMLElement>();

  const reveal = (delay: number) => ({
    className: clsx(inView ? "animate-rise" : "opacity-0", "motion-reduce:animate-none motion-reduce:opacity-100"),
    style: { animationDelay: `${delay}ms` },
  });

  return (
    <section id="faq" ref={ref} aria-labelledby="home-faq-title" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-12 lg:gap-16">
        {/* ---------------- Left ---------------- */}
        <div className="lg:col-span-5">
          <div className="flex flex-col items-start gap-5 lg:sticky lg:top-28">
            <span
              {...reveal(0)}
              className={clsx(
                reveal(0).className,
                "inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground",
              )}
            >
              FAQ
            </span>
            <h2
              id="home-faq-title"
              {...reveal(80)}
              className={clsx(
                reveal(80).className,
                "text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground",
              )}
            >
              Questions, answered
            </h2>
            <p
              {...reveal(160)}
              className={clsx(reveal(160).className, "max-w-md text-[17px] leading-relaxed text-muted-foreground")}
            >
              The things people ask us most before they start mining. Can&rsquo;t find yours? We&rsquo;re happy to help.
            </p>

            {/* help card */}
            <div
              {...reveal(240)}
              className={clsx(
                reveal(240).className,
                "group mt-3 flex w-full max-w-md items-center gap-4 rounded-[24px] border border-border bg-card p-4 shadow-[0_12px_28px_-16px_rgba(16,47,59,0.3)] dark:shadow-[0_12px_28px_-16px_rgba(0,0,0,0.7)]",
              )}
            >
              <div className="relative size-20 flex-none rounded-2xl bg-accent">
                <div className="absolute inset-1 animate-float motion-reduce:animate-none">
                  <Image src="/rigs/antminer-s21-pro.png" alt="" fill sizes="80px" className="scale-[1.25] object-contain" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[15px] font-semibold text-card-foreground">
                  Still curious?
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary motion-reduce:animate-none dark:bg-chart-3" />
                    <span className="relative size-2 rounded-full bg-secondary dark:bg-chart-3" />
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">Our team replies within one business day.</p>
                <Link
                  href="/contact"
                  className="group/c mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Contact us
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/c:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <Link
              href="/faq"
              {...reveal(320)}
              className={clsx(
                reveal(320).className,
                "group/all inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-neutral-950",
              )}
            >
              See all questions
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/all:-translate-y-0.5 group-hover/all:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ---------------- Accordion ---------------- */}
        <ul className="flex flex-col gap-3 lg:col-span-7">
          {faqs.map((f, i) => {
            const isOpen = open === f.id;
            const r = reveal(200 + i * 70);
            return (
              <li
                key={f.id}
                style={r.style}
                className={clsx(
                  r.className,
                  "rounded-[22px] border transition-[border-color,background-color,box-shadow] duration-300",
                  isOpen
                    ? "border-primary/25 bg-card shadow-[0_16px_34px_-20px_rgba(16,47,59,0.45)] dark:shadow-[0_16px_34px_-20px_rgba(0,0,0,0.8)]"
                    : "border-border bg-card/60 hover:border-primary/25 hover:bg-card",
                )}
              >
                <h3>
                  <button
                    type="button"
                    id={`home-faq-q-${f.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`home-faq-a-${f.id}`}
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="group flex w-full items-center gap-4 rounded-[22px] px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-6"
                  >
                    <span
                      className={clsx(
                        "w-6 flex-none font-mono text-xs tabular-nums transition-colors duration-300",
                        isOpen ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={clsx(
                        "flex-1 text-base font-semibold transition-colors duration-300 sm:text-[17px]",
                        isOpen ? "text-card-foreground" : "text-card-foreground/85 group-hover:text-card-foreground",
                      )}
                    >
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "relative flex size-9 flex-none items-center justify-center rounded-full transition-all duration-300",
                        EASE,
                        isOpen
                          ? "rotate-180 bg-primary text-primary-foreground dark:text-neutral-950"
                          : "bg-accent text-accent-foreground group-hover:scale-110",
                      )}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                      <span
                        className={clsx(
                          "absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300",
                          EASE,
                          isOpen ? "scale-y-0" : "scale-y-100",
                        )}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={`home-faq-a-${f.id}`}
                  role="region"
                  aria-labelledby={`home-faq-q-${f.id}`}
                  inert={!isOpen}
                  className={clsx(
                    "grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none",
                    EASE,
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={clsx(
                        "pb-6 pl-[60px] pr-6 transition-transform duration-500 sm:pl-[64px] sm:pr-16",
                        EASE,
                        isOpen ? "translate-y-0" : "-translate-y-2",
                      )}
                    >
                      <p className="text-[15px] leading-7 text-muted-foreground">{f.a}</p>
                      <Link
                        href={`/faq#${f.id}`}
                        className="group/more mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Read more
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/more:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}