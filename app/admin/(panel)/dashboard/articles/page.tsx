import Link from "next/link";
import { adminListArticles } from "@/lib/supabase/adminQueries";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ArticlesListPage() {
  const articles = await adminListArticles();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-black">Articles</h1>
        <Link href="/admin/dashboard/articles/new" className="btn btn-primary">+ New Article</Link>
      </div>

      {articles.length === 0 ? (
        <p style={{ color: "#6b7280" }} className="text-sm">No articles yet. Create your first one.</p>
      ) : (
        <div style={{ border: "1px solid #1f2937", borderRadius: 8, overflow: "hidden" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#111827", color: "#6b7280" }} className="text-left text-xs uppercase">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} style={{ borderTop: "1px solid #1f2937" }}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/dashboard/articles/${a.id}`} className="text-white font-semibold hover:text-green">{a.title}</Link>
                    <span style={{ color: "#6b7280" }} className="block text-xs">/blog/{a.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ backgroundColor: a.is_published ? "#14532d" : "#374151", color: a.is_published ? "#86efac" : "#9ca3af" }} className="text-xs px-2 py-1 rounded">
                      {a.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#9ca3af" }}>
                    {a.updated_at ? new Date(a.updated_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/dashboard/articles/${a.id}`} className="text-green text-xs font-semibold mr-4">Edit</Link>
                    <DeleteButton id={a.id} slug={a.slug} endpoint="/api/articles" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
