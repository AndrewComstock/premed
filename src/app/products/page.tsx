import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { AgentSlot } from "@/components/agents/AgentSlot";
import { Catalog } from "./Catalog";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product catalog"
        title="Instruments, software and systems for every step of discovery"
        intro="Browse our portfolio across genomics, cell analysis, imaging, mass spectrometry, automation, bioprocessing, cold storage and clinical diagnostics."
      />
      <section className="py-14">
        <div className="container-page">
          <AgentSlot
            placement="catalog-search"
            variant="inline"
            title="Search the catalog in plain language"
            prompt='Try "I need to profile immune cells from 200 patient samples a week" once the product finder agent is connected.'
            context={{ page: "/products" }}
          />
          <Suspense fallback={<div className="py-20 text-center text-ink-soft">Loading catalog…</div>}>
            <Catalog />
          </Suspense>
        </div>
      </section>
    </>
  );
}
