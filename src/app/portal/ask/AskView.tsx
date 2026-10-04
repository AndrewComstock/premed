"use client";

import Link from "next/link";
import { AgentSlot } from "@/components/agents/AgentSlot";
import { useSession } from "@/components/portal/PortalSession";
import { Badge, PageTitle, Panel } from "@/components/portal/ui";
import { roleLabels } from "@/lib/portal";
import { getProduct, type CategoryId } from "@/lib/products";

// Clinical Product Q&A is NOT implemented yet. This page is the placeholder that shows
// where the agent goes (placement "clinical-product-qa" in src/agents/registry.ts) and
// what context it will receive. See docs/AGENTS.md.

const exampleQuestions: Partial<Record<CategoryId, (name: string) => string>> = {
  diagnostics: (n) => `What specimen types are validated on the ${n}, and how long are samples stable before testing?`,
  genomics: (n) => `What is the minimum input for a run on the ${n}?`,
  "cell-analysis": (n) => `How do I run daily QC on the ${n} and what should I do if it fails?`,
  imaging: (n) => `Which objectives on the ${n} are best for live-cell imaging?`,
  "chromatography-ms": (n) => `How often should the source on the ${n} be cleaned?`,
  automation: (n) => `Can the ${n} handle viscous samples like whole blood?`,
  bioprocessing: (n) => `What cleaning validation documents exist for the ${n}?`,
  "sample-storage": (n) => `How long does the ${n} hold temperature during a power outage?`,
};

const productQuestions: Record<string, string> = {
  "immunix-ia": "Does hemolysis interfere with the hs-Troponin I assay on the Immunix 300?",
  "thermaq-96-qpcr": "Which RT-qPCR master mixes are validated on the ThermaQ 96, and how long are they stable once thawed?",
  "helix-mini": "How quickly can the Helix Mini return a pathogen genome for an outbreak investigation?",
};

export function AskView() {
  const { account, user } = useSession();
  const installed = account.instruments.map((i) => i.productSlug);
  const products = [...new Set(installed)].map(getProduct).filter((p) => p !== undefined);
  const askers = account.users.filter((u) => u.role === "clinician" || u.role === "lab-manager" || u.role === "researcher");

  return (
    <div className="space-y-8">
      <PageTitle
        title="Ask about products"
        intro="Doctors, nurses and lab staff will be able to ask plain-language questions about the instruments and assays your institution uses, and get answers sourced from Halcyra documentation."
      >
        <Badge tone="amber">Coming soon</Badge>
      </PageTitle>

      <AgentSlot
        placement="clinical-product-qa"
        title="Clinical Product Q&A"
        prompt={`Ask about specimen requirements, run times, QC, error codes or storage for the instruments at ${account.shortName}. Answers will cite the instructions for use and spec sheets they come from.`}
        context={{
          page: "/portal/ask",
          accountId: account.id,
          userRole: user.role,
          installedProducts: installed,
        }}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <Panel title="Questions your team might ask" className="lg:col-span-2">
          <ul className="divide-y divide-line">
            {products.map((p) => {
              const q = productQuestions[p.slug] ?? exampleQuestions[p.category]?.(p.name);
              return (
                <li key={p.slug} className="flex items-start gap-4 px-6 py-4">
                  <span aria-hidden className="mt-0.5 text-teal">“</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{q ?? `How do I get started with the ${p.name}?`}</p>
                    <Link href={`/products/${p.slug}/`} className="text-xs text-plum hover:underline">
                      {p.name} · {p.sku}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-8">
          <Panel title="Who will have access">
            <ul className="divide-y divide-line">
              {askers.map((u) => (
                <li key={u.id} className="px-6 py-3">
                  <p className="text-sm font-semibold">{u.name}</p>
                  <p className="text-xs text-ink-soft">
                    {roleLabels[u.role]} · {u.department}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft">
            <h3 className="text-base font-bold text-ink">How it will work</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Answers come only from Halcyra product documentation for instruments on this account.</li>
              <li>Each answer links to its source document and section.</li>
              <li>Questions about a specific patient are declined and routed to your laboratory director.</li>
              <li>Instrument faults hand off to the Service Agent to open a service request.</li>
            </ul>
            <p className="mt-4 text-xs">
              Product information only, not medical advice. Halcyra is a fictional company and these products are not
              cleared for clinical use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
