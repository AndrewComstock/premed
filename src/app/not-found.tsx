import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-extrabold">Page not found</h1>
      <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
    </section>
  );
}
