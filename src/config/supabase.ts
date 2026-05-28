import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Supabase client untuk operasi publik (menggunakan anon key)
export const supabase = createClient(env.supabase.url, env.supabase.anonKey);

// Supabase admin client untuk operasi server-side (menggunakan service role key)
// Jangan expose ke client-side!
export const supabaseAdmin = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
