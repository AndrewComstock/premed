import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "About" };

const values = [
  { title: "Rigor", body: "We build instruments scientists can stake their reputations on." },
  { title: "Access", body: "Great tools should reach every lab, from flagship universities to rural hospitals." },
  { title: "Partnership", body: "We succeed when our customers' science succeeds." },
  { title: "Responsibility", body: "We design for safety, security and a lower environmental footprint." },
];

const leaders = [
  { name: "Dr. Imani Okafor", role: "Chief Executive Officer" },
  { name: "Marcus Lindqvist", role: "Chief Financial Officer" },
  { name: "Dr. Priya Raman", role: "Chief Scientific Officer" },
  { name: "Elena Vasquez", role: "President, Clinical & Healthcare" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Halcyra"
        title="Our purpose: give every lab the power to discover"
        intro="Founded in 1998 as a spin-out from a university genomics core, Halcyra Life Sciences now equips more than 4,200 research institutions, public health agencies and hospitals in over 60 countries."
      />
      <section className="py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-3xl font-extrabold">From one core facility to a global partner</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Halcyra began when a team of engineers and biologists set out to build the sequencer they wished their
              core facility had. Twenty-eight years later, we design instruments across the life sciences workflow,
              but our approach is the same: work side by side with the scientists, technologists and clinicians who
              use our products every day.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["1998", "Founded"], ["11,800", "Employees"], ["$4.6B", "2025 revenue"], ["14%", "Revenue reinvested in R&D"]].map(
              ([v, l]) => (
                <div key={l} className="rounded-2xl bg-sand p-6">
                  <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-plum">{v}</p>
                  <p className="mt-1 text-sm text-ink-soft">{l}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="bg-mist py-20">
        <div className="container-page">
          <p className="eyebrow">Our values</p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-7">
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-page">
          <p className="eyebrow">Leadership</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((l) => (
              <div key={l.name}>
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-ink to-plum font-[family-name:var(--font-display)] text-5xl font-extrabold text-white/90">
                  {l.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="mt-4 font-bold">{l.name}</h3>
                <p className="text-sm text-ink-soft">{l.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="investors" className="scroll-mt-28 bg-sand py-16">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">Investors</h2>
            <p className="mt-3 text-ink-soft">
              Quarterly results, annual reports and governance documents. (Placeholder: Halcyra is fictional and not
              publicly traded.)
            </p>
          </div>
          <div id="careers" className="scroll-mt-28">
            <h2 className="text-2xl font-extrabold">Careers</h2>
            <p className="mt-3 text-ink-soft">
              Join engineers, scientists and service specialists building the future of the laboratory. (Placeholder.)
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
