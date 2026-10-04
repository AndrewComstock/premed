"use client";

import Link from "next/link";
import { useState } from "react";
import { usePortal } from "@/components/portal/PortalSession";

const features = [
  { title: "Orders", body: "Status, line items and PO numbers for every order." },
  { title: "Inventory", body: "Installed instruments, service dates and reagent stock." },
  { title: "Deliveries", body: "Live tracking, including cold-chain shipments." },
  { title: "Promotions", body: "Your contract pricing and current offers." },
];

export function LoginView() {
  const { signIn, error: apiError } = usePortal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = await signIn(email, password);
    setBusy(false);
    if (err) {
      setError(err);
      setPassword("");
    }
    // On success PortalShell sees the session and redirects to the overview.
  }

  const shown = error || apiError;

  return (
    <section className="hero-gradient text-white">
      <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Customer portal</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight">Sign in to your account</h1>
          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-white p-6 text-ink shadow-2xl shadow-black/20">
            <label className="block text-sm font-semibold">
              Work email
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 font-normal outline-none focus:border-plum focus:ring-2 focus:ring-plum/20"
                placeholder="name@institution.edu"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 font-normal outline-none focus:border-plum focus:ring-2 focus:ring-plum/20"
              />
            </label>
            {shown && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {shown}
              </p>
            )}
            <button type="submit" disabled={busy} className="btn btn-primary w-full justify-center disabled:opacity-60">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-sm text-white/70">
            Need access for your institution?{" "}
            <Link href="/contact/" className="font-semibold text-white underline underline-offset-4">
              Contact your account manager
            </Link>
          </p>
        </div>

        <div className="lg:pl-8">
          <h2 className="text-2xl font-bold">Everything your lab buys from Halcyra, in one place</h2>
          <p className="mt-3 max-w-xl text-white/80">
            Hospitals, universities and government laboratories use the portal to keep instruments running and
            reagents on the shelf. Clinical teams will soon be able to ask questions about the products they use.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
                <p className="font-bold">{f.title}</p>
                <p className="mt-1 text-sm text-white/70">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
