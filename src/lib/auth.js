import { createClient } from '@supabase/supabase-js';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';

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
  // Cria cliente temporário isolado sem persistência de sessão
  const tempClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

/**
 * Lista todos os membros da equipe cadastrados no Supabase (exclusivo Master)
 */
export async function listarEquipe() {
  const { data, error } = await supabase.rpc('listar_equipe');

  if (error) {
    console.error('Erro ao listar equipe no Supabase:', error);
    throw error;
  }

  return data || [];
}

/**
 * Altera a senha de acesso de qualquer membro da equipe (exclusivo Master)
 */
export async function alterarSenhaConsultor(userId, novaSenha) {
  if (!novaSenha || novaSenha.length < 6) {
    throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
  }

  const { data, error } = await supabase.rpc('admin_alterar_senha', {
    target_user_id: userId,
    nova_senha: novaSenha
  });

  if (error) {
    console.error('Erro ao alterar senha do consultor:', error);
    throw error;
  }

  return data;
}

/**
 * Atualiza o nome de exibição de um consultor (exclusivo Master)
 */
export async function atualizarNomeConsultor(userId, novoNome) {
  const { data, error } = await supabase.rpc('admin_atualizar_consultor', {
    target_user_id: userId,
    novo_nome: novoNome
  });

  if (error) {
    console.error('Erro ao atualizar nome do consultor:', error);
    throw error;
  }

  return data;
}

/**
 * Exclui permanentemente um consultor da equipe (exclusivo Master)
 */
export async function excluirConsultor(userId) {
  const { data, error } = await supabase.rpc('admin_excluir_consultor', {
    target_user_id: userId
  });

  if (error) {
    console.error('Erro ao excluir consultor no Supabase:', error);
    throw error;
  }

  return data;
}
