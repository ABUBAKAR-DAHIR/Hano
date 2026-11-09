"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import ProductImage from "./ProductImage";
import { CoolingBadge, StockBadge } from "./ProductCard";
import { formatPrice, productSpecs, quoteHref, sortedImages, stockLabel, type Product } from "@/lib/shop";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Quick-view modal. Uses the native <dialog> for focus trapping,
 * Escape to close and an accessible backdrop.
 */
export default function ProductModal({
  products,
  index,
  onClose,
  onNavigate,
}: {
  products: Product[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const product = index !== null ? products[index] : null;

  /* open / close with animation */
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => setVisible(true));
    }
  }, [index]);

  const close = useCallback(() => {
    setVisible(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        ref.current?.close();
        document.documentElement.style.overflow = "";
        onClose();
      },
      reduce ? 0 : 220,
    );
  }, [onClose]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);
  useEffect(() => setImageIdx(0), [index]);

  /* ← / → to browse */
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNavigate((index + 1) % products.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + products.length) % products.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, products.length, onNavigate]);

  const images = product ? sortedImages(product) : [];
  const img = images[imageIdx] ?? images[0];

  return (
    <dialog
      ref={ref}
      aria-labelledby="product-modal-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className={clsx(
        "m-auto w-[min(980px,calc(100%-1.5rem))] max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[28px] border border-border bg-card p-0 text-foreground shadow-[0_40px_80px_-30px_rgba(11,26,42,0.55)]",
        "backdrop:bg-[#0B1A2A]/55 backdrop:backdrop-blur-[3px] backdrop:transition-opacity backdrop:duration-300",
        "transition-[opacity,transform] duration-300 motion-reduce:transition-none",
        EASE,
        visible ? "translate-y-0 scale-100 opacity-100 backdrop:opacity-100" : "translate-y-4 scale-[0.98] opacity-0 backdrop:opacity-0",
      )}
    >
      {product && (
        <div className="relative grid max-h-[calc(100dvh-1.5rem)] overflow-y-auto md:grid-cols-2 md:overflow-hidden">
          {/* controls */}
          <div className="absolute right-3 top-3 z-20 flex gap-1.5">
            {products.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate((index! - 1 + products.length) % products.length)}
                  aria-label="Previous product"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground backdrop-blur transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronLeft className="size-5 cursor-pointer" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate((index! + 1) % products.length)}
                  aria-label="Next product"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground backdrop-blur transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronRight className="size-5 cursor-pointer" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              autoFocus
              className="cursor-pointer flex size-9 items-center justify-center rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-white duration-500 dark:text-white     transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-neutral-950"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* image */}
          <div className="relative flex min-h-[280px] flex-col bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_12%,transparent)_1px,transparent_1px)] p-5 [background-size:20px_20px] md:min-h-[560px]">
            <div className="flex flex-wrap gap-1.5">
              <CoolingBadge cooling={product.cooling} />
              {product.isNew && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-[#102F3B] dark:bg-chart-3">New</span>
              )}
            </div>
            <div key={`${product.id}-${imageIdx}`} className="relative my-4 flex-1 animate-swap motion-reduce:animate-none">
              <div className="absolute inset-0 animate-float motion-reduce:animate-none">
                <ProductImage
                  src={img?.url}
                  alt={img?.alt ?? product.name}
                  sizes="(min-width: 768px) 480px, 90vw"
                  className="drop-shadow-[0_24px_24px_rgba(16,47,59,0.25)]"
                />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-2" role="group" aria-label="Product images">
                {images.map((im, i) => (
                  <button
                    key={im.id}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === imageIdx}
                    className={clsx(
                      "relative size-14 overflow-hidden rounded-xl border-2 bg-card transition-colors",
                      i === imageIdx ? "border-primary" : "border-transparent hover:border-border",
                    )}
                  >
                    <ProductImage src={im.url} alt="" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* info */}
          <div key={product.id} className="flex animate-swap flex-col gap-5 p-6 pt-6 motion-reduce:animate-none sm:p-8 md:max-h-[calc(100dvh-1.5rem)] md:overflow-y-auto md:pt-16">
            <div>
              <p className="text-sm font-medium text-primary">{product.manufacturer}</p>
              <h2 id="product-modal-title" className="mt-1 text-2xl font-bold tracking-tight text-card-foreground">
                {product.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold tabular-nums tracking-tight text-card-foreground">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compareAtPrice !== null && Number(product.compareAtPrice) > Number(product.price) && (
                <span className="text-base tabular-nums text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, product.currency)}
                </span>
              )}
              <StockBadge product={product} />
            </div>
            <p className="sr-only">{stockLabel(product)}</p>

            {product.description && (
              <p className="text-[15px] leading-7 text-muted-foreground">{product.description}</p>
            )}

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {productSpecs(product).map((s) => (
                <div key={s.label} className="bg-card p-3.5">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-card-foreground">{s.value}</dd>
                </div>
              ))}
              <div className="bg-card p-3.5">
                <dt className="text-xs text-muted-foreground">Stock</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums text-card-foreground">{product.stock}</dd>
              </div>
            </dl>

            {product.tags?.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                {product.tags.map((t) => (
                  <li key={t.id} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {t.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex flex-col gap-2.5 pt-2 sm:flex-row">
              <Link
                href={quoteHref(product)}
                className="group/q inline-flex h-12 flex-1 items-center justify-center max-md:py-3.5 gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(31,66,115,0.55)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-950  border-primary border-2 hover:bg-transparent hover:text-primary dark:hover:text-white transition-all duration-500"
              >
                Request a quote
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/q:translate-x-0.5" />
              </Link>
              <Link
                href={`/shop/${product.slug}`}
                className={clsx("inline-flex h-12 max-md:py-3.5 flex-1 items-center justify-center rounded-xl border border-border px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  ",
                    "border-primary border-2 hover:bg-primary text-primary hover:text-white dark:hover:text-black transition-all duration-500"
                )}
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}