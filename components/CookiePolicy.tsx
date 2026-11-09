"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  FileText,
  Info,
  Link2,
  Printer,
  ShieldCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Details — update these and the whole page follows.                  */
/* ------------------------------------------------------------------ */
const COMPANY = "Hanowallet";
const EMAIL = "privacy@hanowallet.com";
const UPDATED = "November 9, 2026";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function useInView<T extends Element>() {
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={clsx(inView ? "animate-rise" : "opacity-0", "motion-reduce:animate-none motion-reduce:opacity-100", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Callout({ tone = "info", children }: { tone?: "info" | "warning"; children: ReactNode }) {
  const warn = tone === "warning";
  return (
    <div
      className={clsx(
        "mt-5 flex gap-3 rounded-2xl border p-4",
        warn ? "border-[#F2B33D]/40 bg-[#F2B33D]/10" : "border-primary/20 bg-accent/60",
      )}
    >
      {warn ? (
        <AlertTriangle className="mt-1 size-5 flex-none text-[#B7791F] dark:text-[#F2B33D]" aria-hidden="true" />
      ) : (
        <Info className="mt-1 size-5 flex-none text-primary" aria-hidden="true" />
      )}
      <div className="text-[15px] leading-7 text-foreground [&_p]:!mt-0 [&_p]:!text-foreground">{children}</div>
    </div>
  );
}

/* typography for section content */
const prose = clsx(
  "[&_p]:mt-4 [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-muted-foreground sm:[&_p]:text-base",
  "[&_ul]:mt-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5",
  "[&_li]:relative [&_li]:pl-6 [&_li]:text-[15px] [&_li]:leading-7 [&_li]:text-muted-foreground sm:[&_li]:text-base",
  "[&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[0.72em] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-secondary dark:[&_li]:before:bg-chart-3",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary",
);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
const summary = [
  "Cookies help our website work and remember your preferences.",
  "Essential cookies are always on; others only with your choice where required.",
  "We don't use cookies to sell your information.",
  "You can block or delete cookies in your browser at any time.",
];

/* Edit this table to match the cookies your site actually sets. */
const cookieTypes = [
  {
    type: "Essential",
    purpose: "Keep the website secure and working, for example forms and page loading.",
    examples: "Security and session cookies",
    duration: "Session to 1 year",
    required: true,
  },
  {
    type: "Preferences",
    purpose: "Remember your choices, such as light or dark mode.",
    examples: "Theme setting (browser storage)",
    duration: "Until you clear it",
    required: false,
  },
  {
    type: "Analytics",
    purpose: "Help us understand which pages are used, so we can improve the site.",
    examples: "Anonymous usage statistics",
    duration: "Up to 2 years",
    required: false,
  },
];

const sections: { id: string; title: string; content: ReactNode }[] = [
  {
    id: "what-are-cookies",
    title: "What cookies are",
    content: (
      <>
        <p>
          Cookies are small text files that a website saves on your device when you visit it. They let the site remember
          things like your settings, or recognise your device when you come back.
        </p>
        <p>
          Websites can also use similar technologies, such as browser storage (for example local storage). In this
          policy, we call all of these &ldquo;cookies&rdquo;.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use cookies",
    content: (
      <>
        <p>{COMPANY} uses cookies to:</p>
        <ul>
          <li>Make the website work properly and keep it secure.</li>
          <li>Remember your preferences, such as light or dark mode.</li>
          <li>Understand how visitors use the website, so we can improve it.</li>
        </ul>
        <Callout>
          <p>
            We don&rsquo;t use cookies to sell your information, and we don&rsquo;t currently use advertising cookies. If
            that changes, we&rsquo;ll update this policy and ask for your consent where required.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "types",
    title: "The cookies we use",
    content: (
      <>
        <p>Here are the types of cookies used on our website:</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="p-4 font-semibold text-foreground">Type</th>
                <th scope="col" className="p-4 font-semibold text-foreground">What it does</th>
                <th scope="col" className="p-4 font-semibold text-foreground">Examples</th>
                <th scope="col" className="p-4 font-semibold text-foreground">How long</th>
              </tr>
            </thead>
            <tbody>
              {cookieTypes.map((c) => (
                <tr key={c.type} className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/40">
                  <th scope="row" className="p-4 align-top font-semibold text-foreground">
                    <span className="flex flex-col items-start gap-1.5">
                      {c.type}
                      <span
                        className={clsx(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          c.required ? "bg-[#1F4273] text-white" : "bg-accent text-accent-foreground",
                        )}
                      >
                        {c.required ? "Always on" : "Optional"}
                      </span>
                    </span>
                  </th>
                  <td className="p-4 align-top leading-relaxed text-muted-foreground">{c.purpose}</td>
                  <td className="p-4 align-top leading-relaxed text-muted-foreground">{c.examples}</td>
                  <td className="p-4 align-top text-muted-foreground">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-party content",
    content: (
      <>
        <p>Some parts of our website load content from other services, which may set their own cookies or receive your IP address:</p>
        <ul>
          <li>
            <strong>OpenStreetMap:</strong> the map on our <Link href="/contact">contact page</Link> is loaded from
            OpenStreetMap.
          </li>
          <li>
            <strong>Google Maps:</strong> only if you click &ldquo;Directions&rdquo;, which opens Google Maps in a new tab.
          </li>
          <li>
            <strong>Google Fonts and similar services</strong>, if used to load fonts or other website resources.
          </li>
        </ul>
        <p>These services have their own privacy and cookie policies, which we don&rsquo;t control.</p>
      </>
    ),
  },
  {
    id: "managing",
    title: "Managing cookies",
    content: (
      <>
        <p>You&rsquo;re in control. You can:</p>
        <ul>
          <li>
            <strong>Block or delete cookies</strong> in your browser settings. Most browsers have this under
            &ldquo;Privacy&rdquo; or &ldquo;Privacy and security&rdquo;.
          </li>
          <li>
            <strong>Clear browser storage</strong> to reset preferences such as dark mode.
          </li>
          <li>
            <strong>Use private or incognito mode</strong>, which deletes cookies when you close the window.
          </li>
        </ul>
        <Callout tone="warning">
          <p>If you block essential cookies, some parts of the website, such as forms, may not work properly.</p>
        </Callout>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Your personal information",
    content: (
      <p>
        Some cookies may collect information that counts as personal information, such as your IP address. To learn how
        we handle personal information and what rights you have, read our <Link href="/privacy">privacy policy</Link>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this cookie policy when we change the cookies we use or when the law changes. We&rsquo;ll update
        the &ldquo;last updated&rdquo; date at the top of this page whenever we do.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        Questions about cookies? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or use our{" "}
        <Link href="/contact">contact form</Link>.
      </p>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function CookiePolicy() {
  const [active, setActive] = useState(sections[0].id);
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

  /* highlight the section being read */
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
  }, []);

  /* sliding line in the table of contents */
  const tocRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState<{ top: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const el = tocRefs.current[active];
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
          <span className="inline-flex animate-rise items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground motion-reduce:animate-none">
            <FileText className="size-3.5" />
            Legal
          </span>

          <h1 className="mt-6 max-w-3xl animate-rise text-[clamp(2.1rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            Cookie policy
          </h1>
          <p className="mt-4 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            This policy explains what cookies are, which ones our website uses and how you can control them.
          </p>

          <div className="mt-6 flex animate-rise flex-wrap items-center gap-2 text-sm text-muted-foreground [animation-delay:240ms] motion-reduce:animate-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Calendar className="size-4" /> Last updated {UPDATED}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Clock className="size-4" /> 4 min read
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden"
            >
              <Printer className="size-4" /> Print or save as PDF
            </button>
          </div>

          {/* short version */}
          <div className="mt-10 animate-rise rounded-[28px] border border-primary/15 bg-accent/60 p-6 [animation-delay:320ms] motion-reduce:animate-none sm:p-8">
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
              This summary is for convenience only. The full policy below is what applies.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Body ================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-12">
          {/* table of contents */}
          <aside className="lg:col-span-3 print:hidden">
            {/* phones and tablets */}
            <details className="group rounded-2xl border border-border bg-card lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                On this page
                <span className="text-muted-foreground transition-transform duration-300 group-open:rotate-180">⌄</span>
              </summary>
              <ol className="border-t border-border p-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
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

          {/* sections */}
          <article className="lg:col-span-9 lg:max-w-[760px]">
            {sections.map((s, i) => (
              <Reveal key={s.id}>
                <section
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
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
                </section>
              </Reveal>
            ))}

            {/* questions */}
            <Reveal>
              <div className="mt-16 flex flex-col gap-5 rounded-[28px] border border-border bg-card p-6 shadow-[0_12px_32px_-18px_rgba(16,47,59,0.3)] sm:flex-row sm:items-center sm:p-8 print:hidden">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-card-foreground">Questions about cookies?</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Email{" "}
                    <a href={`mailto:${EMAIL}`} className="font-medium text-primary underline underline-offset-4">
                      {EMAIL}
                    </a>{" "}
                    or send us a message and we&rsquo;ll get back to you.
                  </p>
                </div>
                <Link
                  href="/privacy"
                  className="inline-flex h-11 flex-none items-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Privacy policy
                </Link>
                <Link
                  href="/contact"
                  className="group/c inline-flex h-11 flex-none items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950"
                >
                  Contact us
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/c:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </article>
        </div>
      </section>
    </main>
  );
}