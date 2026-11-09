import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Clock, Handshake, LifeBuoy, MapPin, ShoppingCart } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact us | Hanowallet",
  description:
    "Talk to the Hanowallet team about mining rigs, hosting, payouts or support. We reply within one business day.",
};

/* ------------------------------------------------------------------ */
/* Replace the emails, address and hours with your real details.       */
/* ------------------------------------------------------------------ */
const channels = [
  {
    icon: ShoppingCart,
    title: "Sales",
    body: "Choosing rigs, hosting and volume orders",
    action: "sales@hanowallet.com",
    href: "mailto:sales@hanowallet.com",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    body: "Help with your account, miners or payouts",
    action: "Seek direct help",
    href: "mailto:help@hanowallet.com",
  },
  {
    icon: Handshake,
    title: "Partnerships & press",
    body: "Collaborations, media and investor enquiries",
    action: "partners@hanowallet.com",
    href: "mailto:partners@hanowallet.com",
  },
];

const faqs = [
  {
    q: "What happens after I send a message?",
    a: "A member of our team reads every message and replies within one business day. For sales enquiries, we'll usually suggest a short call to understand your goals and budget.",
  },
  {
    q: "Can you help me choose the right rig?",
    a: "Yes. Tell us your budget, how many miners you're planning and what you pay for electricity, and we'll compare hashrate, efficiency and running costs to recommend the best fit.",
  },
  {
    q: "Do I need to run the hardware at home?",
    a: "No. With managed hosting, your miner is installed, configured and connected to a pool in our facility, so there's no noise, heat or wiring at home.",
  },
  {
    q: "How are mining rewards paid out?",
    a: "Rewards are sent straight to your Hanowallet, and every payout is recorded so you can follow your earnings over time.",
  },
  {
    q: "I already own miners. Can you host them?",
    a: "Get in touch with the models and quantity you have, and we'll let you know about available capacity and the next steps.",
  },
];

const cardShadow =
  "shadow-[0_12px_32px_-14px_rgba(16,47,59,0.18)] dark:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.7)]";

export default function ContactPage() {
  return (
    <main className="bg-background">
      {/* ================= Header + form ================= */}
      <section className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto max-w-[1360px] px-6">
          <div className="max-w-3xl">
            <span className="inline-flex animate-rise items-center gap-2 rounded-full bg-accent py-1.5 pl-2 pr-3.5 text-sm font-medium text-accent-foreground motion-reduce:animate-none">
              <span className="relative flex size-2.5 items-center justify-center">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary motion-reduce:animate-none dark:bg-chart-3" />
                <span className="relative size-2.5 rounded-full bg-secondary dark:bg-chart-3" />
              </span>
              Contact us
            </span>
            <h1 className="mt-6 md:max-w-130 animate-rise text-[clamp(2.5rem,5.4vw,3.5rem)] font-bold leading-[1.03] tracking-[-0.045em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
              Let&rsquo;s talk about your mining setup
            </h1>
            <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none">
              Whether you&rsquo;re buying your first rig, scaling a fleet or need a hand with your account, our team is
              here to help.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            {/* -------- Sidebar -------- */}
            <aside className="flex flex-col gap-6 lg:col-span-5">
              {/* channels */}
              <div
                className={`animate-rise rounded-[28px] border border-border bg-card p-3 [animation-delay:240ms] motion-reduce:animate-none ${cardShadow}`}
              >
                <h2 className="px-4 pb-2 pt-4 text-base font-semibold text-card-foreground">Reach the right team</h2>
                <ul className="flex flex-col">
                  {channels.map(({ icon: Icon, title, body, action, href }) => (
                    <li key={title}>
                      <a
                        href={href}
                        className="group flex items-start gap-4 rounded-2xl p-4 transition-colors duration-300 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex size-11 flex-none items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-neutral-950">
                          <Icon className="size-5" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="font-semibold text-card-foreground">{title}</span>
                          <span className="text-sm text-muted-foreground">{body}</span>
                          <span className="mt-1.5 truncate text-sm font-medium text-primary">{action}</span>
                        </span>
                        <ArrowUpRight className="mt-1 size-5 flex-none text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* office */}
              <div
                className={`animate-rise overflow-hidden rounded-[28px] border border-border bg-card [animation-delay:320ms] motion-reduce:animate-none ${cardShadow}`}
              >
                <OfficeMap />
                <div className="grid gap-5 p-6 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 size-5 flex-none text-primary" />
                    <div>
                      <p className="font-semibold text-card-foreground">Our office</p>
                      <address className="mt-1 text-sm not-italic leading-relaxed text-muted-foreground">
                        Garowe, Nugaal
                        <br />
                        Puntland, Somalia
                      </address>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 size-5 flex-none text-primary" />
                    <div>
                      <p className="font-semibold text-card-foreground">Opening hours</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Mon–Fri, 9:00–18:00
                        <br />
                        Online support every day
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* -------- Form -------- */}
            <div className="animate-rise [animation-delay:200ms] motion-reduce:animate-none lg:col-span-7">
              <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[28px] border border-border bg-card" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section aria-labelledby="faq-title" className="border-t border-border pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="text-[clamp(2rem,3.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
              Questions, answered
            </h2>
            <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-muted-foreground">
              Quick answers to what people ask us most. Can&rsquo;t find yours? Send us a message above.
            </p>
            <Link
              href="/faq"
              className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See all FAQs
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-8">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                name="contact-faq"
                open={i === 0}
                className="group rounded-2xl border border-border bg-card transition-colors duration-300 open:border-primary/30 open:bg-accent/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6 [&::-webkit-details-marker]:hidden">
                  <span className="text-[17px] font-semibold text-card-foreground">{f.q}</span>
                  <span className="flex size-9 flex-none items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-open:rotate-180 group-open:border-primary group-open:bg-primary group-open:text-primary-foreground dark:group-open:text-neutral-950">
                    <ChevronDown className="size-4" />
                  </span>
                </summary>
                <div className="animate-swap px-5 pb-6 pr-16 motion-reduce:animate-none sm:px-6">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Office map — a real OpenStreetMap view of Garowe with a branded,    */
/* animated pin. The map is centred on the office, so the pin sits     */
/* exactly on it. Adjust the coordinates to your exact building.       */
/* ------------------------------------------------------------------ */
const OFFICE = { lat: 8.4056, lng: 48.4819, label: "Garowe, Somalia" };
const SPAN = { lat: 0.0125, lng: 0.02 }; // how much of the city is visible

const mapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${OFFICE.lng - SPAN.lng}%2C${OFFICE.lat - SPAN.lat}%2C${OFFICE.lng + SPAN.lng}%2C${OFFICE.lat + SPAN.lat}&layer=mapnik`;
const mapDirections = `https://www.google.com/maps/dir/?api=1&destination=${OFFICE.lat},${OFFICE.lng}`;
const mapLarger = `https://www.openstreetmap.org/?mlat=${OFFICE.lat}&mlon=${OFFICE.lng}#map=15/${OFFICE.lat}/${OFFICE.lng}`;

function OfficeMap() {
  return (
    <div className="group relative h-56 overflow-hidden bg-accent sm:h-64">
      {/* the real map, fading into focus */}
      <div className="absolute inset-0 animate-swap [animation-delay:400ms] [animation-duration:1.1s] motion-reduce:animate-none">
        <iframe
          title={`Map of ${OFFICE.label}`}
          src={mapEmbed}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full border-0 [filter:saturate(0.7)_contrast(1.05)] dark:[filter:invert(0.92)_hue-rotate(180deg)_saturate(0.55)_brightness(0.95)]"
        />
      </div>

      {/* brand tint + soft vignette */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-accent/35 mix-blend-multiply dark:bg-[#1F4273]/25 dark:mix-blend-normal" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(16,47,59,0.22)]" />

      {/* pin */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
        {/* radar rings on the exact spot */}
        <span className="absolute left-0 top-0 size-16 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full bg-primary/25 motion-reduce:animate-none" />
        <span className="absolute left-0 top-0 size-16 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full bg-secondary/35 [animation-delay:1.2s] motion-reduce:animate-none dark:bg-chart-3/35" />
        <span className="absolute left-0 top-0 h-2 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B1A2A]/30 blur-[2px]" />
        {/* teardrop: its tip lands on the centre of the map */}
        <span className="absolute bottom-[9px] left-0 -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1.5">
          <span className="flex size-11 animate-pop items-center justify-center rounded-full rounded-br-none rotate-45 bg-[#1F4273] text-white shadow-[0_10px_20px_-6px_rgba(11,26,42,0.6)] ring-4 ring-white/90 [animation-delay:900ms] motion-reduce:animate-none dark:ring-card">
            <span className="-rotate-45 text-base font-bold">H</span>
          </span>
        </span>
      </div>

      {/* location chip */}
      <div className="absolute left-3 top-3 inline-flex animate-rise items-center gap-2 rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur [animation-delay:1100ms] motion-reduce:animate-none">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary motion-reduce:animate-none dark:bg-chart-3" />
          <span className="relative size-2 rounded-full bg-secondary dark:bg-chart-3" />
        </span>
        {OFFICE.label}
      </div>

      {/* actions */}
      <div className="absolute right-3 top-3 flex animate-rise gap-1.5 [animation-delay:1200ms] motion-reduce:animate-none">
        <a
          href={mapDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#1F4273] px-3 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Directions
          <ArrowUpRight className="size-3.5" />
        </a>
        <a
          href={mapLarger}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center rounded-full bg-card/95 px-3 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Larger map
        </a>
      </div>

      {/* coordinates */}
      <span className="absolute bottom-3 left-3 animate-rise rounded-md bg-card/90 px-2 py-1 font-mono text-[11px] tabular-nums text-muted-foreground backdrop-blur [animation-delay:1300ms] motion-reduce:animate-none">
        {OFFICE.lat.toFixed(4)}° N, {OFFICE.lng.toFixed(4)}° E
      </span>
    </div>
  );
}