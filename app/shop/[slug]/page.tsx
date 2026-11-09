import type { Metadata } from "next";
import ProductDetail from "@/components/shop/ProductDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Params = { params: Promise<{ slug: string }> };

const prettify = (slug: string) =>
  slug
    .split("-")
    .map((w) => (w.length <= 3 && /\d/.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${prettify(slug)} | Hanowallet Shop`,
    description: `Specifications, price and availability for the ${prettify(slug)}. Request a quote from Hanowallet.`,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  return (
    <main className="bg-background">
      <section className="relative overflow-hidden px-6 pb-24 pt-32 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto max-w-[1280px]">
          <ProductDetail slug={slug} />
        </div>
      </section>
    </main>
  );
}