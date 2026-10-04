"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/components/portal/PortalSession";
import { Badge, PageTitle } from "@/components/portal/ui";
import { useHash } from "@/components/portal/useHash";
import { formatDate, formatMoney, orderTotal, type Order } from "@/lib/portal";

const filters = ["All", "Open", "Delivered"] as const;
type Filter = (typeof filters)[number];

export function OrdersView() {
  const { account } = useSession();
  const hash = useHash();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const orders = account.orders.filter((o) => {
    if (filter === "Open" && o.status === "Delivered") return false;
    if (filter === "Delivered" && o.status !== "Delivered") return false;
    if (!q) return true;
    return [o.id, o.po, o.placedBy, ...o.lines.flatMap((l) => [l.sku, l.description])].some((s) => s.toLowerCase().includes(q));
  });

  return (
    <div>
      <PageTitle title="Orders" intro="Every order placed under your account, with line items, PO numbers and linked shipments.">
        <Link href="/contact/?topic=quote" className="btn btn-primary self-start text-sm">
          Request a quote
        </Link>
      </PageTitle>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2" role="tablist">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === f ? "bg-ink text-white" : "bg-white text-ink-soft hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order, PO, SKU or item"
          className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-plum sm:w-72"
        />
      </div>

      <div className="space-y-5">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} highlighted={hash === o.id} />
        ))}
        {orders.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-ink-soft">No orders match.</p>}
      </div>
    </div>
  );
}

function OrderCard({ order, highlighted }: { order: Order; highlighted: boolean }) {
  return (
    <article
      id={order.id}
      className={`scroll-mt-40 rounded-2xl border bg-white transition ${highlighted ? "border-plum ring-2 ring-plum/30" : "border-line"}`}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-6 py-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">{order.id}</h3>
            <Badge>{order.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            PO {order.po} · placed {formatDate(order.placed)} by {order.placedBy}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-ink-soft">Order total</p>
          <p className="text-xl font-extrabold">{formatMoney(orderTotal(order))}</p>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-6 py-2.5 font-semibold">SKU</th>
              <th className="px-6 py-2.5 font-semibold">Item</th>
              <th className="px-6 py-2.5 text-right font-semibold">Qty</th>
              <th className="px-6 py-2.5 text-right font-semibold">Unit price</th>
              <th className="px-6 py-2.5 text-right font-semibold">Line total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.lines.map((l) => (
              <tr key={l.sku}>
                <td className="whitespace-nowrap px-6 py-2.5 font-mono text-xs text-ink-soft">{l.sku}</td>
                <td className="px-6 py-2.5">
                  {l.productSlug ? (
                    <Link href={`/products/${l.productSlug}/`} className="font-medium text-plum hover:underline">
                      {l.description}
                    </Link>
                  ) : (
                    l.description
                  )}
                </td>
                <td className="px-6 py-2.5 text-right">{l.qty}</td>
                <td className="whitespace-nowrap px-6 py-2.5 text-right">{formatMoney(l.unitPrice)}</td>
                <td className="whitespace-nowrap px-6 py-2.5 text-right font-semibold">{formatMoney(l.qty * l.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3 text-sm">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
          {order.shipments.length === 0 ? (
            <span>Not yet shipped{order.status === "Backordered" ? ". Your account manager will confirm a ship date." : "."}</span>
          ) : (
            order.shipments.map((id) => (
              <Link key={id} href={`/portal/deliveries/#${id}`} className="link-arrow">
                Track {id} <span aria-hidden>→</span>
              </Link>
            ))
          )}
        </div>
        <Link href={`/contact/?topic=quote`} className="font-semibold text-ink-soft hover:text-plum">
          Reorder these items
        </Link>
      </footer>
    </article>
  );
}
