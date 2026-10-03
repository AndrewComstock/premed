"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, sectorLabels, type CategoryId, type Sector } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export function Catalog() {
  const params = useSearchParams();
  const initialCategory = (params.get("category") as CategoryId | null) ?? "all";
  const [category, setCategory] = useState<CategoryId | "all">(
    categories.some((c) => c.id === initialCategory) ? initialCategory : "all",
  );
  const [sector, setSector] = useState<Sector | "all">("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (sector === "all" || p.sectors.includes(sector)) &&
        (!q ||
          [p.name, p.tagline, p.sku, ...p.applications].some((s) => s.toLowerCase().includes(q))),
    );
  }, [category, sector, query]);

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-8">
        <div>
          <label htmlFor="q" className="text-sm font-semibold">Search</label>
          <input
            id="q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, SKU or application"
            className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-plum focus:ring-2 focus:ring-plum/20"
          />
        </div>
        <fieldset>
          <legend className="text-sm font-semibold">Category</legend>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {[{ id: "all" as const, name: "All products" }, ...categories].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                  category === c.id ? "bg-plum font-semibold text-white" : "bg-mist hover:bg-line lg:bg-transparent"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="sector" className="text-sm font-semibold">Customer type</label>
          <select
            id="sector"
            value={sector}
            onChange={(e) => setSector(e.target.value as Sector | "all")}
            className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
          >
            <option value="all">All customers</option>
            {(Object.keys(sectorLabels) as Sector[]).map((s) => (
              <option key={s} value={s}>{sectorLabels[s]}</option>
            ))}
          </select>
        </div>
      </aside>
      <div>
        <p className="text-sm text-ink-soft">
          Showing <strong className="text-ink">{results.length}</strong> of {products.length} products
        </p>
        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-sand p-10 text-center text-ink-soft">
            No products match those filters.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
