import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing!', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseAnonKey 
  });
}

// Provide dummy strings for local development if env vars are missing
// This prevents the "supabaseUrl is required" crash in the dev server
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder';

export const supabase = createClient(
  supabaseUrl || dummyUrl,
  supabaseAnonKey || dummyKey,
  {
    auth: { persistSession: false }
  }
);

