"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const nav = [
  { href: "/products/", label: "Products" },
  { href: "/solutions/", label: "Solutions" },
  { href: "/innovation/", label: "Innovation" },
  { href: "/support/", label: "Service & Support" },
  { href: "/about/", label: "About" },
  { href: "/news/", label: "News" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-ink text-[0.78rem] text-white/80">
        <div className="container-page flex h-9 items-center justify-between">
          <span className="truncate">Serving research, public health and clinical laboratories in 60+ countries</span>
          <div className="hidden gap-5 sm:flex">
            <Link href="/portal/" className="font-semibold text-teal hover:text-white">Customer portal</Link>
            <Link href="/about/#investors" className="hover:text-white">Investors</Link>
            <Link href="/about/#careers" className="hover:text-white">Careers</Link>
            <Link href="/contact/" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-7 text-[0.95rem] font-medium">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-2 transition-colors hover:text-plum ${active ? "text-plum" : "text-ink"}`}
                  >
                    {item.label}
                    {active && <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-plum" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden lg:block">
          <Link href="/contact/?topic=quote" className="btn btn-primary !py-2.5 text-sm">
            Request a quote
          </Link>
        </div>
        <button
          className="lg:hidden rounded-md p-2 text-ink"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-line bg-white" aria-label="Mobile">
          <ul className="container-page py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 text-lg font-medium">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/portal/" onClick={() => setOpen(false)} className="block py-3 text-lg font-medium text-plum">
                Customer portal
              </Link>
            </li>
            <li className="pt-2 pb-3">
              <Link href="/contact/?topic=quote" onClick={() => setOpen(false)} className="btn btn-primary">
                Request a quote
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
