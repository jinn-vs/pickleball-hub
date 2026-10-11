import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  const email = user.email?.toLowerCase() ?? "";
  return ADMIN_EMAILS.includes(email) || user.app_metadata?.role === "admin";
}

/** Returns the User if admin, otherwise a ready-to-return 401/403 response. */
export async function requireAdmin(): Promise<User | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return user;
}
