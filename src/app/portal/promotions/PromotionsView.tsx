"use client";

import Link from "next/link";
import { useSession } from "@/components/portal/PortalSession";
import { Badge, PageTitle } from "@/components/portal/ui";
import { formatDate, type Promotion } from "@/lib/portal";
import { getProduct, sectorLabels } from "@/lib/products";

export function PromotionsView() {
  const { account, promotions: promos } = useSession();
  const contract = promos.filter((p) => p.accountId);
  const offers = promos.filter((p) => !p.accountId);
  const owned = new Set(account.instruments.map((i) => i.productSlug));

  return (
    <div className="space-y-10">
      <PageTitle
        title="Promotions & pricing"
        intro={`Offers available to ${sectorLabels[account.sector].toLowerCase()} customers, plus the negotiated pricing on your account.`}
      />

      {contract.length > 0 && (
        <section className="space-y-4">
          {contract.map((p) => (
            <div key={p.id} className="hero-gradient flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6 text-white">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Your contract</p>
                <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-white/80">{p.summary}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold">{p.offer}</p>
                <p className="text-xs text-white/70">Valid through {formatDate(p.ends)}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((p) => (
          <PromoCard key={p.id} promo={p} relevant={p.productSlugs.some((s) => owned.has(s))} />
        ))}
      </section>
    </div>
  );
}

function PromoCard({ promo: p, relevant }: { promo: Promotion; relevant: boolean }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Ends {formatDate(p.ends)}</p>
        {relevant && <Badge tone="plum">Fits your instruments</Badge>}
      </div>
      <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
      <p className="mt-1 text-xl font-extrabold text-teal-dark">{p.offer}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{p.summary}</p>
      <p className="mt-4 text-xs text-ink-soft">
        Applies to:{" "}
        {p.productSlugs.map((slug, i) => {
          const product = getProduct(slug);
          return (
            <span key={slug}>
              {i > 0 && ", "}
              <Link href={`/products/${slug}/`} className="text-plum hover:underline">
                {product?.name}
              </Link>
            </span>
          );
        })}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="rounded-lg border border-dashed border-plum/40 bg-plum/5 px-3 py-1.5 font-mono text-sm font-semibold text-plum">
          {p.code}
        </span>
        <Link href="/contact/?topic=quote" className="link-arrow text-sm">
          Get a quote <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
