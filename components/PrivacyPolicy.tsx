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
const ENTITY = "Hanowallet"; // your registered company name, e.g. "Hanowallet Ltd"
const ADDRESS = "Garowe, Nugaal, Puntland, Somalia";
const EMAIL = "privacy@hanowallet.com";
const UPDATED = "November 9, 2026";
const MIN_AGE = 18;

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
  "We only collect what we need to reply to you and provide our services.",
  "We never sell your personal information.",
  "You can unsubscribe from our newsletter at any time.",
  "You can ask to see, correct or delete your information.",
];

const sections: { id: string; title: string; content: ReactNode }[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          This privacy policy explains how {ENTITY} (&ldquo;{COMPANY}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
          collects, uses and protects your personal information when you visit our website, contact us, subscribe to our
          newsletter or use our mining hardware, hosting and payout services.
        </p>
        <p>
          We are based in {ADDRESS}. For anything related to your privacy, you can reach us at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <p>
          <strong>Information you give us:</strong>
        </p>
        <ul>
          <li>
            <strong>Contact and quote requests:</strong> your name, email address, company name, the number of miners
            you&rsquo;re planning, the product you&rsquo;re asking about and your message.
          </li>
          <li>
            <strong>Newsletter:</strong> your email address and when you subscribed or unsubscribed.
          </li>
          <li>
            <strong>Account and orders:</strong> the details needed to set up your account, process orders and provide
            hosting, such as your contact details and the products you buy.
          </li>
          <li>
            <strong>Payout details:</strong> the wallet address where you want to receive mining rewards.
          </li>
        </ul>
        <p>
          <strong>Information collected automatically:</strong>
        </p>
        <ul>
          <li>Technical data such as your IP address, browser type, device and operating system.</li>
          <li>Usage data such as the pages you visit and the links you click.</li>
          <li>
            Information from cookies and similar technologies, explained in our <Link href="/cookies">cookie policy</Link>
            .
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Reply to your messages and prepare quotes.</li>
          <li>Provide our services, including selling hardware, hosting your miners and sending payouts.</li>
          <li>Send you our newsletter, if you&rsquo;ve subscribed.</li>
          <li>Keep our website and services secure, and prevent fraud and misuse.</li>
          <li>Understand how our website is used so we can improve it.</li>
          <li>Meet our legal and regulatory obligations.</li>
        </ul>
        <Callout>
          <p>We don&rsquo;t sell your personal information, and we don&rsquo;t share it for other companies&rsquo; advertising.</p>
        </Callout>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Why we're allowed to use it",
    content: (
      <>
        <p>Depending on the situation, we use your information because:</p>
        <ul>
          <li>
            <strong>It&rsquo;s needed for a contract</strong> with you, for example to deliver hardware or host your
            miners.
          </li>
          <li>
            <strong>You&rsquo;ve given consent</strong>, for example when you subscribe to our newsletter. You can
            withdraw consent at any time.
          </li>
          <li>
            <strong>We have a legitimate interest</strong>, such as keeping our services secure and improving them, in a
            way that doesn&rsquo;t override your rights.
          </li>
          <li>
            <strong>The law requires it</strong>, for example to keep certain financial records.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>We only share your information when it&rsquo;s necessary, with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who help us run {COMPANY}, such as website hosting, databases, email
            delivery and analytics. They may only use your information to provide their service to us.
          </li>
          <li>
            <strong>Partners needed to deliver your order</strong>, such as hardware suppliers, shipping companies and
            mining pools.
          </li>
          <li>
            <strong>Authorities</strong>, when we&rsquo;re legally required to, or to protect our rights, our customers
            or the public.
          </li>
          <li>
            <strong>A buyer or successor</strong>, if our business is reorganised, merged or sold.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    content: (
      <p>
        Some of our service providers may store or process information outside the country where you live. When that
        happens, we take reasonable steps to make sure your information stays protected in line with this policy.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <>
        <p>
          We keep your information only for as long as we need it for the purposes in this policy, or as long as the law
          requires. For example:
        </p>
        <ul>
          <li>Messages and quote requests are kept while we&rsquo;re in contact and for a reasonable period after.</li>
          <li>Newsletter details are kept until you unsubscribe.</li>
          <li>Order, hosting and payout records are kept for as long as accounting and legal rules require.</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <p>
        We use technical and organisational measures to protect your information, such as encrypted connections and
        restricted access to personal data. No system is completely secure, so we can&rsquo;t guarantee absolute
        security, but we work to keep your information safe and will act quickly if something goes wrong.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Ask for a copy of the information we hold about you.</li>
          <li>Ask us to correct information that&rsquo;s wrong or incomplete.</li>
          <li>Ask us to delete your information.</li>
          <li>Object to, or ask us to limit, how we use your information.</li>
          <li>Withdraw your consent at any time, for example by unsubscribing from our newsletter.</li>
        </ul>
        <p>
          To use any of these rights, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We may need to confirm your identity
          before we respond.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <p>
        We use cookies and similar technologies to keep our website working, remember your preferences and understand how
        the site is used. Read our <Link href="/cookies">cookie policy</Link> to learn more and how to manage them.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        Our services are only for people aged {MIN_AGE} or over. We don&rsquo;t knowingly collect information from
        children. If you believe a child has given us their information, please contact us and we&rsquo;ll delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. When we do, we&rsquo;ll change the &ldquo;last updated&rdquo; date at
        the top of this page, and if the changes are significant, we&rsquo;ll let you know by email or on our website.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          If you have questions or concerns about this policy or how we handle your information, email{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or use our <Link href="/contact">contact form</Link>.
        </p>
        <Callout>
          <p>
            {ENTITY}, {ADDRESS}
          </p>
        </Callout>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function PrivacyPolicy() {
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
            Privacy policy
          </h1>
          <p className="mt-4 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            We respect your privacy. This policy explains what information we collect, why we collect it and how you can manage it.
          </p>

          <div className="mt-6 flex animate-rise flex-wrap items-center gap-2 text-sm text-muted-foreground [animation-delay:240ms] motion-reduce:animate-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Calendar className="size-4" /> Last updated {UPDATED}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Clock className="size-4" /> 6 min read
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
                  <p className="text-lg font-semibold text-card-foreground">Questions about your privacy?</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Email{" "}
                    <a href={`mailto:${EMAIL}`} className="font-medium text-primary underline underline-offset-4">
                      {EMAIL}
                    </a>{" "}
                    or send us a message and we&rsquo;ll get back to you.
                  </p>
                </div>
                <Link
                  href="/cookies"
                  className="inline-flex h-11 flex-none items-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Cookie policy
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