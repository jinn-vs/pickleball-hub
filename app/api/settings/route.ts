import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { settingsSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await adminClient
    .from("site_settings")
    .upsert({ id: 1, ...parsed.data })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Hero/settings show on the home page (and header logo) → revalidate.
  revalidatePath("/");
  return NextResponse.json(data);
}
