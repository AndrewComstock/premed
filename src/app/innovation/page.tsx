import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Innovation" };

const pillars = [
  {
    title: "Intelligent instruments",
    body: "On-device machine learning for denoising, autofocus, QC and predictive maintenance, so every run is a good run.",
  },
  {
    title: "The connected lab",
    body: "Open APIs, SiLA 2 and cloud data services that link instruments, LIMS and ELNs into one system of record.",
  },
  {
    title: "AI agents for science",
    body: "Assistants that help researchers design experiments, procurement teams build quotes and engineers resolve issues before they cause downtime.",
  },
  {
    title: "Sustainable by design",
    body: "Natural refrigerants, lower-power electronics and reagent-sparing chemistries that cut the footprint of every experiment.",
  },
];

const pipeline = [
  { phase: "Research", items: ["Spatial multiomics imaging", "Label-free cell sorting"] },
  { phase: "Development", items: ["Helix Long-Read module", "Orion single-cell proteomics source"] },
  { phase: "Launch 2027", items: ["CellForge Allogeneic", "Atlas Mobile workcell"] },
];

export default function InnovationPage() {
  return (
    <>
      <PageHero
        eyebrow="Innovation"
        title="Pushing the boundaries of what a laboratory can do"
        intro="Every year we reinvest 14 percent of revenue into research and development across our centers in Boston, Cambridge (UK), Singapore and Basel."
      />
      <section className="py-20">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {pillars.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-line p-8">
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-teal-dark">0{i + 1}</span>
              <h2 className="mt-2 text-2xl font-extrabold">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-ink py-20 text-white">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Technology pipeline</p>
          <h2 className="mt-3 text-3xl font-extrabold">What we are working on next</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pipeline.map((col) => (
              <div key={col.phase} className="rounded-2xl bg-white/5 p-7">
                <h3 className="font-bold text-teal">{col.phase}</h3>
                <ul className="mt-4 space-y-3">
                  {col.items.map((it) => (
                    <li key={it} className="border-l-2 border-plum pl-3 text-white/85">{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-white/50">Pipeline items are fictional and shown for demonstration.</p>
        </div>
      </section>
    </>
  );
}
