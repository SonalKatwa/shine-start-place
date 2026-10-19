import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | undefined;

export function getSupabase() {
  if (supabase) return supabase;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in the Vercel project settings.");
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}
