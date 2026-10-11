import type { Metadata } from "next";
import { getAllArticles } from "@/lib/supabase/queries";
import { buildMetadata } from "@/lib/seo";
import PostCard from "@/components/content/PostCard";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Pickleball News & Guides",
  description: "The latest pickleball news, drills, rules and how-to guides.",
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = await getAllArticles();

  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <h1 className="text-white text-4xl font-black">News & Guides</h1>
          <p style={{ color: "#aeb4c0" }} className="mt-2">Everything happening on and off the pickleball court.</p>
        </div>
      </section>

      <section className="container-site py-10">
        {posts.length === 0 ? (
          <p className="text-muted text-sm">No articles published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </main>
  );
}
