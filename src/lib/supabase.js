import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://jprqerjltonaxrharsli.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcnFlcmpsdG9uYXhyaGFyc2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NTk4MTAsImV4cCI6MjEwODAzNTgxMH0.Bn9_TZBNTW8KzJZixrDql0LBjurpJeISPFVM1iO2g5Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

