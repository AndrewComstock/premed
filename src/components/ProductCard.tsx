import Link from "next/link";
import { getCategory, type Product } from "@/lib/products";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}/`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
    >
      <div className="relative">
        <ProductVisual category={product.category} className="block h-auto w-full" />
        {product.status === "new" && (
          <span className="absolute left-4 top-4 rounded-full bg-teal px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{getCategory(product.category).name}</p>
        <h3 className="mt-2 text-lg font-bold text-ink group-hover:text-plum">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{product.tagline}</p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-mono text-xs text-ink-soft">{product.sku}</span>
          <span className="link-arrow">
            View details <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
