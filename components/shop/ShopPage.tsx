import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop mining rigs | Hanowallet",
  description: "Browse ASIC mining rigs from Bitmain and MicroBT. Compare specs and request a quote.",
};

export default function ShopPage() {
  return (
    <main className="bg-background">
      <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex animate-rise items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[13px] font-medium text-accent-foreground motion-reduce:animate-none">
            <Sparkles className="size-3.5" />
            Shop
          </span>
          <h1 className="mt-5 animate-rise text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-foreground [animation-delay:80ms] motion-reduce:animate-none">
            Find your next <span className="text-primary">mining rig</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:160ms] motion-reduce:animate-none sm:text-lg">
            Browse ASIC miners, compare their specs and request a quote for the one that fits your goals.
          </p>
        </div>

        <div className="relative mt-10">
          <ShopClient />
        </div>
      </section>
    </main>
  );
}