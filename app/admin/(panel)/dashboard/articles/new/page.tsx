import { adminListCategories, adminListAuthors } from "@/lib/supabase/adminQueries";
import ArticleForm, { type ArticleFormData } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

const empty: ArticleFormData = {
  title: "", slug: "", excerpt: "", body: "", section: "",
  author_id: "", category_id: "", featured_image_url: "",
  tags: [], faqs: [], seo_title: "", seo_description: "", seo_keywords: "",
  is_published: false,
};

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([adminListCategories(), adminListAuthors()]);
  return (
    <div>
      <h1 className="text-white text-2xl font-black mb-6">New Article</h1>
      <ArticleForm mode="new" initial={empty} categories={categories} authors={authors} />
    </div>
  );
}
