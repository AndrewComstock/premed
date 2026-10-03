"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products, sectorLabels, type Sector } from "@/lib/products";

const topics = { quote: "Request a quote", demo: "Book a demo", service: "Service request", general: "General inquiry" };

export function ContactForm() {
  const params = useSearchParams();
  const [sent, setSent] = useState(false);
  const topic = params.get("topic") ?? "general";
  const product = params.get("product") ?? "";
  const sector = params.get("sector") ?? "";

  if (sent) {
    return (
      <div className="rounded-2xl bg-teal/10 p-10">
        <h2 className="text-2xl font-extrabold">Thank you</h2>
        <p className="mt-2 text-ink-soft">
          This is a demo site, so nothing was sent. In a live deployment this form would route to CRM or an agent.
        </p>
      </div>
    );
  }

  const field = "mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-plum focus:ring-2 focus:ring-plum/20";

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="text-sm font-semibold sm:col-span-2">
        I would like to
        <select name="topic" defaultValue={topic in topics ? topic : "general"} className={field}>
          {Object.entries(topics).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        First name
        <input required name="first" className={field} />
      </label>
      <label className="text-sm font-semibold">
        Last name
        <input required name="last" className={field} />
      </label>
      <label className="text-sm font-semibold">
        Work email
        <input required type="email" name="email" className={field} />
      </label>
      <label className="text-sm font-semibold">
        Institution
        <input required name="org" className={field} />
      </label>
      <label className="text-sm font-semibold">
        Organization type
        <select name="sector" defaultValue={sector} className={field}>
          <option value="">Select…</option>
          {(Object.keys(sectorLabels) as Sector[]).map((s) => (
            <option key={s} value={s}>{sectorLabels[s]}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold">
        Product of interest
        <select name="product" defaultValue={product} className={field}>
          <option value="">Not sure yet</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        Message
        <textarea name="message" rows={5} className={field} />
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
}
