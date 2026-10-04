"use client";

import Link from "next/link";
import { useSession } from "@/components/portal/PortalSession";
import { Badge, PageTitle } from "@/components/portal/ui";
import { useHash } from "@/components/portal/useHash";
import { formatDate, type Shipment, type ShipmentStatus } from "@/lib/portal";

const steps: ShipmentStatus[] = ["Label created", "In transit", "Out for delivery", "Delivered"];

export function DeliveriesView() {
  const { account } = useSession();
  const hash = useHash();
  const active = account.shipments.filter((s) => s.status !== "Delivered");
  const delivered = account.shipments.filter((s) => s.status === "Delivered");

  return (
    <div className="space-y-10">
      <PageTitle
        title="Deliveries"
        intro="Live tracking for every shipment, including temperature-controlled reagents and white glove instrument freight."
      />
      <section>
        <h3 className="mb-4 text-xl font-bold">On the way ({active.length})</h3>
        <div className="space-y-5">
          {active.map((s) => (
            <ShipmentCard key={s.id} shipment={s} highlighted={hash === s.id} />
          ))}
          {active.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-ink-soft">Nothing on the way right now.</p>}
        </div>
      </section>
      <section>
        <h3 className="mb-4 text-xl font-bold">Delivered</h3>
        <div className="space-y-5">
          {delivered.map((s) => (
            <ShipmentCard key={s.id} shipment={s} highlighted={hash === s.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ShipmentCard({ shipment: s, highlighted }: { shipment: Shipment; highlighted: boolean }) {
  // A delayed shipment is in transit with a problem, so it sits at the "In transit" step.
  const current = steps.indexOf(s.status === "Delayed" ? "In transit" : s.status);

  return (
    <article
      id={s.id}
      className={`scroll-mt-40 rounded-2xl border bg-white p-6 transition ${highlighted ? "border-plum ring-2 ring-plum/30" : "border-line"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-bold">{s.contents}</h4>
            <Badge>{s.status}</Badge>
            {s.coldChain && <Badge tone="teal">Cold chain</Badge>}
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {s.id} for{" "}
            <Link href={`/portal/orders/#${s.orderId}`} className="font-semibold text-plum hover:underline">
              {s.orderId}
            </Link>{" "}
            · {s.carrier} · tracking <span className="font-mono">{s.tracking}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-ink-soft">{s.status === "Delivered" ? "Delivered" : "Expected"}</p>
          <p className="text-xl font-extrabold">{formatDate(s.eta)}</p>
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Shipment progress">
        {steps.map((step, i) => {
          const done = i <= current;
          const problem = s.status === "Delayed" && i === current;
          return (
            <li key={step}>
              <div className={`h-1.5 rounded-full ${problem ? "bg-red-500" : done ? "bg-teal" : "bg-mist"}`} />
              <p className={`mt-2 text-xs ${done ? "font-semibold text-ink" : "text-ink-soft"}`}>{problem ? "Delayed" : step}</p>
            </li>
          );
        })}
      </ol>

      <ul className="mt-6 space-y-3 border-l-2 border-line pl-5 text-sm">
        {s.events.map((e) => (
          <li key={e.date} className="relative">
            <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-teal" />
            <p className="font-medium">{e.detail}</p>
            <p className="text-xs text-ink-soft">
              {formatDate(e.date)} · {e.location}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
