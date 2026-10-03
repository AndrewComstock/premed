import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { news, formatDate } from "@/lib/news";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero eyebrow="Newsroom" title="News, stories and events" />
      <section className="py-16">
        <div className="container-page max-w-4xl divide-y divide-line">
          {sorted.map((n) => (
            <article key={n.slug} id={n.slug} className="scroll-mt-28 py-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-dark">
                {n.type} · {formatDate(n.date)}
              </p>
              <h2 className="mt-2 text-2xl font-bold">{n.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{n.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
