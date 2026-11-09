import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp, Home, Mail, Server, ShoppingBag } from "lucide-react";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Page not found | Hanowallet",
  description: "The page you're looking for doesn't exist or has moved.",
};

const links = [
  { href: "/shop", icon: ShoppingBag, title: "Shop", body: "Browse mining rigs" },
  { href: "/services", icon: Server, title: "Services", body: "Hosting and payouts" },
  { href: "/faq", icon: CircleHelp, title: "FAQ", body: "Quick answers" },
  { href: "/contact", icon: Mail, title: "Contact", body: "Talk to our team" },
];

const BLADE = "M0 -18 C22 -28 34 -56 18 -76 C2 -68 -14 -46 -8 -19 Z";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** The "0" in 404 — a slowly spinning miner fan. */
function FanZero() {
  return (
    <svg
      viewBox="-100 -100 200 200"
      className="h-[0.8em] w-[0.8em] animate-pop [animation-delay:200ms] motion-reduce:animate-none"
      aria-hidden="true"
    >
      <circle r="92" className="fill-accent stroke-primary" strokeWidth="14" />
      <g className="origin-center animate-spin [animation-duration:5s] motion-reduce:animate-none">
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={BLADE} transform={`rotate(${(i * 360) / 7})`} className="fill-primary/80" />
        ))}
      </g>
      <g fill="none" className="stroke-primary/25" strokeWidth="2">
        <circle r="40" />
        <circle r="62" />
      </g>
      <circle r="20" className="fill-primary" />
      <circle r="8" className="fill-secondary dark:fill-chart-3" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center overflow-hidden bg-background px-6 pb-20 pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <span className="inline-flex animate-rise items-center gap-2 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground motion-reduce:animate-none">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#F2B33D] motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-[#F2B33D]" />
          </span>
          Error 404 · Page offline
        </span>

        {/* 4 [fan] 4 */}
        <p
          className="mt-6 flex items-center gap-[0.04em] text-[clamp(6rem,20vw,11rem)] font-bold leading-none tracking-[-0.06em] text-foreground"
          aria-label="404"
        >
          <span className="animate-rise [animation-delay:80ms] motion-reduce:animate-none" aria-hidden="true">
            4
          </span>
          <FanZero />
          <span className="animate-rise [animation-delay:160ms] motion-reduce:animate-none" aria-hidden="true">
            4
          </span>
        </p>

        <h1 className="mt-6 animate-rise text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-[-0.03em] text-foreground [animation-delay:260ms] motion-reduce:animate-none">
          This page went offline
        </h1>
        <p className="mt-3 max-w-md animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:320ms] motion-reduce:animate-none sm:text-lg">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Let&rsquo;s get you back to mining.
        </p>

        <div className="mt-8 flex animate-rise flex-wrap justify-center gap-3 [animation-delay:380ms] motion-reduce:animate-none">
          <Link
            href="/"
            className="group/home inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(31,66,115,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950"
          >
            <Home className="size-4" />
            Back to home
          </Link>
          <BackButton className="group/back inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-6 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>

        {/* quick links */}
        <nav aria-label="Popular pages" className="mt-14 w-full">
          <p className="animate-rise text-sm font-medium text-muted-foreground [animation-delay:440ms] motion-reduce:animate-none">
            Or try one of these
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {links.map(({ href, icon: Icon, title, body }, i) => (
              <li key={href} className="animate-rise motion-reduce:animate-none" style={{ animationDelay: `${500 + i * 70}ms` }}>
                <Link
                  href={href}
                  className={`group flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_14px_30px_-18px_rgba(16,47,59,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${EASE}`}
                >
                  <span className="relative flex size-10 items-center justify-center">
                    <span className={`absolute inset-0 rounded-xl bg-accent transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${EASE}`} />
                    <Icon className={`relative size-[18px] text-accent-foreground transition-transform duration-500 group-hover:-rotate-6 ${EASE}`} />
                  </span>
                  <span className="flex w-full items-end justify-between gap-2">
                    <span>
                      <span className="block text-[15px] font-semibold text-card-foreground">{title}</span>
                      <span className="block text-xs text-muted-foreground">{body}</span>
                    </span>
                    <ArrowRight
                      className={`size-4 flex-none -translate-x-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${EASE}`}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}