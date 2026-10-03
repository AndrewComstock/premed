import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { AgentSlot } from "@/components/agents/AgentSlot";
import { productsBySector, sectorLabels, type Sector } from "@/lib/products";

export const metadata: Metadata = { title: "Solutions" };

const content: Record<Sector, { headline: string; body: string; points: string[] }> = {
  academic: {
    headline: "More science per instrument, more scientists per facility.",
    body: "Core facilities and investigator labs choose Halcyra for multi-user scheduling, education pricing and training that gets students productive fast.",
    points: [
      "Education and core-facility pricing",
      "Grant-writing support and budget quotes",
      "Teaching-lab curricula and certification",
      "Shared-instrument booking and usage reporting",
    ],
  },
  government: {
    headline: "Trusted infrastructure for public health and national research.",
    body: "Agencies rely on Halcyra for validated workflows, secure data handling and procurement through established contract vehicles.",
    points: [
      "Available on government purchasing schedules",
      "FedRAMP-aligned cloud options and on-premise deployment",
      "Surge capacity and outbreak response programs",
      "Supply-chain transparency and domestic service",
    ],
  },
  healthcare: {
    headline: "Faster answers for clinicians, new therapies close to the patient.",
    body: "Hospital laboratories and cell therapy programs use Halcyra systems to shorten turnaround times and bring advanced treatments in house.",
    points: [
      "Bidirectional LIS/EHR connectivity",
      "Point-of-care cell therapy manufacturing",
      "Reagent rental and cost-per-test models",
      "24/7 clinical service response",
    ],
  },
  biopharma: {
    headline: "From discovery to GMP manufacturing on one platform.",
    body: "Biopharma partners scale processes from bench to bioreactor with matched technology and compliance-ready software.",
    points: [
      "21 CFR Part 11 software",
      "Scale-up from 50 L to 2,000 L",
      "Validation and qualification services",
      "Global supply agreements",
    ],
  },
};

export default function SolutionsPage() {
  const sectors = Object.keys(content) as Sector[];
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Partners to the institutions that advance human health"
        intro="Whether you run a university core, a public health laboratory or a hospital cell therapy program, Halcyra brings the instruments, software and expertise to match your mission."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {sectors.map((s) => (
            <a key={s} href={`#${s}`} className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10">
              {sectorLabels[s]}
            </a>
          ))}
        </div>
      </PageHero>

      {sectors.map((s, i) => (
        <section key={s} id={s} className={`scroll-mt-28 py-20 ${i % 2 ? "bg-sand" : ""}`}>
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow">{sectorLabels[s]}</p>
                <h2 className="mt-3 text-3xl font-extrabold">{content[s].headline}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{content[s].body}</p>
                <ul className="mt-6 space-y-3">
                  {content[s].points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/contact/?topic=quote&sector=${s}`} className="btn btn-primary mt-8">
                  Talk to our {sectorLabels[s].split(" ")[0].toLowerCase()} team
                </Link>
              </div>
              <div className="self-center">
                <AgentSlot
                  placement="sector-advisor"
                  title={`${sectorLabels[s]} advisor`}
                  prompt="An agent will answer procurement, compliance and workflow questions specific to this sector."
                  context={{ page: "/solutions", sector: s }}
                />
              </div>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productsBySector(s).slice(0, 3).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
