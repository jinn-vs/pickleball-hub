import { notFound } from "next/navigation";
import { adminGetArticle, adminListCategories, adminListAuthors } from "@/lib/supabase/adminQueries";
import ArticleForm, { type ArticleFormData } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories, authors] = await Promise.all([
    adminGetArticle(id),
    adminListCategories(),
    adminListAuthors(),
  ]);
  if (!article) return notFound();

  const initial: ArticleFormData = {
    id: article.id,
    title: article.title ?? "",
    slug: article.slug ?? "",
    excerpt: article.excerpt ?? "",
    body: article.body ?? "",
    section: article.section ?? "",
    author_id: article.author_id ?? "",
    category_id: article.category_id ?? "",
    featured_image_url: article.featured_image_url ?? "",
    tags: article.tags ?? [],
    faqs: Array.isArray(article.faqs) ? (article.faqs as { question: string; answer: string }[]) : [],
    seo_title: article.seo_title ?? "",
    seo_description: article.seo_description ?? "",
    seo_keywords: article.seo_keywords ?? "",
    is_published: !!article.is_published,
  };

  return (
    <div>
      <h1 className="text-white text-2xl font-black mb-6">Edit Article</h1>
      <ArticleForm mode="edit" initial={initial} categories={categories} authors={authors} />
    </div>
  );
}
