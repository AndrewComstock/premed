import Link from "next/link";
import { Logo } from "./Logo";
import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="bg-ink text-white/75">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Instruments, software and services that help universities, government laboratories and hospitals turn
            questions into answers.
          </p>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-white">Products</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products/?category=${c.id}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-white">Solutions</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/solutions/#academic" className="hover:text-white">Academic & Research</Link></li>
            <li><Link href="/solutions/#government" className="hover:text-white">Government</Link></li>
            <li><Link href="/solutions/#healthcare" className="hover:text-white">Hospitals</Link></li>
            <li><Link href="/solutions/#biopharma" className="hover:text-white">Biopharma</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about/" className="hover:text-white">About Halcyra</Link></li>
            <li><Link href="/innovation/" className="hover:text-white">Innovation</Link></li>
            <li><Link href="/news/" className="hover:text-white">Newsroom</Link></li>
            <li><Link href="/support/" className="hover:text-white">Service & Support</Link></li>
            <li><Link href="/contact/" className="hover:text-white">Contact us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Halcyra Life Sciences. A fictional company created for demonstration purposes.</p>
          <p>All products, data and people on this site are invented. Not for diagnostic or clinical use.</p>
        </div>
      </div>
    </footer>
  );
}
