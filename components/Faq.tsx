import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import FaqExplorer, { type Faq } from "@/components/FaqExplorer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "FAQ | Hanowallet",
  description:
    "Answers to common questions about Bitcoin mining hardware, managed hosting, payouts and your Hanowallet account.",
};

/* ------------------------------------------------------------------ */
/* Questions — answers are drafts written to match the rest of the     */
/* site. Check every one reflects how you actually operate.            */
/* ------------------------------------------------------------------ */
const categories = ["Getting started", "Hardware", "Hosting", "Payouts", "Account & security"] as const;

const faqs: Faq[] = [
  // Getting started
  {
    id: "what-is-bitcoin-mining",
    category: "Getting started",
    q: "What is Bitcoin mining?",
    a: "Mining is how new Bitcoin transactions are confirmed and added to the blockchain. Specialised computers race to solve a cryptographic puzzle, and the miner who solves it earns newly created bitcoin plus transaction fees. Pools combine many miners so rewards arrive in smaller, steadier amounts.",
  },
  {
    id: "need-technical-experience",
    category: "Getting started",
    q: "Do I need technical experience?",
    a: "Not at all. We help you choose a rig, then install, configure and connect it to a pool for you. You simply follow your miner's performance and receive rewards in your Hanowallet.",
  },
  {
    id: "how-to-get-started",
    category: "Getting started",
    q: "How do I get started?",
    a: "Create your account, choose a rig, and we'll host and set it up in our facility. Once it's online and connected to a pool, rewards start arriving in your wallet.",
  },
  {
    id: "mine-at-home",
    category: "Getting started",
    q: "Can I mine at home instead?",
    a: "You can, but ASIC miners are loud, produce a lot of heat and need a strong power supply. Hosting your miner with us avoids the noise and heat at home and puts it in an environment built for mining.",
  },
  // Hardware
  {
    id: "what-is-an-asic",
    category: "Hardware",
    q: "What is an ASIC miner?",
    a: "ASIC stands for application-specific integrated circuit. An ASIC miner is a machine built to do one job, running Bitcoin's SHA-256 algorithm, far more efficiently than a regular computer or graphics card.",
  },
  {
    id: "what-is-j-th",
    category: "Hardware",
    q: "What does J/TH mean?",
    a: "J/TH means joules per terahash: how much energy a miner uses for each trillion hashes. Lower is better, because a more efficient miner spends less on electricity for the same work.",
  },
  {
    id: "air-or-hydro",
    category: "Hardware",
    q: "What's the difference between air-cooled and hydro-cooled rigs?",
    a: "Air-cooled rigs use fans and are the most common and flexible option. Hydro-cooled rigs use liquid to carry heat away, which makes them quieter and allows higher hashrates, but they need a facility with water-cooling infrastructure.",
  },
  {
    id: "choose-the-right-rig",
    category: "Hardware",
    q: "How do I choose the right rig?",
    a: "Start with your budget and electricity cost, then compare hashrate and efficiency. A more efficient rig usually costs more upfront but keeps more of its rewards over time. Tell us your goals and we'll suggest options.",
  },
  // Hosting
  {
    id: "hosting-includes",
    category: "Hosting",
    q: "What does managed hosting include?",
    a: "We install your miner, configure it, connect it to a pool, and handle monitoring and maintenance in our facility, so you don't have to deal with noise, heat or wiring.",
  },
  {
    id: "host-my-own-miners",
    category: "Hosting",
    q: "Can you host miners I already own?",
    a: "Get in touch with the models and quantity you have, and we'll let you know about available capacity and the next steps.",
  },
  {
    id: "miner-offline",
    category: "Hosting",
    q: "What happens if my miner goes offline?",
    a: "Our team monitors hosted miners and looks into issues when they come up. You can also message support at any time and we'll keep you updated.",
  },
  // Payouts
  {
    id: "how-rewards-are-paid",
    category: "Payouts",
    q: "How are mining rewards paid out?",
    a: "Rewards are sent straight to your Hanowallet, and every payout is recorded so you can follow your earnings over time.",
  },
  {
    id: "how-much-can-i-earn",
    category: "Payouts",
    q: "How much can I earn?",
    a: "Earnings depend on your miner's hashrate and efficiency, the network difficulty, transaction fees, your uptime and Bitcoin's price. They change over time and aren't guaranteed, but we're happy to help you estimate them for a specific setup.",
  },
  {
    id: "rewards-change",
    category: "Payouts",
    q: "Why do my daily rewards change?",
    a: "The amount of bitcoin you earn shifts with network difficulty, the total hashrate competing on the network, transaction fees and your miner's uptime. Small day-to-day changes are normal.",
  },
  // Account & security
  {
    id: "account-protection",
    category: "Account & security",
    q: "How is my account protected?",
    a: "Rewards go to your own Hanowallet. Use a strong, unique password, keep your login details private, and turn on every security option available in your account settings.",
  },
  {
    id: "contact-support",
    category: "Account & security",
    q: "How do I contact support?",
    a: "Send us a message from the contact page and we'll reply within one business day. You can also browse guides and answers in our help center.",
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex animate-rise items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground motion-reduce:animate-none">
            <Sparkles className="size-3.5" />
            FAQ
          </span>
          <h1 className="mt-5 animate-rise text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            Questions? <span className="text-primary">We&rsquo;ve got answers</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            Everything you need to know about mining hardware, hosting and payouts.
          </p>
        </div>

        <div className="relative mt-10">
          <FaqExplorer faqs={faqs} categories={[...categories]} />
        </div>
      </section>

      <section className="px-6 pb-24">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[28px] border border-border bg-card p-8 text-center shadow-[0_12px_32px_-16px_rgba(16,47,59,0.25)] sm:flex-row sm:p-10 sm:text-left">
            <div className="relative size-24 flex-none animate-float motion-reduce:animate-none">
              <Image src="/rigs/antminer-s21-xp.png" alt="" fill sizes="96px" className="scale-[1.3] object-contain" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-card-foreground sm:text-2xl">Still have questions?</h2>
              <p className="mt-1.5 text-[15px] text-muted-foreground">Our team is happy to help. We reply within one business day.</p>
            </div>
            <Link
              href="/contact"
              className="group/btn inline-flex h-11 flex-none items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950 border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500 cursor-pointer"
            >
              Contact us
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}