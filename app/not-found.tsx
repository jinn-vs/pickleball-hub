import Link from "next/link";
import { SITE } from "@/site.config";

export default function NotFound() {
  return (
    <main className="container-site py-24 text-center">
      <p className="text-green text-sm font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>404</p>
      <h1 className="text-navy text-3xl font-black mt-2">Page not found</h1>
      <p className="text-muted mt-2">That page doesn&apos;t exist on {SITE.name}.</p>
      <Link href="/" className="btn btn-primary mt-6">Back home</Link>
    </main>
  );
}
