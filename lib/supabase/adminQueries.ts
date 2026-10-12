import "server-only";
import { adminClient } from "./admin";

/**
 * Reads for the admin dashboard (includes drafts). Service-role, server-only.
 * Pages that use these live under /admin, which proxy.ts protects.
 */
export async function adminListArticles() {
  const { data } = await adminClient
    .from("articles")
    .select("id, title, slug, is_published, published_at, updated_at, category:categories(name)")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function adminGetArticle(id: string) {
  const { data } = await adminClient.from("articles").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function adminGetSettings() {
  const { data } = await adminClient.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data;
}

export async function adminListCategories() {
  const { data } = await adminClient.from("categories").select("*").order("name");
  return data ?? [];
}

export async function adminListAuthors() {
  const { data } = await adminClient.from("authors").select("*").order("name");
  return data ?? [];
}

export async function adminCounts() {
  const tables = ["articles", "categories", "authors"] as const;
  const entries = await Promise.all(
    tables.map(async (t) => {
      const { count } = await adminClient.from(t).select("*", { count: "exact", head: true });
      return [t, count ?? 0] as const;
    })
  );
  return Object.fromEntries(entries) as Record<(typeof tables)[number], number>;
}
