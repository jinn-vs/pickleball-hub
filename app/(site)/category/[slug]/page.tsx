import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getAllCategories, getArticlesByCategory } from "@/lib/supabase/queries";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import PostCard from "@/components/content/PostCard";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return buildMetadata({
    title: `${category.name} — Pickleball`,
    description: category.description ?? `Pickleball articles in ${category.name}.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return notFound();

  const posts = await getArticlesByCategory(slug);

  return (
    <main>
      <section style={{ backgroundColor: "var(--color-navy)" }}>
        <div className="container-site py-12">
          <div className="mb-4">
            <Breadcrumbs
              variant="light"
              items={[
                { name: "Home", path: "/" },
                { name: "Categories", path: "/category" },
                { name: category.name, path: `/category/${slug}` },
              ]}
            />
          </div>
          <h1 className="text-white text-4xl font-black">{category.name}</h1>
          {category.description && <p style={{ color: "#aeb4c0" }} className="mt-2 max-w-2xl">{category.description}</p>}
        </div>
      </section>

      <section className="container-site py-10">
        {posts.length === 0 ? (
          <p className="text-muted text-sm">No articles in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </main>
  );
}
