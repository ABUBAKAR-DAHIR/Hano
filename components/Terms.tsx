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
const JURISDICTION = "Puntland, Somalia";
const EMAIL = "legal@hanowallet.com";
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
  `You must be ${MIN_AGE} or over and allowed to mine where you live.`,
  "Orders are confirmed in writing; prices exclude taxes and fees unless stated.",
  "We take good care of hosted miners, but can't guarantee zero downtime.",
  "Mining rewards aren't guaranteed, and payouts go to the wallet you choose.",
];

const sections: { id: string; title: string; content: ReactNode }[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    content: (
      <>
        <p>
          These terms of service (&ldquo;Terms&rdquo;) apply when you use the {COMPANY} website and our services,
          including buying mining hardware, managed hosting and payouts (together, the &ldquo;Services&rdquo;). They form
          an agreement between you and {ENTITY}, based in {ADDRESS}.
        </p>
        <p>
          By using our Services, you agree to these Terms. If you don&rsquo;t agree, please don&rsquo;t use the
          Services. Some Services, such as hosting, may also have their own agreement; if it conflicts with these Terms,
          that agreement applies.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use Hanowallet",
    content: (
      <ul>
        <li>You must be at least {MIN_AGE} years old and able to enter into a binding contract.</li>
        <li>
          You&rsquo;re responsible for making sure that buying mining hardware and mining Bitcoin is legal where you
          live.
        </li>
        <li>
          If you use the Services on behalf of a company, you confirm that you&rsquo;re authorised to accept these Terms
          for it.
        </li>
      </ul>
    ),
  },
  {
    id: "services",
    title: "Our services",
    content: (
      <>
        <p>Depending on what you choose, we may:</p>
        <ul>
          <li>Help you choose and buy ASIC mining hardware.</li>
          <li>Host your miners in our facility, including setup, monitoring and maintenance.</li>
          <li>Connect your miners to a mining pool and send rewards to the wallet you choose.</li>
        </ul>
        <p>
          We may change, add or stop parts of the Services. If a change significantly affects a service you&rsquo;ve
          paid for, we&rsquo;ll let you know in advance where we reasonably can.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    content: (
      <ul>
        <li>Give us accurate information and keep it up to date.</li>
        <li>Keep your login details private. You&rsquo;re responsible for activity on your account.</li>
        <li>Tell us straight away if you think someone else has accessed your account.</li>
      </ul>
    ),
  },
  {
    id: "orders",
    title: "Quotes, orders and payment",
    content: (
      <>
        <ul>
          <li>
            Prices are shown in the currency listed on each product. Quotes are valid for the period stated in the
            quote.
          </li>
          <li>
            An order is only accepted once we confirm it in writing. We may decline or cancel an order, for example if a
            product is out of stock or a price was shown in error, and we&rsquo;ll refund any payment in that case.
          </li>
          <li>Unless stated otherwise, prices don&rsquo;t include taxes, duties, shipping or hosting fees.</li>
          <li>Delivery times are estimates and may change because of suppliers, shipping or customs.</li>
        </ul>
        <p>
          Hardware is usually covered by the manufacturer&rsquo;s warranty. We&rsquo;ll share the warranty details with
          your order and help you make a claim where we can.
        </p>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hosting",
    content: (
      <>
        <p>
          When we host your miners, we&rsquo;ll take reasonable care to keep them running, cooled and connected.
          However:
        </p>
        <ul>
          <li>
            We can&rsquo;t guarantee uninterrupted operation. Power outages, maintenance, network issues and other events
            may cause downtime.
          </li>
          <li>We may need to switch miners off for maintenance, safety or legal reasons.</li>
          <li>Hosting fees, power costs and service levels are set out in your hosting agreement or quote.</li>
          <li>You remain the owner of your hardware unless agreed otherwise in writing.</li>
        </ul>
      </>
    ),
  },
  {
    id: "rewards",
    title: "Mining rewards and payouts",
    content: (
      <>
        <ul>
          <li>
            Mining rewards depend on factors outside our control, including network difficulty, transaction fees,
            uptime and pool performance.
          </li>
          <li>We don&rsquo;t guarantee any level of rewards, earnings or return on investment.</li>
          <li>
            Payouts are sent to the wallet address you provide. You&rsquo;re responsible for making sure it&rsquo;s
            correct, because Bitcoin transactions can&rsquo;t be reversed.
          </li>
          <li>Payout timing and minimums depend on the pool and your agreement with us.</li>
        </ul>
        <Callout tone="warning">
          <p>
            Bitcoin mining involves financial risk. Please read our <Link href="/risk">risk disclosure</Link> before
            buying hardware or hosting.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>When using the Services, you agree not to:</p>
        <ul>
          <li>Break any law or use the Services for illegal activity, including money laundering or fraud.</li>
          <li>Try to access accounts, systems or data that aren&rsquo;t yours.</li>
          <li>Interfere with the website or Services, for example with malware, scraping or overloading them.</li>
          <li>Give false information or pretend to be someone else.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <p>
        The {COMPANY} name, logo, website design and content belong to us or our licensors. You may use the website for
        your own personal or business use of the Services, but you may not copy, sell or reuse its content without our
        permission. Product names and brands of manufacturers, such as Bitmain and MicroBT, belong to their respective
        owners.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    content: (
      <p>
        The Services rely on third parties such as hardware manufacturers, mining pools, shipping companies and payment
        providers. We&rsquo;re not responsible for their products, services or terms, although we&rsquo;ll help you
        where we reasonably can.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <p>
        Except where the law says otherwise, the Services and website are provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo;. Information on the website, including specifications and estimates, is provided for general
        information and may change. Nothing on the website is financial, investment, legal or tax advice.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>To the fullest extent allowed by law:</p>
        <ul>
          <li>
            We&rsquo;re not liable for indirect or consequential losses, or for lost profits, lost mining rewards or lost
            data.
          </li>
          <li>
            Our total liability for any claim related to the Services is limited to the amount you paid us for the
            service the claim relates to in the 12 months before the claim.
          </li>
        </ul>
        <p>Nothing in these Terms limits liability that can&rsquo;t be limited by law.</p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: (
      <p>
        You agree to cover any losses or costs we incur because you broke these Terms, misused the Services or broke the
        law while using them.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Ending the agreement",
    content: (
      <p>
        You can stop using the Services at any time. We may suspend or close your account if you break these Terms or if
        we&rsquo;re required to by law. Any fees already owed, and any sections of these Terms that by their nature
        should continue, still apply after the agreement ends.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    content: (
      <p>
        These Terms are governed by the laws applicable in {JURISDICTION}. If a dispute comes up, please contact us first
        so we can try to resolve it together. If we can&rsquo;t, the dispute will be handled by the competent courts of{" "}
        {JURISDICTION}, unless the law where you live gives you a different right.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these Terms from time to time. We&rsquo;ll change the &ldquo;last updated&rdquo; date at the top of
        this page, and if the changes are significant, we&rsquo;ll let you know in advance. Continuing to use the
        Services after changes take effect means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>
          Questions about these Terms? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or use our{" "}
          <Link href="/contact">contact form</Link>.
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
export default function TermsOfService() {
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
            Terms of service
          </h1>
          <p className="mt-4 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            These terms explain the rules for using {COMPANY}&rsquo;s website and services, and what you can expect from
            us.
          </p>

          <div className="mt-6 flex animate-rise flex-wrap items-center gap-2 text-sm text-muted-foreground [animation-delay:240ms] motion-reduce:animate-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Calendar className="size-4" /> Last updated {UPDATED}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Clock className="size-4" /> 8 min read
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
              This summary is for convenience only. The full terms below are what apply.
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
                  <p className="text-lg font-semibold text-card-foreground">Questions about these terms?</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Email{" "}
                    <a href={`mailto:${EMAIL}`} className="font-medium text-primary underline underline-offset-4">
                      {EMAIL}
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
          </article>
        </div>
      </section>
    </main>
  );
}