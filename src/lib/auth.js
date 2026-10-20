import { createClient } from '@supabase/supabase-js';

export const MASTER_EMAILS = [
  'gouloalex@gmail.com'
];

/**
 * Verifica se o usuário atual é Master (administrador geral)
 */
export function isMasterUser(user) {
  if (!user?.email) return false;
  return MASTER_EMAILS.includes(user.email.toLowerCase().trim());
}

/**
 * Permite ao Master cadastrar novos consultores sem deslogar da sua sessão atual
 */
export async function cadastrarNovoConsultor({ email, password, nome }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Cria cliente temporário isolado sem persistência de sessão
  const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await tempClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome: nome || '',
        created_at: new Date().toISOString()
      }
    }
  });

  if (error) {
    console.error('Erro ao cadastrar novo consultor:', error);
    throw error;
  }

  return data.user;
}
