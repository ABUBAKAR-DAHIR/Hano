"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Calendar, Check, Clock, FileText, Link2, Printer, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import { LEGAL, LEGAL_DOCS, type LegalDocId } from "./Legal";

export type LegalSection = { id: string; title: string; content: ReactNode };

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* typographic styles for the section content */
const prose = clsx(
  "[&_p]:mt-4 [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-muted-foreground sm:[&_p]:text-base",
  "[&_ul]:mt-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5",
  "[&_li]:relative [&_li]:pl-6 [&_li]:text-[15px] [&_li]:leading-7 [&_li]:text-muted-foreground sm:[&_li]:text-base",
  "[&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[0.72em] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-secondary dark:[&_li]:before:bg-chart-3",
  "[&_h3]:mt-7 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary",
);

export default function LegalPage({
  current,
  title,
  description,
  readingMinutes,
  summary,
  sections,
}: {
  current: LegalDocId;
  title: string;
  description: string;
  readingMinutes: number;
  summary: string[];
  sections: LegalSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const [copied, setCopied] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* reading progress bar */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* scroll-spy for the table of contents */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  /* sliding indicator in the table of contents */
  const tocRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState<{ top: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const el = active ? tocRefs.current[active] : null;
    if (el) setInd({ top: el.offsetTop, height: el.offsetHeight });
  }, [active]);

  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const others = LEGAL_DOCS.filter((d) => d.id !== current);

  return (
    <main className="bg-background">
      {/* reading progress */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] print:hidden" aria-hidden="true">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-primary to-secondary dark:to-chart-3" />
      </div>

      {/* ================= Header ================= */}
      <section className="relative overflow-hidden px-6 pb-12 pt-32 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)] print:hidden"
        />
        <div className="relative mx-auto max-w-[1200px]">
          {/* document switcher */}
          <nav aria-label="Legal documents" className="animate-rise motion-reduce:animate-none print:hidden">
            <ul className="flex flex-wrap gap-1.5">
              {LEGAL_DOCS.map((d) => {
                const on = d.id === current;
                return (
                  <li key={d.id}>
                    <Link
                      href={d.href}
                      aria-current={on ? "page" : undefined}
                      className={clsx(
                        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all duration-300",
                        EASE,
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        on
                          ? "border-primary bg-primary text-primary-foreground dark:text-neutral-950"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {on && <FileText className="size-3.5" />}
                      {d.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <h1 className="mt-8 max-w-3xl animate-rise text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            {description}
          </p>

          <div className="mt-6 flex animate-rise flex-wrap items-center gap-2 text-sm text-muted-foreground [animation-delay:240ms] motion-reduce:animate-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Calendar className="size-4" /> Last updated {LEGAL.updated}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Clock className="size-4" /> {readingMinutes} min read
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden"
            >
              <Printer className="size-4" /> Print or save as PDF
            </button>
          </div>

          {/* summary */}
          <div className="mt-10 animate-rise overflow-hidden rounded-[28px] border border-primary/15 bg-accent/60 p-6 [animation-delay:320ms] motion-reduce:animate-none sm:p-8">
            <h2 className="flex items-center gap-2 text-base font-semibold text-accent-foreground">
              <ShieldCheck className="size-5" /> The short version
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {summary.map((s, i) => (
                <li
                  key={s}
                  className="flex animate-rise items-start gap-3 text-[15px] leading-relaxed text-foreground motion-reduce:animate-none"
                  style={{ animationDelay: `${400 + i * 70}ms` }}
                >
                  <span className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full bg-[#1F4273] text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-accent-foreground/80">
              This summary is for convenience only. The full text below is what applies.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Body ================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-12">
          {/* table of contents */}
          <aside className="lg:col-span-3 print:hidden">
            {/* mobile */}
            <details className="group rounded-2xl border border-border bg-card lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                On this page
                <span className="text-muted-foreground transition-transform duration-300 group-open:rotate-180">⌄</span>
              </summary>
              <ol className="border-t border-border p-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                      <span className="w-5 font-mono text-xs leading-5">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            {/* desktop */}
            <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
              <ol className="relative mt-4 border-l border-border">
                {ind && (
                  <span
                    aria-hidden="true"
                    className={clsx("absolute -left-px w-0.5 rounded-full bg-primary transition-[top,height] duration-500", EASE)}
                    style={{ top: ind.top, height: ind.height }}
                  />
                )}
                {sections.map((s, i) => {
                  const on = active === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        ref={(el) => {
                          tocRefs.current[s.id] = el;
                        }}
                        href={`#${s.id}`}
                        aria-current={on ? "location" : undefined}
                        className={clsx(
                          "flex gap-2.5 py-1.5 pl-4 text-sm leading-snug transition-colors duration-300",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          on ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span className="w-5 flex-none font-mono text-[11px] leading-5 opacity-70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          {/* content */}
          <article className="lg:col-span-9 lg:max-w-[760px]">
            {sections.map((s, i) => (
              <Reveal key={s.id} as="section">
                <div
                  id={s.id}
                  className={clsx("group/sec scroll-mt-28", i > 0 && "mt-12 border-t border-border pt-12")}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex size-9 flex-none items-center justify-center rounded-xl bg-accent font-mono text-xs font-semibold text-accent-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 id={`${s.id}-title`} className="flex-1 pt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {s.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => copy(s.id)}
                      aria-label={`Copy link to “${s.title}”`}
                      className="mt-1 flex size-9 flex-none items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all duration-300 hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/sec:opacity-100 print:hidden"
                    >
                      {copied === s.id ? (
                        <Check className="size-4 animate-pop text-primary motion-reduce:animate-none" strokeWidth={2.5} />
                      ) : (
                        <Link2 className="size-4" />
                      )}
                    </button>
                  </div>
                  <div className={clsx("pl-[52px]", prose)}>{s.content}</div>
                </div>
              </Reveal>
            ))}

            {/* questions */}
            <Reveal>
              <div className="mt-16 flex flex-col gap-5 rounded-[28px] border border-border bg-card p-6 shadow-[0_12px_32px_-18px_rgba(16,47,59,0.3)] sm:flex-row sm:items-center sm:p-8 print:hidden">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-card-foreground">Questions about this page?</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Email{" "}
                    <a href={`mailto:${LEGAL.email}`} className="font-medium text-primary underline underline-offset-4">
                      {LEGAL.email}
                    </a>{" "}
                    or send us a message and we&rsquo;ll get back to you.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="group/c inline-flex h-11 flex-none items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950"
                >
                  Contact us
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/c:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>

            {/* related */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 print:hidden">
              {others.map((d, i) => (
                <Reveal key={d.id} delay={i * 80}>
                  <Link
                    href={d.href}
                    className={clsx(
                      "group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_14px_30px_-18px_rgba(16,47,59,0.45)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      EASE,
                    )}
                  >
                    <span className="relative flex size-11 flex-none items-center justify-center">
                      <span className={clsx("absolute inset-0 rounded-xl bg-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110", EASE)} />
                      <FileText className="relative size-5 text-accent-foreground" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-card-foreground">{d.title}</span>
                      <span className="block text-sm text-muted-foreground">{d.body}</span>
                    </span>
                    <ArrowUpRight className="size-5 flex-none text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}