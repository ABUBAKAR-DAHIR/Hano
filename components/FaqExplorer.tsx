"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, Link2, Search, ThumbsDown, ThumbsUp, X } from "lucide-react";

export type Faq = { id: string; category: string; q: string; a: string };

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const ALL = "All";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps every search term found in `text` with a soft highlight. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-secondary/40 px-0.5 text-inherit dark:bg-chart-3/30">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export default function FaqExplorer({ faqs, categories }: { faqs: Faq[]; categories: string[] }) {
  const tabs = [ALL, ...categories];
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const [copied, setCopied] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, "yes" | "no">>({});
  const searchRef = useRef<HTMLInputElement>(null);

  const terms = useMemo(() => query.trim().toLowerCase().split(/\s+/).filter(Boolean), [query]);

  const results = useMemo(
    () =>
      faqs.filter((f) => {
        if (category !== ALL && f.category !== category) return false;
        const hay = `${f.q} ${f.a}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      }),
    [faqs, category, terms],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: faqs.length };
    faqs.forEach((f) => (c[f.category] = (c[f.category] ?? 0) + 1));
    return c;
  }, [faqs]);

  /* open a question from the URL hash, e.g. /faq#what-is-j-th */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || !faqs.some((f) => f.id === id)) return;
    setCategory(ALL);
    setOpen(id);
    requestAnimationFrame(() => document.getElementById(`faq-${id}`)?.scrollIntoView({ block: "center" }));
  }, [faqs]);

  /* press "/" to jump to search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* sliding pill behind the active category */
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[category];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    const id = requestAnimationFrame(() => setReady(true));
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(id);
    };
  }, [category]);

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* ---------------- Search ---------------- */}
      <div className="animate-rise [animation-delay:240ms] motion-reduce:animate-none">
        <label htmlFor="faq-search" className="sr-only">
          Search questions
        </label>
        <div className="group relative flex items-center rounded-2xl border border-border bg-card shadow-[0_10px_28px_-16px_rgba(16,47,59,0.3)] transition-[border-color,box-shadow] duration-300 focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]">
          <Search className="pointer-events-none absolute left-4 size-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            ref={searchRef}
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, like “hosting” or “J/TH”"
            autoComplete="off"
            className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-24 text-[15px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-3 flex size-9 animate-pop items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:animate-none"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-4 hidden rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground sm:block">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* ---------------- Categories ---------------- */}
      <div className="mt-5 flex animate-rise justify-center [animation-delay:320ms] motion-reduce:animate-none">
        <div
          role="tablist"
          aria-label="Question categories"
          className="max-w-full overflow-x-auto rounded-full border border-border bg-card p-1.5 [scrollbar-width:none]"
        >
          <div className="relative flex">
            {pill && (
              <span
                aria-hidden="true"
                className={clsx("absolute inset-y-0 rounded-full bg-primary", ready && `transition-[left,width] duration-500 ${EASE}`)}
                style={{ left: pill.left, width: pill.width }}
              />
            )}
            {tabs.map((t) => {
              const active = category === t;
              return (
                <button
                  key={t}
                  ref={(el) => {
                    tabRefs.current[t] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="faq-list"
                  onClick={() => setCategory(t)}
                  className={clsx(
                    "relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-primary-foreground dark:text-neutral-950" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                  <span
                    className={clsx(
                      "rounded-full px-1.5 text-[11px] tabular-nums transition-colors duration-300",
                      active ? "bg-white/20 dark:bg-black/15" : "bg-muted",
                    )}
                  >
                    {counts[t] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "question" : "questions"} found
      </p>

      {/* ---------------- List ---------------- */}
      <div id="faq-list" role="tabpanel" className="mt-8">
        {results.length === 0 ? (
          <div className="flex animate-swap flex-col items-center rounded-[28px] border border-dashed border-border bg-card px-6 py-12 text-center motion-reduce:animate-none">
            <div className="relative size-24 animate-float motion-reduce:animate-none">
              <Image src="/rigs/whatsminer-m60s.png" alt="" fill sizes="96px" className="scale-[1.3] object-contain" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-card-foreground">No answers found</h2>
            <p className="mt-1.5 max-w-sm text-[15px] text-muted-foreground">
              We couldn&rsquo;t find anything for &ldquo;{query}&rdquo;. Try another word, or ask our team directly.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(ALL);
                }}
                className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear search
              </button>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-neutral-950"
              >
                Contact us
              </Link>
            </div>
          </div>
        ) : (
          <ul key={`${category}|${terms.join(" ")}`} className="flex flex-col gap-3">
            {results.map((f, i) => {
              const isOpen = open === f.id;
              const vote = votes[f.id];
              return (
                <li
                  key={f.id}
                  id={`faq-${f.id}`}
                  className={clsx(
                    "animate-rise scroll-mt-32 rounded-2xl border bg-card transition-[border-color,box-shadow,background-color] duration-300 motion-reduce:animate-none",
                    isOpen
                      ? "border-primary/30 shadow-[0_14px_30px_-18px_rgba(16,47,59,0.4)]"
                      : "border-border hover:border-primary/25",
                  )}
                  style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                >
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${f.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${f.id}`}
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      className="group flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-6 sm:py-5"
                    >
                      <span className="flex-1">
                        {category === ALL && !terms.length && (
                          <span className="mb-1 block text-xs font-medium text-primary">{f.category}</span>
                        )}
                        <span className="text-[15px] font-semibold text-card-foreground sm:text-base">
                          <Highlight text={f.q} terms={terms} />
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "relative flex size-8 flex-none items-center justify-center rounded-full transition-colors duration-300",
                          isOpen ? "bg-primary text-primary-foreground dark:text-neutral-950" : "bg-accent text-accent-foreground group-hover:bg-primary/15",
                        )}
                      >
                        <span className="absolute h-0.5 w-3 rounded-full bg-current" />
                        <span
                          className={clsx(
                            "absolute h-3 w-0.5 rounded-full bg-current transition-transform duration-300",
                            EASE,
                            isOpen ? "rotate-90 scale-y-0" : "rotate-0",
                          )}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`faq-a-${f.id}`}
                    role="region"
                    aria-labelledby={`faq-q-${f.id}`}
                    inert={!isOpen}
                    className={clsx(
                      "grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none",
                      EASE,
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                        <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
                          <Highlight text={f.a} terms={terms} />
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                          {vote ? (
                            <p className="flex animate-pop items-center gap-2 text-sm text-muted-foreground motion-reduce:animate-none" role="status">
                              <span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                <Check className="size-3.5" strokeWidth={3} />
                              </span>
                              {vote === "yes" ? "Glad it helped!" : "Thanks, we'll work on this answer."}
                            </p>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              Was this helpful?
                              {(["yes", "no"] as const).map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setVotes((s) => ({ ...s, [f.id]: v }))}
                                  aria-label={v === "yes" ? "Yes, this was helpful" : "No, this wasn't helpful"}
                                  className="flex size-9 items-center justify-center rounded-full border border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  {v === "yes" ? <ThumbsUp className="size-4" /> : <ThumbsDown className="size-4" />}
                                </button>
                              ))}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => copyLink(f.id)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {copied === f.id ? (
                              <>
                                <Check className="size-4 animate-pop text-primary motion-reduce:animate-none" strokeWidth={2.5} />
                                Link copied
                              </>
                            ) : (
                              <>
                                <Link2 className="size-4" />
                                Copy link
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}