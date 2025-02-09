import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

let supabaseClient: SupabaseClient;

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };

  supabaseClient = createClient(supabaseUrl, supabaseKey, options);
  return supabaseClient;
};
