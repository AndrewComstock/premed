"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/portal/PortalSession";
import { Badge, PageTitle, Panel } from "@/components/portal/ui";
import { useHash } from "@/components/portal/useHash";
import { ProductVisual } from "@/components/ProductVisual";
import { formatDate, isLowStock, PORTAL_TODAY } from "@/lib/portal";
import { getProduct } from "@/lib/products";

export function InventoryView() {
  const { account } = useSession();
  useHash();
  const [lowOnly, setLowOnly] = useState(false);
  const consumables = lowOnly ? account.consumables.filter(isLowStock) : account.consumables;

  return (
    <div className="space-y-10">
      <PageTitle
        title="Inventory"
        intro="Installed Halcyra instruments with service and warranty status, and the consumables your team keeps on hand."
      />

      <section id="instruments" className="scroll-mt-40">
        <h3 className="mb-4 text-xl font-bold">Installed instruments</h3>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {account.instruments.map((i) => {
            const product = getProduct(i.productSlug);
            if (!product) return null;
            const inWarranty = i.warrantyEnds >= PORTAL_TODAY;
            return (
              <article key={i.serial} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
                <div className="flex h-36 items-center overflow-hidden">
                  <ProductVisual category={product.category} className="block h-auto w-full" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/products/${product.slug}/`} className="font-bold text-ink hover:text-plum">
                      {product.name}
                    </Link>
                    <Badge>{i.status}</Badge>
                  </div>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {product.sku} · S/N {i.serial}
                  </p>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                    <dt className="text-ink-soft">Location</dt>
                    <dd>{i.location}</dd>
                    <dt className="text-ink-soft">Installed</dt>
                    <dd>{formatDate(i.installed)}</dd>
                    <dt className="text-ink-soft">Service plan</dt>
                    <dd>{i.servicePlan}</dd>
                    <dt className="text-ink-soft">Warranty</dt>
                    <dd>
                      {inWarranty ? `Until ${formatDate(i.warrantyEnds)}` : <span className="text-amber-700">Expired {formatDate(i.warrantyEnds)}</span>}
                    </dd>
                    <dt className="text-ink-soft">Next service</dt>
                    <dd>{formatDate(i.nextService)}</dd>
                  </dl>
                  <div className="mt-auto flex gap-4 pt-4 text-sm">
                    <Link href="/contact/?topic=service" className="link-arrow">
                      Request service <span aria-hidden>→</span>
                    </Link>
                    <Link href="/portal/ask/" className="font-semibold text-ink-soft hover:text-plum">
                      Ask a question
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="consumables" className="scroll-mt-40">
        <Panel>
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-4">
            <h3 className="text-xl font-bold">Consumables &amp; reagents</h3>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} className="accent-plum" />
              Show low stock only
            </label>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-6 py-3 font-semibold">Item</th>
                  <th className="px-6 py-3 font-semibold">Used on</th>
                  <th className="px-6 py-3 text-right font-semibold">On hand</th>
                  <th className="px-6 py-3 text-right font-semibold">Reorder at</th>
                  <th className="px-6 py-3 font-semibold">Lot · expiry</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {consumables.map((c) => {
                  const low = isLowStock(c);
                  const product = getProduct(c.productSlug);
                  return (
                    <tr key={c.sku}>
                      <td className="px-6 py-3">
                        <p className="font-semibold">{c.name}</p>
                        <p className="font-mono text-xs text-ink-soft">
                          {c.sku} · {c.unit}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-ink-soft">{product?.name}</td>
                      <td className="px-6 py-3 text-right text-base font-bold">{c.onHand}</td>
                      <td className="px-6 py-3 text-right text-ink-soft">{c.reorderPoint}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-ink-soft">
                        {c.lot} · {formatDate(c.expires)}
                      </td>
                      <td className="px-6 py-3">
                        <Badge>{c.onHand === 0 ? "Out of stock" : low ? "Low stock" : "In stock"}</Badge>
                        {c.standingOrder && <p className="mt-1 text-xs text-ink-soft">Standing order</p>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-right">
                        {low && (
                          <Link href="/contact/?topic=quote" className="btn btn-primary !px-4 !py-1.5 text-xs">
                            Reorder
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </div>
  );
}
