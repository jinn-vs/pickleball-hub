import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { articleSchema } from "@/lib/validation";
import { revalidateArticle } from "@/lib/revalidate";
import type { Database } from "@/lib/supabase/types";

type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const { data, error } = await adminClient
    .from("articles")
    .insert({
      ...input,
      published_at: input.is_published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateArticle(data.slug);
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await request.json();
  const { id, ...rest } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const parsed = articleSchema.partial().safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates: ArticleUpdate = { ...parsed.data };
  // set published_at when flipping to published and it wasn't set before
  if (parsed.data.is_published === true && !updates.published_at) {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await adminClient
    .from("articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateArticle(data.slug);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const { id, slug } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await adminClient.from("articles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateArticle(slug);
  return NextResponse.json({ success: true });
}
