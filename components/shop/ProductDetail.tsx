"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, MessageCircle, RotateCw } from "lucide-react";
import ProductCard, { CoolingBadge, StockBadge } from "./ProductCard";
import ProductImage from "./ProductImage";
import {
  fetchAllProducts,
  fetchProductBySlug,
  formatPrice,
  productSpecs,
  quoteHref,
  sortedImages,
  stockLabel,
  type Product,
} from "@/lib/shop";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const cardShadow =
  "shadow-[0_12px_32px_-16px_rgba(16,47,59,0.25)] dark:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)]";

export default function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [all, setAll] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "missing" | "ready">("loading");
  const [reload, setReload] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    setImageIdx(0);
    fetchProductBySlug(slug, ctrl.signal)
      .then((p) => {
        if (!p) return setStatus("missing");
        setProduct(p);
        setStatus("ready");
        document.title = `${p.name} | Hanowallet Shop`;
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setStatus("error");
      });
    fetchAllProducts(ctrl.signal)
      .then(setAll)
      .catch(() => {});
    return () => ctrl.abort();
  }, [slug, reload]);

  /* up to 3 related rigs: same cooling or brand first */
  const related = useMemo(() => {
    if (!product) return [];
    const score = (p: Product) =>
      Number(p.cooling === product.cooling) * 2 + Number(p.manufacturer === product.manufacturer);
    return all
      .filter((p) => p.id !== product.id)
      .sort((a, b) => score(b) - score(a))
      .slice(0, 3);
  }, [all, product]);

  /* ---------------- states ---------------- */
  if (status === "loading") {
    return (
      <div className="grid gap-10 lg:grid-cols-12" aria-busy="true" aria-label="Loading product">
        <div className="aspect-[4/3] animate-pulse rounded-[28px] bg-accent/70 lg:col-span-7" />
        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-8 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (status === "missing" || status === "error") {
    const missing = status === "missing";
    return (
      <div className="mx-auto flex max-w-lg animate-swap flex-col items-center rounded-[28px] border border-dashed border-border bg-card px-6 py-14 text-center motion-reduce:animate-none">
        <h1 className="text-xl font-semibold text-card-foreground">
          {missing ? "We couldn't find this rig" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {missing
            ? "It may have been removed or the link might be wrong."
            : "We couldn't load this product. Check your connection and try again."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {!missing && (
            <button
              type="button"
              onClick={() => setReload((n) => n + 1)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCw className="size-4" /> Try again
            </button>
          )}
          <Link
            href="/shop"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-neutral-950"
          >
            <ArrowLeft className="size-4" /> Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const p = product!;
  const images = sortedImages(p);
  const img = images[imageIdx] ?? images[0];
  const hasCompare = p.compareAtPrice !== null && Number(p.compareAtPrice) > Number(p.price);

  return (
    <>
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="animate-rise motion-reduce:animate-none">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/shop" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Shop
            </Link>
          </li>
          <ChevronRight className="size-4" aria-hidden="true" />
          <li aria-current="page" className="font-medium text-foreground">
            {p.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        {/* ---------------- Gallery ---------------- */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            <div className="group relative aspect-[4/3] animate-rise overflow-hidden rounded-[28px] bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_12%,transparent)_1px,transparent_1px)] [animation-delay:80ms] [background-size:22px_22px] motion-reduce:animate-none">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
                <CoolingBadge cooling={p.cooling} />
                {p.isNew && (
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-[#102F3B] dark:bg-chart-3">New</span>
                )}
                {p.featured && (
                  <span className="rounded-full bg-[#1F4273] px-2.5 py-1 text-xs font-semibold text-white">Featured</span>
                )}
              </div>
              <div key={imageIdx} className="absolute inset-[7%] animate-swap motion-reduce:animate-none">
                <div className="relative h-full w-full animate-float motion-reduce:animate-none">
                  <div className={clsx("relative h-full w-full transition-transform duration-700 group-hover:scale-[1.04]", EASE)}>
                    <ProductImage
                      src={img?.url}
                      alt={img?.alt ?? p.name}
                      priority
                      sizes="(min-width: 1024px) 55vw, 95vw"
                      className="drop-shadow-[0_30px_30px_rgba(16,47,59,0.25)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2.5" role="group" aria-label="Product images">
                {images.map((im, i) => (
                  <button
                    key={im.id}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === imageIdx}
                    className={clsx(
                      "relative size-20 overflow-hidden rounded-2xl border-2 bg-accent transition-all duration-300",
                      i === imageIdx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <ProductImage src={im.url} alt="" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- Buy box ---------------- */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="animate-rise [animation-delay:140ms] motion-reduce:animate-none">
            <p className="text-sm font-medium text-primary">
              {[p.manufacturer, p.model].filter(Boolean).join(" · ")}
            </p>
            <h1 className="mt-1.5 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-[-0.03em] text-foreground">
              {p.name}
            </h1>
          </div>

          <div className="flex animate-rise flex-wrap items-center gap-3 [animation-delay:200ms] motion-reduce:animate-none">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {formatPrice(p.price, p.currency)}
            </span>
            {hasCompare && (
              <span className="text-lg tabular-nums text-muted-foreground line-through">
                {formatPrice(p.compareAtPrice, p.currency)}
              </span>
            )}
            <StockBadge product={p} />
            <span className="sr-only">{stockLabel(p)}</span>
          </div>

          {p.description && (
            <p className="animate-rise text-[15px] leading-7 text-muted-foreground [animation-delay:260ms] motion-reduce:animate-none">
              {p.description}
            </p>
          )}

          <div className={`animate-rise rounded-[24px] border border-border bg-card p-5 [animation-delay:320ms] motion-reduce:animate-none ${cardShadow}`}>
            <div className="flex flex-col gap-2.5">
              <Link
                href={quoteHref(p)}
                className={clsx("group/q inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(31,66,115,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950",
                    "border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
                )}
              >
                Request a quote
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/q:translate-x-0.5" />
              </Link>
              <Link
                href={quoteHref(p)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MessageCircle className="size-4" />
                Ask a question
              </Link>
            </div>
            <ul className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 text-sm text-card-foreground">
              {["Managed hosting available", "Setup and pool connection handled", "Rewards paid to your Hanowallet"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex size-5 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* specs */}
          <section aria-labelledby="specs-title" className="animate-rise [animation-delay:380ms] motion-reduce:animate-none">
            <h2 id="specs-title" className="text-lg font-semibold text-foreground">
              Specifications
            </h2>
            <dl className="mt-3 overflow-hidden rounded-[20px] border border-border bg-card">
              {[...productSpecs(p), { label: "Stock", value: String(p.stock) }, {
                label: "Category",
                value: p.categories?.map((c) => c.name).join(", ") || "—",
              }].map((s, i) => (
                <div
                  key={s.label}
                  className={clsx(
                    "flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-muted/50",
                    i > 0 && "border-t border-border",
                  )}
                >
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-semibold tabular-nums text-card-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {p.tags?.length > 0 && (
            <ul className="flex animate-rise flex-wrap gap-1.5 [animation-delay:440ms] motion-reduce:animate-none" aria-label="Tags">
              {p.tags.map((t) => (
                <li key={t.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {t.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ---------------- Related ---------------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-2xl font-bold tracking-tight text-foreground">
              You might also like
            </h2>
            <Link
              href="/shop"
              className="group/all inline-flex items-center gap-1.5 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View all rigs
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/all:translate-x-0.5" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <li key={r.id}>
                <ProductCard product={r} index={i} href={`/shop/${r.slug}`} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}