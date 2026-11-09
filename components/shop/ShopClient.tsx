"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, RotateCw, Search, X } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { fetchAllProducts, type Product } from "@/lib/shop";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "name";
const ALL = "All";

const sortOptions: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={clsx(
              "h-9 rounded-full border px-3.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary bg-primary text-primary-foreground dark:text-neutral-950"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function SkeletonCard({ i }: { i: number }) {
  return (
    <div
      className="overflow-hidden rounded-[24px] border border-border bg-card"
      style={{ animationDelay: `${i * 80}ms` }}
      aria-hidden="true"
    >
      <div className="aspect-[4/3] animate-pulse bg-accent/70" />
      <div className="flex flex-col gap-2.5 p-5">
        <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-5 w-20 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function ShopClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const [query, setQuery] = useState("");
  const [maker, setMaker] = useState(ALL);
  const [cooling, setCooling] = useState(ALL);
  const [sort, setSort] = useState<Sort>("featured");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* load products */
  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    fetchAllProducts(ctrl.signal)
      .then((list) => {
        setProducts(list);
        setStatus("ready");
      })
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setStatus("error");
      });
    return () => ctrl.abort();
  }, [reload]);

  const makers = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.manufacturer).filter(Boolean) as string[])).sort()],
    [products],
  );
  const coolings = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.cooling).filter(Boolean) as string[])).sort()],
    [products],
  );

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = products.filter((p) => {
      if (maker !== ALL && p.manufacturer !== maker) return false;
      if (cooling !== ALL && p.cooling !== cooling) return false;
      const hay = [p.name, p.model, p.manufacturer, p.cooling, ...p.tags.map((t) => t.name)].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    const byNewest = (a: Product, b: Product) => +new Date(b.createdAt) - +new Date(a.createdAt);
    return [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return byNewest(a, b);
        case "price-asc":
          return Number(a.price) - Number(b.price) || a.name.localeCompare(b.name);
        case "price-desc":
          return Number(b.price) - Number(a.price) || a.name.localeCompare(b.name);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return Number(b.featured) - Number(a.featured) || byNewest(a, b);
      }
    });
  }, [products, query, maker, cooling, sort]);

  /* keep ?p=slug in the URL so a quick view can be shared */
  const setUrl = (slug: string | null) => {
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("p", slug);
    else url.searchParams.delete("p");
    window.history.replaceState(null, "", url);
  };

  const open = useCallback(
    (i: number) => {
      setOpenIndex(i);
      setUrl(results[i]?.slug ?? null);
    },
    [results],
  );

  const closeModal = useCallback(() => {
    setOpenIndex(null);
    setUrl(null);
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    const slug = new URLSearchParams(window.location.search).get("p");
    if (!slug) return;
    const i = results.findIndex((p) => p.slug === slug);
    if (i >= 0) setOpenIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtersActive = query || maker !== ALL || cooling !== ALL;
  const clearFilters = () => {
    setQuery("");
    setMaker(ALL);
    setCooling(ALL);
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* ---------------- Toolbar ---------------- */}
      <div className="flex animate-rise flex-col gap-4 rounded-[24px] border border-border bg-card p-4 shadow-[0_10px_28px_-18px_rgba(16,47,59,0.3)] [animation-delay:240ms] motion-reduce:animate-none sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label htmlFor="shop-search" className="sr-only">
            Search rigs
          </label>
          <div className="group relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, model or brand"
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-11 text-[15px] text-foreground placeholder:text-muted-foreground/80 transition-[border-color,box-shadow] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 animate-pop items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:animate-none"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="relative md:w-56">
            <label htmlFor="shop-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background pl-4 pr-10 text-[15px] text-foreground transition-[border-color,box-shadow] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Chips label="Brand" options={makers} value={maker} onChange={setMaker} />
            <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
            <Chips label="Cooling" options={coolings} value={cooling} onChange={setCooling} />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span aria-live="polite">
              {status === "ready" ? `${results.length} ${results.length === 1 ? "rig" : "rigs"}` : "Loading…"}
            </span>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="animate-pop font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:animate-none"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Grid ---------------- */}
      <div className="mt-8">
        {status === "loading" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard key={i} i={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex animate-swap flex-col items-center rounded-[28px] border border-dashed border-border bg-card px-6 py-14 text-center motion-reduce:animate-none">
            <h2 className="text-lg font-semibold text-card-foreground">We couldn&rsquo;t load the shop</h2>
            <p className="mt-1.5 max-w-sm text-[15px] text-muted-foreground">{error} Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => setReload((n) => n + 1)}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-neutral-950"
            >
              <RotateCw className="size-4" /> Try again
            </button>
          </div>
        )}

        {status === "ready" && results.length === 0 && (
          <div className="flex animate-swap flex-col items-center rounded-[28px] border border-dashed border-border bg-card px-6 py-14 text-center motion-reduce:animate-none">
            <h2 className="text-lg font-semibold text-card-foreground">No rigs match your search</h2>
            <p className="mt-1.5 max-w-sm text-[15px] text-muted-foreground">
              Try a different word or remove a filter to see more.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear filters
            </button>
          </div>
        )}

        {status === "ready" && results.length > 0 && (
          <ul key={`${query}|${maker}|${cooling}|${sort}`} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} index={i} onOpen={() => open(i)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <ProductModal products={results} index={openIndex} onClose={closeModal} onNavigate={open} />
    </div>
  );
}