import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * SERVICE-ROLE client. Bypasses RLS.
 * USE ONLY inside authenticated /api write routes — never in a page or a client component.
 */
export const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
