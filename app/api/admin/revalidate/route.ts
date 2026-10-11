import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Secret-protected endpoint for EXTERNAL triggers only (e.g. a Supabase webhook).
 * The app's own writes revalidate inline (see lib/revalidate.ts) — they don't call this.
 */
export async function POST(request: NextRequest) {
  if (request.headers.get("x-revalidate-secret") !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { type, slug } = await request.json();
    switch (type) {
      case "article":
        revalidatePath("/blog");
        if (slug) revalidatePath(`/blog/${slug}`);
        revalidatePath("/");
        break;
      case "category":
        revalidatePath("/category");
        if (slug) revalidatePath(`/category/${slug}`);
        revalidatePath("/");
        break;
      default:
        revalidatePath("/");
    }
    return NextResponse.json(
      { revalidated: true, type, slug },
      { headers: { "Cache-Control": "no-store", "Vercel-CDN-Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
