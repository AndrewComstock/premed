"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { sectorLabels } from "@/lib/products";
import { roleLabels } from "@/lib/portal";
import { PortalProvider, usePortal } from "./PortalSession";

const portalNav = [
  { href: "/portal/", label: "Overview" },
  { href: "/portal/orders/", label: "Orders" },
  { href: "/portal/inventory/", label: "Inventory" },
  { href: "/portal/deliveries/", label: "Deliveries" },
  { href: "/portal/promotions/", label: "Promotions" },
  { href: "/portal/ask/", label: "Ask about products" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <Gate>{children}</Gate>
    </PortalProvider>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, session, signOut } = usePortal();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const onLogin = pathname.startsWith("/portal/login");

  useEffect(() => {
    if (!ready) return;
    if (!session && !onLogin) router.replace("/portal/login/");
    if (session && onLogin) router.replace("/portal/");
  }, [ready, session, onLogin, router]);

  if (onLogin) return <>{children}</>;

  if (!ready || !session) {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center text-sm text-ink-soft">
        Loading your portal…
      </div>
    );
  }

  const { account, user } = session;

  return (
    <div className="bg-sand">
      <div className="hero-gradient text-white">
        <div className="container-page flex flex-col gap-4 py-7 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">
              Customer portal · {sectorLabels[account.sector]}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{account.name}</h1>
            <p className="mt-1 text-sm text-white/70">
              Account {account.accountNumber} · {account.city}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm md:text-right">
              <p className="font-semibold">{user.name}</p>
              <p className="text-white/70">{roleLabels[user.role]}</p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.replace("/portal/login/");
              }}
              className="btn btn-outline !py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Portal" className="container-page -mb-px overflow-x-auto">
          <ul className="flex gap-1 text-sm font-medium">
            {portalNav.map((item) => {
              const active = item.href === "/portal/" ? pathname === "/portal/" || pathname === "/portal" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block whitespace-nowrap rounded-t-lg px-4 py-3 transition-colors ${
                      active ? "bg-sand text-ink" : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="container-page py-10">{children}</div>
    </div>
  );
}
