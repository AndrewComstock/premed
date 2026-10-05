"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentSlot } from "@/components/agents/AgentSlot";
import { usePortal, useSession } from "@/components/portal/PortalSession";
import { Badge, PageTitle, Panel } from "@/components/portal/ui";
import { formatDate, roleLabels } from "@/lib/portal";
import { getProduct, type CategoryId } from "@/lib/products";

// HalcyraIQ: product Q&A for the instruments on an account. An account admin activates it once
// (saved by the portal API), then everyone sees how to use it in Slack, Teams or the web app.
// The Q&A agent itself is NOT implemented yet: the web app is the "clinical-product-qa"
// placement in src/agents/registry.ts. See docs/AGENTS.md.

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

export function IQView() {
  const { account, user, halcyraIQ } = useSession();
  const { setIQ } = usePortal();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user.role === "admin";
  const admins = account.users.filter((u) => u.role === "admin");

  const toggle = async (on: boolean) => {
    setBusy(true);
    setError(await setIQ(on));
    setBusy(false);
  };

  return (
    <div className="space-y-8">
      <PageTitle
        title="HalcyraIQ"
        intro={`Plain-language answers about the instruments and assays at ${account.shortName}, sourced from Halcyra documentation. Use it in Slack, Microsoft Teams or the web.`}
      >
        {halcyraIQ ? <Badge tone="green">Active</Badge> : <Badge tone="amber">Not activated</Badge>}
      </PageTitle>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {halcyraIQ ? (
        <Activated activatedAt={halcyraIQ.activatedAt} activatedBy={halcyraIQ.activatedBy} />
      ) : (
        <section className="rounded-2xl bg-gradient-to-r from-plum to-teal-dark p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Activate HalcyraIQ</p>
          <h3 className="mt-2 text-2xl font-extrabold">Turn on HalcyraIQ for {account.shortName}</h3>
          <ul className="mt-4 max-w-2xl list-disc space-y-1.5 pl-5 text-sm text-white/85">
            <li>Answers come only from Halcyra documentation for the instruments on this account.</li>
            <li>Each answer links to the instructions for use or spec sheet it comes from.</li>
            <li>Available to everyone at {account.shortName} with portal access, in Slack, Teams or the web.</li>
          </ul>
          {isAdmin ? (
            <button onClick={() => toggle(true)} disabled={busy} className="btn btn-light mt-6 disabled:opacity-60">
              {busy ? "Activating…" : "Activate HalcyraIQ"}
            </button>
          ) : (
            <p className="mt-6 text-sm font-semibold">
              Ask your account admin{admins.length ? `, ${admins.map((a) => a.name).join(" or ")},` : ""} to activate
              HalcyraIQ.
            </p>
          )}
        </section>
      )}

      <Details />

      {halcyraIQ && isAdmin && (
        <p className="text-xs text-ink-soft">
          Need to switch it off?{" "}
          <button onClick={() => toggle(false)} disabled={busy} className="font-semibold text-plum hover:underline">
            Deactivate HalcyraIQ
          </button>
        </p>
      )}
    </div>
  );
}

function Activated({ activatedAt, activatedBy }: { activatedAt: string; activatedBy: string }) {
  const { account, user } = useSession();
  const connectCode = `IQ-${account.accountNumber}`;

  return (
    <>
      <p className="-mt-4 text-sm text-ink-soft">
        Activated by {activatedBy} on {formatDate(activatedAt.slice(0, 10))}. Pick where you want to use it.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <Channel
          name="Slack"
          mark="S"
          steps={[
            <>In Slack, open <b>Apps</b> and search for <b>HalcyraIQ</b>. Your workspace admin may need to approve it.</>,
            <>Click <b>Add to Slack</b> and allow the requested permissions.</>,
            <>In any channel, type <code className="rounded bg-mist px-1">/halcyraiq connect {connectCode}</code> to link it to {account.shortName}.</>,
            <>Ask a question by messaging HalcyraIQ directly or mentioning <b>@HalcyraIQ</b> in a channel.</>,
          ]}
        />
        <Channel
          name="Microsoft Teams"
          mark="T"
          steps={[
            <>In Teams, select <b>Apps</b> and search for <b>HalcyraIQ</b>. Your Teams admin may need to allow it in the Teams admin center.</>,
            <>Select <b>Add</b>, then sign in with your Halcyra portal email when prompted.</>,
            <>Enter the connect code <code className="rounded bg-mist px-1">{connectCode}</code> if asked.</>,
            <>Chat with HalcyraIQ, or mention <b>@HalcyraIQ</b> in a channel or meeting chat.</>,
          ]}
        />
        <Channel
          name="Web app"
          mark="W"
          steps={[
            <>No install needed. Use the HalcyraIQ chat on this page, signed in with your portal account.</>,
            <>Bookmark this page to come back to it.</>,
            <>Questions and answers are visible only to you.</>,
          ]}
          action={{ href: "#web-app", label: "Open the web app" }}
        />
      </div>

      <div id="web-app" className="scroll-mt-24">
        <AgentSlot
          placement="clinical-product-qa"
          title="HalcyraIQ web app"
          prompt={`Ask about specimen requirements, run times, QC, error codes or storage for the instruments at ${account.shortName}. Answers cite the instructions for use and spec sheets they come from.`}
          context={{
            page: "/portal/iq",
            accountId: account.id,
            userRole: user.role,
            installedProducts: account.instruments.map((i) => i.productSlug),
          }}
        />
      </div>
    </>
  );
}

function Channel({
  name,
  mark,
  steps,
  action,
}: {
  name: string;
  mark: string;
  steps: React.ReactNode[];
  action?: { href: string; label: string };
}) {
  return (
    <section className="flex flex-col rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-lg font-extrabold text-teal">
          {mark}
        </span>
        <h3 className="text-lg font-bold">{name}</h3>
      </div>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      {action && (
        <a href={action.href} className="link-arrow mt-auto pt-4 text-sm">
          {action.label} <span aria-hidden>→</span>
        </a>
      )}
    </section>
  );
}

function Details() {
  const { account } = useSession();
  const installed = account.instruments.map((i) => i.productSlug);
  const products = [...new Set(installed)].map(getProduct).filter((p) => p !== undefined);
  const askers = account.users.filter((u) => u.role === "clinician" || u.role === "lab-manager" || u.role === "researcher");

  return (
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
        <Panel title="Who uses it most">
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
          <h3 className="text-base font-bold text-ink">How it works</h3>
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
  );
}
