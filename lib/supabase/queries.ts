import { db } from "./db";
import type { ArticleWithRelations, Category } from "./types";

/*
  All reads go through the anon client (RLS-protected) and are fully null-safe:
  any DB/network error logs and returns a safe fallback instead of throwing a 500.
  This also keeps `next build` resilient when the DB is unreachable.
*/
async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (e) {
    console.error(`${label}:`, (e as Error).message);
    return fallback;
  }
}

// ───────── Categories ─────────
export function getAllCategories(): Promise<Category[]> {
  return safe("getAllCategories", async () => {
    const { data, error } = await db().from("categories").select("*").order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  }, []);
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return safe("getCategoryBySlug", async () => {
    const { data, error } = await db().from("categories").select("*").eq("slug", slug).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  }, null);
}

// ───────── Articles ─────────
const ARTICLE_SELECT = `
  *,
  author:authors(id, name, slug, photo_url, bio),
  category:categories(id, name, slug)
`;

export function getAllArticles(): Promise<ArticleWithRelations[]> {
  return safe("getAllArticles", async () => {
    const { data, error } = await db()
      .from("articles").select(ARTICLE_SELECT)
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ArticleWithRelations[];
  }, []);
}

export function getLatestArticles(limit = 6): Promise<ArticleWithRelations[]> {
  return safe("getLatestArticles", async () => {
    const { data, error } = await db()
      .from("articles").select(ARTICLE_SELECT)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ArticleWithRelations[];
  }, []);
}

export function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  return safe("getArticleBySlug", async () => {
    const { data, error } = await db()
      .from("articles").select(ARTICLE_SELECT)
      .eq("slug", slug).eq("is_published", true).maybeSingle();
    if (error) throw new Error(error.message);
    return data as unknown as ArticleWithRelations | null;
  }, null);
}

export function getArticlesByCategory(categorySlug: string): Promise<ArticleWithRelations[]> {
  return safe("getArticlesByCategory", async () => {
    // !inner makes the category filter apply to the parent rows (PostgREST gotcha fix)
    const { data, error } = await db()
      .from("articles")
      .select(`*, author:authors(id, name, slug, photo_url), category:categories!inner(id, name, slug)`)
      .eq("category.slug", categorySlug)
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ArticleWithRelations[];
  }, []);
}

export function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  return safe("getAllArticleSlugs", async () => {
    const { data, error } = await db().from("articles").select("slug").eq("is_published", true);
    if (error) throw new Error(error.message);
    return data ?? [];
  }, []);
}
