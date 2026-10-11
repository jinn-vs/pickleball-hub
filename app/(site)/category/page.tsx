import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories } from "@/lib/supabase/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Browse Categories",
  description: "Browse pickleball content by category — technique, rules, tournaments and more.",
  path: "/category",
});

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <h1 className="text-white text-4xl font-black">Categories</h1>
        </div>
      </section>
      <section className="container-site py-10">
        {categories.length === 0 ? (
          <p className="text-muted text-sm">No categories yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} style={{ border: "1px solid #e9ecef" }} className="rounded p-5 hover:shadow-sm transition-shadow block">
                <h2 className="text-navy font-black">{c.name}</h2>
                {c.description && <p className="text-muted text-sm mt-2 clamp-3">{c.description}</p>}
                <span className="text-green text-xs font-bold uppercase mt-3 inline-block" style={{ fontFamily: "var(--font-display)" }}>Explore →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
