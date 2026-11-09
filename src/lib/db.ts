import {createClient} from "@supabase/supabase-js";
export const ready=!!process.env.NEXT_PUBLIC_SUPABASE_URL&&!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||"https://example.supabase.co",process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"placeholder");