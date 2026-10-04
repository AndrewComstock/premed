import Link from "next/link";

type Tone = "teal" | "plum" | "amber" | "red" | "slate" | "green";

const tones: Record<Tone, string> = {
  teal: "bg-teal/10 text-teal-dark",
  plum: "bg-plum/10 text-plum",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  slate: "bg-mist text-ink-soft",
  green: "bg-emerald-100 text-emerald-800",
};

const statusTones: Record<string, Tone> = {
  Processing: "slate",
  "Label created": "slate",
  "Partially shipped": "teal",
  Shipped: "teal",
  "In transit": "teal",
  "Out for delivery": "plum",
  Delivered: "green",
  Operational: "green",
  Backordered: "amber",
  "Service due": "amber",
  Delayed: "red",
  "Down for service": "red",
  "Low stock": "amber",
  "Out of stock": "red",
  "In stock": "green",
};

export function Badge({ children, tone }: { children: string; tone?: Tone }) {
  const t = tone ?? statusTones[children] ?? "slate";
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[t]}`}>
      {children}
    </span>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-white ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          {action && (
            <Link href={action.href} className="link-arrow text-sm">
              {action.label} <span aria-hidden>→</span>
            </Link>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-extrabold">{title}</h2>
        {intro && <p className="mt-2 max-w-2xl text-ink-soft">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function Stat({ label, value, note, href }: { label: string; value: string | number; note?: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
      {note && <p className="mt-1 text-sm text-ink-soft">{note}</p>}
    </Link>
  );
}
