import Link from "next/link";
import { adminCounts } from "@/lib/supabase/adminQueries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const counts = await adminCounts();
  const cards = [
    { label: "Articles", value: counts.articles, href: "/admin/dashboard/articles" },
    { label: "Categories", value: counts.categories, href: "/admin/dashboard/categories" },
    { label: "Authors", value: counts.authors, href: "/admin/dashboard/authors" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-black">Dashboard</h1>
        <Link href="/admin/dashboard/articles/new" className="btn btn-primary">+ New Article</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }} className="rounded-lg p-5 hover:border-green transition-colors">
            <p style={{ color: "#6b7280" }} className="text-xs uppercase tracking-wide">{c.label}</p>
            <p className="text-white text-3xl font-black mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
