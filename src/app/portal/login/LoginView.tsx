"use client";

import Link from "next/link";
import { useState } from "react";
import { usePortal } from "@/components/portal/PortalSession";
import { accounts, DEMO_PASSWORD, findUserByEmail, roleLabels } from "@/lib/portal";
import { sectorLabels } from "@/lib/products";

export function LoginView() {
  const { signIn } = usePortal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const match = findUserByEmail(email);
    if (!match || password !== DEMO_PASSWORD) {
      setError("That email and password don't match a demo account. Use one of the accounts on the right.");
      return;
    }
    signIn(match.account.id, match.user.id);
  }

  return (
    <section className="hero-gradient text-white">
      <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Customer portal</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight">Sign in to your account</h1>
          <p className="mt-4 text-white/80">
            Track orders and deliveries, check instrument and consumable inventory, see your contract pricing and
            promotions, and give your clinical teams answers about the products they use.
          </p>
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
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button type="submit" className="btn btn-primary w-full justify-center">
              Sign in
            </button>
            <p className="text-xs text-ink-soft">
              Demo only: no real authentication. Every demo user&apos;s password is{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 font-mono">{DEMO_PASSWORD}</code>.
            </p>
          </form>
          <p className="mt-6 text-sm text-white/70">
            Need access for your institution?{" "}
            <Link href="/contact/" className="font-semibold text-white underline underline-offset-4">
              Contact your account manager
            </Link>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold">Demo accounts</h2>
          <p className="mt-1 text-sm text-white/70">Pick anyone to sign in as them. Each institution sees its own data.</p>
          <div className="mt-6 space-y-5">
            {accounts.map((account) => (
              <div key={account.id} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-bold">{account.name}</h3>
                  <span className="rounded-full bg-teal/20 px-2.5 py-0.5 text-xs font-semibold text-teal">
                    {sectorLabels[account.sector]}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {account.users.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => signIn(account.id, user.id)}
                        className="w-full rounded-xl bg-white/10 px-4 py-3 text-left transition hover:bg-white/20"
                      >
                        <span className="block text-sm font-semibold">{user.name}</span>
                        <span className="block text-xs text-white/70">
                          {roleLabels[user.role]} · {user.email}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
