"use client";

import Link from "next/link";
import { useSession } from "@/components/portal/PortalSession";
import { Badge, Panel, Stat } from "@/components/portal/ui";
import { formatDate, formatMoney, isLowStock, orderTotal, promotionsFor } from "@/lib/portal";
import { getProduct } from "@/lib/products";

export function OverviewView() {
  const { account, user } = useSession();
  const openOrders = account.orders.filter((o) => o.status !== "Delivered");
  const activeShipments = account.shipments.filter((s) => s.status !== "Delivered");
  const delayed = activeShipments.filter((s) => s.status === "Delayed").length;
  const lowStock = account.consumables.filter(isLowStock);
  const attention = account.instruments.filter((i) => i.status !== "Operational");
  const promos = promotionsFor(account);
  const firstName = user.name.replace(/^(Dr\.|Nurse)\s+/, "").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold">Welcome back, {firstName}</h2>
        <p className="mt-2 text-ink-soft">Here is what needs attention across {account.shortName} today.</p>
      </div>

      {user.role === "clinician" && (
        <Link
          href="/portal/ask/"
          className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-plum to-teal-dark p-6 text-white"
        >
          <div>
            <p className="font-bold">Have a question about an instrument or assay?</p>
            <p className="mt-1 text-sm text-white/80">Clinical Product Q&amp;A is coming to the portal for doctors and nurses.</p>
          </div>
          <span aria-hidden className="text-2xl">→</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open orders" value={openOrders.length} note={`${account.orders.length} in the last 90 days`} href="/portal/orders/" />
        <Stat
          label="Deliveries on the way"
          value={activeShipments.length}
          note={delayed ? `${delayed} delayed` : "All on schedule"}
          href="/portal/deliveries/"
        />
        <Stat label="Low stock items" value={lowStock.length} note="At or below reorder point" href="/portal/inventory/#consumables" />
        <Stat
          label="Instruments needing attention"
          value={attention.length}
          note={`of ${account.instruments.length} installed`}
          href="/portal/inventory/"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Panel title="Recent orders" action={{ href: "/portal/orders/", label: "All orders" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-ink-soft">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order</th>
                    <th className="px-6 py-3 font-semibold">Placed</th>
                    <th className="px-6 py-3 font-semibold">Total</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {account.orders.slice(0, 4).map((o) => (
                    <tr key={o.id}>
                      <td className="px-6 py-3">
                        <Link href={`/portal/orders/#${o.id}`} className="font-semibold text-plum hover:underline">
                          {o.id}
                        </Link>
                        <p className="text-xs text-ink-soft">{o.lines[0].description}{o.lines.length > 1 ? ` + ${o.lines.length - 1} more` : ""}</p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">{formatDate(o.placed)}</td>
                      <td className="px-6 py-3">{formatMoney(orderTotal(o))}</td>
                      <td className="px-6 py-3"><Badge>{o.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Deliveries in progress" action={{ href: "/portal/deliveries/", label: "Track deliveries" }}>
            {activeShipments.length === 0 ? (
              <p className="px-6 py-5 text-sm text-ink-soft">Nothing on the way right now.</p>
            ) : (
              <ul className="divide-y divide-line">
                {activeShipments.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <Link href={`/portal/deliveries/#${s.id}`} className="font-semibold text-plum hover:underline">
                        {s.contents}
                      </Link>
                      <p className="text-xs text-ink-soft">
                        {s.carrier} · Expected {formatDate(s.eta)}
                      </p>
                    </div>
                    <Badge>{s.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel title="Alerts">
            <ul className="divide-y divide-line text-sm">
              {attention.map((i) => (
                <li key={i.serial} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{getProduct(i.productSlug)?.name}</span>
                    <Badge>{i.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{i.location} · next visit {formatDate(i.nextService)}</p>
                </li>
              ))}
              {lowStock.map((c) => (
                <li key={c.sku} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{c.name}</span>
                    <Badge>{c.onHand === 0 ? "Out of stock" : "Low stock"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    {c.onHand} on hand · reorder at {c.reorderPoint}
                    {c.standingOrder ? " · standing order active" : ""}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="For you" action={{ href: "/portal/promotions/", label: "All offers" }}>
            <ul className="divide-y divide-line">
              {promos.slice(0, 3).map((p) => (
                <li key={p.id} className="px-6 py-4">
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="mt-0.5 text-sm text-teal-dark">{p.offer}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="rounded-2xl bg-ink p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Your account manager</p>
            <p className="mt-2 text-lg font-bold">{account.accountManager.name}</p>
            <p className="mt-1 text-sm text-white/70">{account.accountManager.email}</p>
            <p className="text-sm text-white/70">{account.accountManager.phone}</p>
            <p className="mt-4 text-xs text-white/60">{account.contract}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
