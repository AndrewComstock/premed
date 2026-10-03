import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { AgentSlot } from "@/components/agents/AgentSlot";

export const metadata: Metadata = { title: "Service & Support" };

const services = [
  { title: "Installation & training", body: "Certified engineers install, qualify and train your team on site." },
  { title: "Service plans", body: "Preventive maintenance and guaranteed response times from 4 hours." },
  { title: "Remote diagnostics", body: "Connected instruments flag issues before they cause downtime." },
  { title: "Validation services", body: "IQ/OQ/PQ documentation for regulated and clinical environments." },
  { title: "Consumables & reagents", body: "Standing orders and institutional price agreements." },
  { title: "Lab relocation", body: "Decommission, move and requalify instruments with minimal downtime." },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Service & Support"
        title="Keeping your science running, every day"
        intro="More than 2,500 field service engineers and application scientists support Halcyra customers worldwide."
      />
      <section className="py-16">
        <div className="container-page">
          <AgentSlot
            placement="support"
            title="Get help with an instrument"
            prompt="A service agent will troubleshoot errors, look up warranty status and schedule an engineer visit."
            context={{ page: "/support" }}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl bg-sand p-7">
                <h2 className="text-lg font-bold">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-line p-7">
              <p className="eyebrow">Phone</p>
              <p className="mt-2 text-xl font-bold">+1 (800) 555-0142</p>
              <p className="mt-1 text-sm text-ink-soft">24/7 for clinical customers</p>
            </div>
            <div className="rounded-2xl border border-line p-7">
              <p className="eyebrow">Email</p>
              <p className="mt-2 text-xl font-bold">service@halcyra.example</p>
              <p className="mt-1 text-sm text-ink-soft">Response within 4 business hours</p>
            </div>
            <div className="rounded-2xl border border-line p-7">
              <p className="eyebrow">Online</p>
              <Link href="/contact/?topic=service" className="mt-2 block text-xl font-bold text-plum">
                Open a service request →
              </Link>
              <p className="mt-1 text-sm text-ink-soft">Track cases in the customer portal</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
