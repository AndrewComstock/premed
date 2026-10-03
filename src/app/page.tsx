import Link from "next/link";
import { categories, products } from "@/lib/products";
import { news, formatDate } from "@/lib/news";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { AgentSlot } from "@/components/agents/AgentSlot";

const stats = [
  { value: "4,200+", label: "universities and research institutes equipped" },
  { value: "60+", label: "countries with local service engineers" },
  { value: "900+", label: "hospital laboratories running Halcyra systems" },
  { value: "$1.1B", label: "invested in R&D over the last five years" },
];

const sectors = [
  {
    id: "academic",
    title: "Academic & Research",
    body: "Core facilities and investigator labs rely on Halcyra to support more science per instrument, with education pricing and training built in.",
  },
  {
    id: "government",
    title: "Government & Public Health",
    body: "From pathogen surveillance to environmental monitoring, we equip agencies with validated, secure and scalable workflows.",
  },
  {
    id: "healthcare",
    title: "Hospitals & Health Systems",
    body: "Clinical labs and cell therapy programs use Halcyra to deliver faster answers and new treatments close to the patient.",
  },
];

export default function Home() {
  const featured = products.filter((p) => p.status === "featured").slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Instruments for discovery</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] md:text-6xl">
              Science moves faster when the lab does.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Halcyra designs the sequencers, cytometers, microscopes and automated systems that universities,
              government laboratories and hospitals use to understand disease and deliver better care.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/products/" className="btn btn-light">
                Explore products <span aria-hidden>→</span>
              </Link>
              <Link href="/solutions/" className="btn btn-outline text-white">
                Solutions for your lab
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2rem] bg-white/5 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <ProductVisual category="genomics" className="col-span-2 w-full rounded-2xl shadow-2xl" />
              <ProductVisual category="imaging" className="w-full rounded-2xl shadow-xl" />
              <ProductVisual category="cell-analysis" className="w-full rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-plum md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-sand py-20">
        <div className="container-page">
          <p className="eyebrow">Who we serve</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold md:text-4xl">
            Built for the institutions that serve everyone.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sectors.map((s, i) => (
              <Link
                key={s.id}
                href={`/solutions/#${s.id}`}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 transition hover:shadow-xl hover:shadow-ink/10"
              >
                <span className="font-[family-name:var(--font-display)] text-5xl font-extrabold text-mist">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold group-hover:text-plum">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.body}</p>
                <span className="link-arrow mt-6 text-sm">
                  Learn more <span aria-hidden>→</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal to-plum transition group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product finder agent slot + categories */}
      <section className="py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Our portfolio</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold md:text-4xl">
                One partner, from sample to insight.
              </h2>
            </div>
            <Link href="/products/" className="link-arrow">
              View all {products.length} products <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-10">
            <AgentSlot
              placement="catalog-search"
              title="Not sure where to start? Describe your experiment."
              prompt="An AI product finder will recommend instruments and workflows from a plain-language description of your research."
              context={{ page: "/" }}
            />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products/?category=${c.id}`}
                className="group rounded-2xl border border-line p-6 transition hover:border-plum hover:bg-sand"
              >
                <h3 className="font-bold group-hover:text-plum">{c.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{c.summary}</p>
                <p className="mt-4 text-xs font-semibold text-teal-dark">
                  {products.filter((p) => p.category === c.id).length} products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-mist py-20">
        <div className="container-page">
          <p className="eyebrow">Featured</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Instruments our customers count on</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Innovation split */}
      <section className="py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="hero-gradient relative aspect-[4/3] overflow-hidden rounded-3xl">
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
              {Array.from({ length: 14 }).map((_, i) => (
                <g key={i} opacity={0.35 + (i % 4) * 0.12}>
                  <circle cx={30 + i * 26} cy={150 + Math.sin(i / 1.6) * 70} r="6" fill="#00a3ad" />
                  <circle cx={30 + i * 26} cy={150 - Math.sin(i / 1.6) * 70} r="6" fill="#b48ae0" />
                  <line
                    x1={30 + i * 26}
                    x2={30 + i * 26}
                    y1={150 + Math.sin(i / 1.6) * 70}
                    y2={150 - Math.sin(i / 1.6) * 70}
                    stroke="#fff"
                    strokeOpacity=".25"
                  />
                </g>
              ))}
            </svg>
            <div className="absolute bottom-6 left-6 rounded-xl bg-white/10 px-4 py-3 text-white backdrop-blur">
              <p className="text-xs uppercase tracking-widest text-white/70">Halcyra Labs</p>
              <p className="font-semibold">Intelligent instruments</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Innovation</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              Instruments that learn, labs that run themselves.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              We are building AI into every layer of the laboratory, from on-device denoising in our microscopes to
              scheduling software that recovers from errors overnight. Next: intelligent agents that help scientists
              design experiments, order supplies and keep instruments running.
            </p>
            <Link href="/innovation/" className="btn btn-primary mt-8">
              Our approach to innovation
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-sand py-20">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Newsroom</p>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Latest from Halcyra</h2>
            </div>
            <Link href="/news/" className="link-arrow hidden md:inline-flex">
              All news <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <article key={n.slug} className="flex flex-col rounded-2xl bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-dark">
                  {n.type} · {formatDate(n.date)}
                </p>
                <h3 className="mt-3 text-lg font-bold leading-snug">{n.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{n.summary}</p>
                <Link href={`/news/#${n.slug}`} className="link-arrow mt-5 text-sm">
                  Read more <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-page">
          <div className="hero-gradient flex flex-col items-start justify-between gap-8 rounded-3xl p-10 text-white md:flex-row md:items-center md:p-14">
            <div>
              <h2 className="text-3xl font-extrabold">Planning a new lab or a grant-funded purchase?</h2>
              <p className="mt-3 max-w-xl text-white/80">
                Our specialists help with configuration, budgeting, grant documentation and installation.
              </p>
            </div>
            <Link href="/contact/?topic=quote" className="btn btn-light shrink-0">
              Talk to a specialist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
