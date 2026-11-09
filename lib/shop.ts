/* ------------------------------------------------------------------ */
/* Types + helpers for the shop. Shapes match /api/products.           */
/* ------------------------------------------------------------------ */

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
};

export type Taxon = { id: string; name: string; slug: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  currency: string;
  compareAtPrice: string | number | null;
  manufacturer: string | null;
  model: string | null;
  algorithm: string | null;
  hashRate: string | null;
  power: number | null;
  cooling: string | null;
  noiseLevel: string | number | null;
  stock: number;
  status: string;
  isNew: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  categories: Taxon[];
  tags: Taxon[];
};

type ListResponse = {
  success?: boolean;
  message?: string;
  data?: Product[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

/** Loads every page of /api/products (your API returns 12 per page). */
export async function fetchAllProducts(signal?: AbortSignal): Promise<Product[]> {
  const byId = new Map<string, Product>();
  let page = 1;
  let totalPages = 1;

  do {
    const res = await fetch(`/api/products?page=${page}&limit=50`, { signal });
    if (!res.ok) throw new Error(`Couldn't load products (error ${res.status}).`);
    const json: ListResponse = await res.json();
    if (json.success === false) throw new Error(json.message ?? "Couldn't load products.");
    const list = json.data ?? [];
    list.forEach((p) => byId.set(p.id, p));
    totalPages = json.pagination?.totalPages ?? 1;
    if (!list.length) break;
    page += 1;
  } while (page <= totalPages && page <= 50);

  return [...byId.values()].filter((p) => p.status === "ACTIVE");
}

/** Loads one product from /api/products/slug/[slug]. Returns null when not found. */
export async function fetchProductBySlug(slug: string, signal?: AbortSignal): Promise<Product | null> {
  const res = await fetch(`/api/products/slug/${encodeURIComponent(slug)}`, { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Couldn't load this product (error ${res.status}).`);
  const json = await res.json();
  if (json?.success === false) return null;
  return (json?.data ?? json) as Product;
}

export function formatPrice(value: string | number | null | undefined, currency = "AED") {
  const n = Number(value);
  if (value === null || value === undefined || value === "" || !Number.isFinite(n)) return "—";
  const whole = n % 1 === 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "AED",
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString("en-US")}`;
  }
}

export function sortedImages(p: Product) {
  return [...(p.images ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.position - b.position,
  );
}

export function primaryImage(p: Product) {
  return sortedImages(p)[0];
}

export const inStock = (p: Product) => p.stock > 0;

export function stockLabel(p: Product) {
  return p.stock > 0 ? `In stock (${p.stock})` : "Out of stock";
}

/** Specs for display. Empty values (like "" hashrate or 0 W) show as "—". */
export function productSpecs(p: Product) {
  const show = (v: unknown, unit?: string) =>
    v === null || v === undefined || v === "" || v === 0 ? "—" : unit ? `${v} ${unit}` : String(v);
  return [
    { label: "Manufacturer", value: show(p.manufacturer) },
    { label: "Model", value: show(p.model) },
    { label: "Algorithm", value: show(p.algorithm) },
    { label: "Hashrate", value: show(p.hashRate) },
    { label: "Power", value: show(p.power, "W") },
    { label: "Cooling", value: show(p.cooling) },
    { label: "Noise level", value: show(p.noiseLevel, "dB") },
  ];
}

export const quoteHref = (p: Product) => `/contact?product=${encodeURIComponent(p.name)}`;