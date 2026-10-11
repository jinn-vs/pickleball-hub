import { revalidatePath } from "next/cache";

/**
 * Revalidate the right paths after a write — called INLINE inside API routes
 * (no self-HTTP round-trip), so the CDN always updates reliably.
 */
export function revalidateArticle(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export function revalidateCategory(slug?: string) {
  revalidatePath("/");
  revalidatePath("/category");
  if (slug) revalidatePath(`/category/${slug}`);
}
