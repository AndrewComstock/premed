import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct, products, sectorLabels } from "@/lib/products";
import { ProductVisual } from "@/components/ProductVisual";
import { ProductCard } from "@/components/ProductCard";
import { AgentSlot } from "@/components/agents/AgentSlot";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return { title: product?.name ?? "Product", description: product?.tagline };
}

const priceLabel = { $: "Under $50k", $$: "$50k–$250k", $$$: "$250k–$750k", $$$$: "$750k+" };

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="container-page py-5 text-sm text-ink-soft">
          <Link href="/products/" className="hover:text-plum">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/products/?category=${category.id}`} className="hover:text-plum">{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </div>
        <div className="container-page grid items-center gap-12 pb-16 pt-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{category.name}</p>
            <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-xl text-ink-soft">{product.tagline}</p>
            <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/contact/?topic=quote&product=${product.slug}`} className="btn btn-primary">
                Request a quote
              </Link>
              <Link href={`/contact/?topic=demo&product=${product.slug}`} className="btn btn-outline text-plum">
                Book a demo
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-ink-soft">Catalog no.</dt>
                <dd className="font-mono font-semibold">{product.sku}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Indicative price</dt>
                <dd className="font-semibold">{priceLabel[product.priceBand]}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Availability</dt>
                <dd className="font-semibold">Ships in 6–10 weeks</dd>
              </div>
            </dl>
          </div>
          <ProductVisual category={product.category} className="w-full rounded-3xl shadow-2xl shadow-ink/20" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div>
              <h2 className="text-2xl font-extrabold">Key features</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 rounded-xl border border-line p-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal-dark">
                      ✓
                    </span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Specifications</h2>
              <table className="mt-6 w-full overflow-hidden rounded-xl text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <tr key={k} className={i % 2 ? "bg-white" : "bg-mist"}>
                      <th className="w-1/3 px-4 py-3 text-left font-semibold">{k}</th>
                      <td className="px-4 py-3 text-ink-soft">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-ink-soft">{product.regulatory}</p>
            </div>
            <AgentSlot
              placement="product-advisor"
              title={`Ask about the ${product.name}`}
              prompt="A product advisor agent will answer questions about specifications, compatibility, consumables and installation requirements."
              context={{ page: `/products/${product.slug}`, productSlug: product.slug }}
            />
          </div>
          <aside className="space-y-8">
            <div className="rounded-2xl bg-sand p-6">
              <h3 className="font-bold">Applications</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <li key={a} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">{a}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-sand p-6">
              <h3 className="font-bold">Used by</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {product.sectors.map((s) => (
                  <li key={s}>
                    <Link href={`/solutions/#${s}`} className="hover:text-plum">{sectorLabels[s]}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line p-6">
              <h3 className="font-bold">Resources</h3>
              <ul className="mt-4 space-y-2 text-sm text-plum">
                <li>Brochure (PDF)</li>
                <li>Site preparation guide</li>
                <li>Application notes</li>
                <li>Grant writing support pack</li>
              </ul>
              <p className="mt-3 text-xs text-ink-soft">Placeholder documents for the demo.</p>
            </div>
            <AgentSlot
              placement="quote-request"
              variant="inline"
              title="Build a quote"
              prompt="A procurement agent will assemble configurations and institutional pricing."
              context={{ page: `/products/${product.slug}`, productSlug: product.slug }}
            />
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-mist py-16">
          <div className="container-page">
            <h2 className="text-2xl font-extrabold">More in {category.name}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
