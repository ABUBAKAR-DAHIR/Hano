"use client";

import clsx from "clsx";
import Link from "next/link";
import { ArrowUpRight, Droplets, Eye, Fan } from "lucide-react";
import ProductImage from "./ProductImage";
import { formatPrice, inStock, primaryImage, type Product } from "@/lib/shop";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function StockBadge({ product, className }: { product: Product; className?: string }) {
  const ok = inStock(product);
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        ok ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", ok ? "bg-secondary dark:bg-chart-3" : "bg-muted-foreground/60")} />
      {ok ? "In stock" : "Out of stock"}
    </span>
  );
}

export function CoolingBadge({ cooling }: { cooling: string | null }) {
  if (!cooling) return null;
  const hydro = /hydro|liquid|water/i.test(cooling);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur">
      {hydro ? <Droplets className="size-3.5" /> : <Fan className="size-3.5" />}
      {cooling}
    </span>
  );
}

/**
 * Product card. Pass `onOpen` to open the quick-view modal,
 * or `href` to link straight to the product page.
 */
export default function ProductCard({
  product,
  index = 0,
  onOpen,
  href,
}: {
  product: Product;
  index?: number;
  onOpen?: () => void;
  href?: string;
}) {
  const img = primaryImage(product);
  const compare = Number(product.compareAtPrice);
  const showCompare = product.compareAtPrice !== null && compare > Number(product.price);

  const inner = (
    <>
      <span className="relative block aspect-[4/3] overflow-hidden bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--accent-foreground)_12%,transparent)_1px,transparent_1px)] [background-size:20px_20px]">
        <span className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          <CoolingBadge cooling={product.cooling} />
          {product.isNew && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-[#102F3B] dark:bg-chart-3">New</span>
          )}
          {product.featured && (
            <span className="rounded-full bg-[#1F4273] px-2.5 py-1 text-xs font-semibold text-white">Featured</span>
          )}
        </span>
        <StockBadge product={product} className="absolute right-3 top-3 z-10 shadow-sm" />

        <span
          className={clsx(
            "absolute inset-[9%] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.06]",
            EASE,
          )}
        >
          <ProductImage src={img?.url} alt={img?.alt ?? product.name} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
        </span>

        {onOpen && (
          <span
            className={clsx(
              "absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-card/95 px-3.5 py-1.5 text-xs font-semibold text-card-foreground opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
              EASE,
            )}
          >
            <Eye className="size-3.5" /> Quick view
          </span>
        )}
      </span>

      <span className="flex flex-1 flex-col gap-1 p-5">
        <span className="text-xs font-medium text-muted-foreground">{product.manufacturer ?? "ASIC miner"}</span>
        <span className="text-base font-semibold leading-snug text-card-foreground">{product.name}</span>
        {(product.hashRate || product.power) && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {[product.hashRate, product.power ? `${product.power} W` : null].filter(Boolean).join(" · ")}
          </span>
        )}
        <span className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-bold text-card-foreground">{formatPrice(product.price, product.currency)}</span>
            {showCompare && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </span>
          <span
            className={clsx(
              "flex size-9 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground dark:group-hover:text-neutral-950",
              EASE,
            )}
            aria-hidden="true"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </span>
      </span>
    </>
  );

  const cls = clsx(
    "group flex h-full w-full animate-rise flex-col overflow-hidden rounded-[24px] border border-border bg-card text-left motion-reduce:animate-none",
    "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_36px_-20px_rgba(16,47,59,0.45)] dark:hover:shadow-[0_18px_36px_-20px_rgba(0,0,0,0.8)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    EASE,
  );
  const style = { animationDelay: `${Math.min(index, 10) * 60}ms` };

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onOpen} className={cls} style={style} aria-haspopup="dialog">
      {inner}
    </button>
  );
}