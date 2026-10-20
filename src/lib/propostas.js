import { supabase } from './supabase.js';
import { isMasterUser } from './auth.js';

/**
 * Lista as propostas salvas no Supabase.
 * - Usuário Master (Alex - gouloalex@gmail.com): visualiza TODAS as propostas de toda a equipe.
 * - Outros consultores: visualizam estritamente APENAS as suas próprias propostas.
 */
export async function listarPropostas(user) {
  let currentUser = user;
  if (!currentUser) {
    const { data: authData } = await supabase.auth.getUser();
    currentUser = authData?.user;
  }

  const isMaster = isMasterUser(currentUser);

  let query = supabase
    .from('propostas')
    .select('*')
    .order('created_at', { ascending: false });

  // Se NÃO for o Master (Alex), filtra estritamente pelo ID do consultor logado
  if (!isMaster) {
    if (currentUser?.id) {
      query = query.eq('user_id', currentUser.id);
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao listar propostas:', error);
    throw error;
  }
  return data || [];
}

/**
 * Busca uma proposta específica pelo ID (usado no link do cliente)
 */
export async function buscarPropostaPorId(id) {
  const { data, error } = await supabase
    .from('propostas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar proposta ${id}:`, error);
    throw error;
  }
  return data;
}

/**
 * Cria uma nova proposta vinculada ao usuário autenticado
 */
export async function criarProposta(proposta, user) {
  let currentUser = user;
  if (!currentUser) {
    const { data: authData } = await supabase.auth.getUser();
    currentUser = authData?.user;
  }

  const payload = {
    user_id: currentUser?.id,
    numero: proposta.numero || `${String(Math.floor(1000 + Math.random() * 9000))}/${new Date().getFullYear()}`,
    cliente_nome: proposta.cliente?.nome || 'Cliente',
    cliente_cidade: proposta.cliente?.cidade || '',
    cliente_telefone: proposta.cliente?.telefone || '',
    valor_investimento: Number(proposta.financeiro?.investimentoTotal) || 0,
    potencia_kwp: Number(proposta.dimensionamento?.potenciaKwp) || 0,
    status: proposta.status || 'enviada',
    dados: proposta
  };

  const { data, error } = await supabase
    .from('propostas')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar proposta:', error);
    throw error;
  }
  return data;
}

/**
 * Atualiza uma proposta existente
 */
export async function atualizarProposta(id, proposta) {
  const payload = {
    numero: proposta.numero,
    cliente_nome: proposta.cliente?.nome,
    cliente_cidade: proposta.cliente?.cidade,
    cliente_telefone: proposta.cliente?.telefone,
    valor_investimento: Number(proposta.financeiro?.investimentoTotal) || 0,
    potencia_kwp: Number(proposta.dimensionamento?.potenciaKwp) || 0,
    status: proposta.status || 'enviada',
    dados: proposta,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('propostas')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar proposta ${id}:`, error);
    throw error;
  }
  return data;
}

/**
 * Exclui uma proposta pelo ID
 */
export async function excluirProposta(id) {
  const { error } = await supabase
    .from('propostas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao excluir proposta ${id}:`, error);
    throw error;
  }
  return true;
}
