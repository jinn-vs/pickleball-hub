import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Public READ client for pages & sitemap.
 * Plain anon client (no cookies) so read pages stay fully static / ISR —
 * reading cookies would force dynamic rendering. RLS (anon role) still applies.
 */
export const db = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon",
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
