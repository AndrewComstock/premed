import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { AgentSlot } from "@/components/agents/AgentSlot";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="How can we help?"
        intro="Request a quote, book a demonstration or reach our service team."
      />
      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_22rem]">
          <Suspense>
            <ContactForm />
          </Suspense>
          <aside className="space-y-6">
            <AgentSlot
              placement="quote-request"
              variant="inline"
              title="Prefer to chat?"
              prompt="A procurement agent will gather requirements and draft a quote for you."
              context={{ page: "/contact" }}
            />
            <div className="rounded-2xl bg-sand p-6 text-sm">
              <h2 className="font-bold">Global headquarters</h2>
              <p className="mt-2 text-ink-soft">
                400 Discovery Way
                <br />
                Cambridge, MA 02142, USA
              </p>
              <p className="mt-4 text-ink-soft">+1 (800) 555-0100</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
