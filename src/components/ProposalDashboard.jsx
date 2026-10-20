import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  Edit3,
  FileText,
  LogOut,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  UserPlus,
  Crown,
  MapPin,
  Phone
} from 'lucide-react';
import Logo from './Logo';
import { listarPropostas, excluirProposta } from '../lib/propostas';
import { isMasterUser } from '../lib/auth';
import ProposalFormModal from './ProposalFormModal';
import UserCreateModal from './UserCreateModal';

export default function ProposalDashboard({ user, onLogout, onViewProposal, onBackToSite }) {
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProposta, setEditingProposta] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');

  const isMaster = isMasterUser(user);

  const carregar = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarPropostas(user);
      setPropostas(data);
    } catch (err) {
      console.error('Erro ao carregar propostas:', err);
      setError('Erro ao conectar com o Supabase. Verifique se executou o script SQL das tabelas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [user?.id]);

  const handleCopyLink = (id) => {
    const origin = window.location.origin;
    const url = `${origin}/#proposta?id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDelete = async (id, clienteNome) => {
    if (!window.confirm(`Tem certeza que deseja excluir a proposta de "${clienteNome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await excluirProposta(id);
      setPropostas((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Erro ao excluir proposta: ${err.message}`);
    }
  };

  // Filtragem por busca
  const filtered = propostas.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nome = (p.cliente_nome || '').toLowerCase();
    const cidade = (p.cliente_cidade || '').toLowerCase();
    const num = (p.numero || '').toLowerCase();
    return nome.includes(term) || cidade.includes(term) || num.includes(term);
  });

  // Métricas
  const totalInvestimento = propostas.reduce((acc, curr) => acc + (Number(curr.valor_investimento) || 0), 0);
  const totalKwp = propostas.reduce((acc, curr) => acc + (Number(curr.potencia_kwp) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navbar do Dashboard (Otimizado Mobile e Desktop) */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToSite}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition shrink-0"
              title="Voltar ao Site"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar ao Site</span>
            </button>
            <div className="h-5 w-px bg-slate-800 hidden xs:block" />
            <Logo isDark={true} className="h-7 sm:h-8" />
            <span className="hidden md:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
              {isMaster && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isMaster ? 'Master Admin' : 'Painel do Consultor'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                {isMaster && <span className="text-amber-400 font-bold">Master:</span>}
                <span>Logado como:</span>
              </span>
              <strong className="text-xs text-white truncate max-w-[180px]">{user?.email}</strong>
            </div>

            {/* Botão exclusivo do Master para criar novos consultores */}
            {isMaster && (
              <button
                onClick={() => setShowUserModal(true)}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-400/40 text-xs font-bold p-2 sm:px-3 sm:py-2 rounded-xl transition shadow-sm"
                title="Cadastrar Novo Consultor na equipe UseSol"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Novo Consultor</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingProposta(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-1 bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-amber-500/20 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Proposta</span>
              <span className="sm:hidden">Proposta</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 border border-slate-800 transition shrink-0"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 py-5 sm:py-8 space-y-4 sm:space-y-6">
        
        {/* Banner de Resumo (Compacto no mobile: 3 colunas elegantes) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Propostas</span>
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-3xl font-black text-white">{propostas.length}</div>
            <span className="hidden sm:block text-[11px] text-slate-500 mt-1">Salvas na nuvem</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Potência</span>
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-3xl font-black text-white">
              {totalKwp.toFixed(1)} <span className="text-xs sm:text-sm font-semibold text-amber-400">kWp</span>
            </div>
            <span className="hidden sm:block text-[11px] text-slate-500 mt-1">Total em projetos</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">Negociação</span>
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            </div>
            <div className="text-sm sm:text-2xl font-black text-emerald-400 truncate">
              {totalInvestimento >= 1000000
                ? `R$ ${(totalInvestimento / 1000000).toFixed(1)}M`
                : totalInvestimento >= 1000
                ? `R$ ${(totalInvestimento / 1000).toFixed(1)}k`
                : `R$ ${totalInvestimento.toFixed(0)}`}
            </div>
            <span className="hidden sm:block text-[11px] text-slate-500 mt-1">Volume total</span>
          </div>

        </div>

        {/* Barra de Busca */}
        <div className="flex items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente, cidade ou proposta..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 outline-none"
            />
          </div>
          <span className="text-[11px] sm:text-xs text-slate-400 px-1 shrink-0 font-medium">
            {filtered.length} {filtered.length === 1 ? 'proposta' : 'propostas'}
          </span>
        </div>

        {/* Mensagem de Erro / Aviso de Script SQL */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Banco de Dados Conectado!</strong>
              <span>
                Se esta é a primeira execução, certifique-se de executar o script SQL de criação da tabela <code>propostas</code> no SQL Editor do seu Supabase Dashboard.
              </span>
            </div>
          </div>
        )}

        {/* Listagem de Propostas */}
        {loading ? (
          <div className="text-center py-16">
            <span className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin inline-block mb-3" />
            <p className="text-xs text-slate-400">Carregando propostas do Supabase...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Nenhuma proposta encontrada</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              {searchTerm
                ? 'Nenhum resultado corresponde à sua busca.'
                : 'Comece criando a primeira proposta orçamentária para seus leads.'}
            </p>
            <button
              onClick={() => {
                setEditingProposta(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-1.5 bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeira Proposta</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. VISUALIZAÇÃO EM CARDS MOBILE (Até telas 'md') */}
            <div className="md:hidden space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  {/* Topo do Card Mobile: Nº da Proposta e Data */}
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                      #{item.numero || 'S/N'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Informações do Cliente */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white leading-snug">{item.cliente_nome}</h4>
                      {isMaster && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded shrink-0">
                          {item.user_id === user?.id ? 'Minha' : 'Equipe'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                      {item.cliente_cidade && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.cliente_cidade}</span>
                        </span>
                      )}
                      {item.cliente_telefone && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{item.cliente_telefone}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Métricas Técnicas e Financeiras em Destaque */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Potência</span>
                      <strong className="text-white font-bold text-sm">
                        {item.potencia_kwp ? `${item.potencia_kwp} kWp` : '—'}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Investimento</span>
                      <strong className="text-emerald-400 font-black text-sm">
                        {item.valor_investimento
                          ? `R$ ${Number(item.valor_investimento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : '—'}
                      </strong>
                    </div>
                  </div>

                  {/* Barra de Ações Touch-Friendly para Mobile */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onViewProposal(item)}
                      className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver PDF</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(item.id)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition active:scale-95"
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Link Zap</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingProposta(item);
                        setShowModal(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition active:scale-95"
                      title="Editar Proposta"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.cliente_nome)}
                      className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition active:scale-95"
                      title="Excluir Proposta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. VISUALIZAÇÃO EM TABELA TRADICIONAL (Desktop a partir de 'md') */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Proposta</th>
                      <th className="py-3.5 px-4">Cliente</th>
                      <th className="py-3.5 px-4">Cidade</th>
                      <th className="py-3.5 px-4">Potência</th>
                      <th className="py-3.5 px-4">Investimento</th>
                      <th className="py-3.5 px-4">Data</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition group">
                        
                        {/* Número Proposta */}
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {item.numero || 'S/N'}
                        </td>

                        {/* Nome do Cliente */}
                        <td className="py-3 px-4">
                          <strong className="text-white text-xs block font-bold">{item.cliente_nome}</strong>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.cliente_telefone && (
                              <span className="text-[11px] text-slate-500">{item.cliente_telefone}</span>
                            )}
                            {isMaster && (
                              <span className="text-[9px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                {item.user_id === user?.id ? 'Minha' : 'Equipe'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Cidade */}
                        <td className="py-3 px-4 text-slate-300">
                          {item.cliente_cidade || '—'}
                        </td>

                        {/* Potência */}
                        <td className="py-3 px-4 font-semibold text-slate-200">
                          {item.potencia_kwp ? `${item.potencia_kwp} kWp` : '—'}
                        </td>

                        {/* Investimento */}
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {item.valor_investimento
                            ? `R$ ${Number(item.valor_investimento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : '—'}
                        </td>

                        {/* Data */}
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </td>

                        {/* Ações */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Copiar Link do Cliente */}
                            <button
                              onClick={() => handleCopyLink(item.id)}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                              title="Copiar link para enviar ao cliente no WhatsApp"
                            >
                              {copiedId === item.id ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* Visualizar Proposta */}
                            <button
                              onClick={() => onViewProposal(item)}
                              className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 transition flex items-center gap-1 font-semibold"
                              title="Visualizar Proposta Completa & Exportar PDF"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="hidden sm:inline text-[11px]">Ver PDF</span>
                            </button>

                            {/* Editar Proposta */}
                            <button
                              onClick={() => {
                                setEditingProposta(item);
                                setShowModal(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Editar Dados da Proposta"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Excluir Proposta */}
                            <button
                              onClick={() => handleDelete(item.id, item.cliente_nome)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Excluir Proposta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Modal de Formulário */}
      {showModal && (
        <ProposalFormModal
          initialData={editingProposta}
          onClose={() => {
            setShowModal(false);
            setEditingProposta(null);
          }}
          onSaved={() => {
            setShowModal(false);
            setEditingProposta(null);
            carregar();
          }}
        />
      )}

      {/* Modal de Criação de Novo Consultor (Exclusivo Master) */}
      {showUserModal && (
        <UserCreateModal
          onClose={() => setShowUserModal(false)}
          onUserCreated={() => {
            // Recarrega caso necessário
          }}
        />
      )}

    </div>
  );
}
