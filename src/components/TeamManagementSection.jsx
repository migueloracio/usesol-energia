import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  KeyRound,
  Trash2,
  Edit2,
  Check,
  Copy,
  AlertTriangle,
  Search,
  RefreshCw,
  Crown,
  Briefcase,
  Calendar,
  FileText,
  Mail,
  Eye,
  EyeOff,
  Code,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  listarEquipe,
  alterarSenhaConsultor,
  atualizarNomeConsultor,
  excluirConsultor
} from '../lib/auth';
import { EQUIPE_SQL_SCRIPT } from '../lib/equipeSql';

export default function TeamManagementSection({
  user,
  onOpenCreateUser,
  onUserChanged
}) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [passwordModalMember, setPasswordModalMember] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const [deleteModalMember, setDeleteModalMember] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [editNameMember, setEditNameMember] = useState(null);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const carregarEquipe = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarEquipe();
      setMembers(data);
    } catch (err) {
      console.error('Erro ao carregar equipe:', err);
      const msg = err.message || '';
      if (
        msg.includes('Could not find the function') ||
        msg.includes('schema cache') ||
        msg.includes('PGRST202')
      ) {
        setError('FUNCTIONS_NOT_INSTALLED');
      } else {
        setError(msg || 'Erro ao carregar membros da equipe.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEquipe();
  }, []);

  // Gerar senha forte aleatória
  const gerarSenhaForte = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let senha = 'Sol@';
    for (let i = 0; i < 6; i++) {
      senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(senha);
  };

  // Salvar nova senha
  const handleSalvarSenha = async (e) => {
    e.preventDefault();
    if (!passwordModalMember || !newPassword) return;

    if (newPassword.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setSavingPassword(true);
    try {
      await alterarSenhaConsultor(passwordModalMember.id, newPassword);
      setPasswordSuccess(true);
    } catch (err) {
      alert(`Erro ao alterar senha: ${err.message}`);
    } finally {
      setSavingPassword(false);
    }
  };

  // Copiar dados de acesso formatados para WhatsApp
  const handleCopiarMensagemAcesso = () => {
    if (!passwordModalMember) return;
    const msg = `☀️ *UseSol Energia - Dados de Acesso ao Painel*

Olá *${passwordModalMember.nome}*,
Sua senha de acesso ao Painel de Propostas foi atualizada com sucesso!

📧 *Login:* ${passwordModalMember.email}
🔑 *Nova Senha:* ${newPassword}

👉 Acesse em: https://usesolenergia.com/#painel`;

    navigator.clipboard.writeText(msg);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  // Excluir membro da equipe
  const handleConfirmarExclusao = async () => {
    if (!deleteModalMember) return;
    setDeleting(true);
    try {
      await excluirConsultor(deleteModalMember.id);
      setDeleteModalMember(null);
      await carregarEquipe();
      if (onUserChanged) onUserChanged();
    } catch (err) {
      alert(`Erro ao excluir consultor: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Salvar novo nome
  const handleSalvarNome = async (e) => {
    e.preventDefault();
    if (!editNameMember || !newName.trim()) return;

    setSavingName(true);
    try {
      await atualizarNomeConsultor(editNameMember.id, newName.trim());
      setEditNameMember(null);
      await carregarEquipe();
    } catch (err) {
      alert(`Erro ao atualizar nome: ${err.message}`);
    } finally {
      setSavingName(false);
    }
  };

  // Copiar Script SQL do Supabase
  const handleCopiarSql = () => {
    navigator.clipboard.writeText(EQUIPE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Filtragem de busca
  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    const nome = (m.nome || '').toLowerCase();
    const email = (m.email || '').toLowerCase();
    return nome.includes(term) || email.includes(term);
  });

  const totalMembros = members.length;
  const totalPropostasEquipe = members.reduce(
    (acc, m) => acc + (Number(m.total_propostas) || 0),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner de Resumo da Equipe */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total da Equipe
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? '...' : totalMembros}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Consultores cadastrados
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Acesso Master
            </span>
            <div className="text-sm sm:text-base font-bold text-amber-400 truncate max-w-[170px]">
              Alex (Master)
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block truncate max-w-[170px]">
              {user?.email}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Propostas da Equipe
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {loading ? '...' : totalPropostasEquipe}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Propostas no sistema
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Barra de Ações: Busca, Botão Novo Consultor e Script SQL */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar consultor por nome ou e-mail..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={carregarEquipe}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Recarregar Equipe"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-semibold transition"
            title="Ver Script SQL de Configuração"
          >
            <Code className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Script SQL</span>
          </button>

          <button
            onClick={onOpenCreateUser}
            className="inline-flex items-center justify-center gap-1.5 bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Consultor</span>
          </button>
        </div>

      </div>

      {/* Alerta de Instalação de Funções SQL caso ainda não tenham sido criadas */}
      {error === 'FUNCTIONS_NOT_INSTALLED' && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-200 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Code className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-0.5">
                Ativação da Gestão de Equipe no Supabase
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para que o Master consiga listar a equipe, trocar senhas e excluir colaboradores, execute o script SQL de segurança uma única vez no seu painel Supabase.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopiarSql}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Script SQL Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Script SQL</span>
                </>
              )}
            </button>

            <a
              href="https://supabase.com/dashboard/project/jprqerjltonaxrharsli/sql/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir SQL Editor do Supabase</span>
            </a>

            <button
              onClick={carregarEquipe}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Já executei, testar agora</span>
            </button>
          </div>
        </div>
      )}

      {/* Lista de Membros da Equipe */}
      {loading ? (
        <div className="text-center py-16">
          <span className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin inline-block mb-3" />
          <p className="text-xs text-slate-400">Carregando consultores da equipe...</p>
        </div>
      ) : error && error !== 'FUNCTIONS_NOT_INSTALLED' ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={carregarEquipe}
            className="text-white underline font-semibold hover:text-amber-400"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nenhum consultor encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {searchTerm
              ? 'Nenhum membro corresponde ao termo pesquisado.'
              : 'Cadastre o primeiro consultor para liberar o acesso ao painel de propostas.'}
          </p>
          <button
            onClick={onOpenCreateUser}
            className="inline-flex items-center gap-1.5 bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Consultor</span>
          </button>
        </div>
      ) : (
        <>
          {/* 1. VISUALIZAÇÃO EM CARDS (Mobile até 'md') */}
          <div className="md:hidden space-y-3">
            {filteredMembers.map((member) => {
              const isUserMaster = member.email?.toLowerCase().trim() === 'gouloalex@gmail.com';
              const isCurrentUser = member.id === user?.id;

              return (
                <div
                  key={member.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm">
                        {(member.nome || member.email || 'U').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {member.nome || 'Consultor'}
                          </h4>
                          {isCurrentUser && (
                            <span className="text-[9px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              Você
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block truncate max-w-[200px]">
                          {member.email}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isUserMaster
                          ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                          : 'text-sky-400 bg-sky-400/10 border-sky-400/30'
                      }`}
                    >
                      {isUserMaster ? 'Master' : 'Consultor'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {member.created_at
                          ? new Date(member.created_at).toLocaleDateString('pt-BR')
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <strong className="text-slate-200">
                        {member.total_propostas || 0} propostas
                      </strong>
                    </div>
                  </div>

                  {/* Ações Mobile */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPasswordModalMember(member);
                        setNewPassword('');
                        setPasswordSuccess(false);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition active:scale-95"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trocar Senha</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditNameMember(member);
                        setNewName(member.nome || '');
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title="Editar Nome"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {!isUserMaster && (
                      <button
                        onClick={() => setDeleteModalMember(member)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        title="Excluir Consultor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. VISUALIZAÇÃO EM TABELA (Desktop a partir de 'md') */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Consultor</th>
                    <th className="py-3.5 px-4">E-mail de Login</th>
                    <th className="py-3.5 px-4">Nível</th>
                    <th className="py-3.5 px-4">Propostas</th>
                    <th className="py-3.5 px-4">Data de Cadastro</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMembers.map((member) => {
                    const isUserMaster =
                      member.email?.toLowerCase().trim() === 'gouloalex@gmail.com';
                    const isCurrentUser = member.id === user?.id;

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-800/40 transition group"
                      >
                        {/* Avatar & Nome */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                              {(member.nome || member.email || 'U')
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-white text-xs font-bold block">
                                  {member.nome || 'Consultor'}
                                </strong>
                                {isCurrentUser && (
                                  <span className="text-[9px] font-semibold text-slate-400 bg-slate-800 px-1 py-0.2 rounded">
                                    Você
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* E-mail */}
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {member.email}
                        </td>

                        {/* Nível */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              isUserMaster
                                ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
                                : 'text-sky-400 bg-sky-400/10 border-sky-400/30'
                            }`}
                          >
                            {isUserMaster ? (
                              <>
                                <Crown className="w-3 h-3 text-amber-400" />
                                <span>Master Admin</span>
                              </>
                            ) : (
                              <>
                                <Briefcase className="w-3 h-3 text-sky-400" />
                                <span>Consultor</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Propostas */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-200">
                            {member.total_propostas || 0}
                          </span>
                          <span className="text-slate-500 ml-1">propostas</span>
                        </td>

                        {/* Data */}
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {member.created_at
                            ? new Date(member.created_at).toLocaleDateString('pt-BR')
                            : '—'}
                        </td>

                        {/* Ações */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Trocar Senha */}
                            <button
                              onClick={() => {
                                setPasswordModalMember(member);
                                setNewPassword('');
                                setPasswordSuccess(false);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 font-semibold text-xs border border-slate-700 transition"
                              title="Redefinir senha de acesso deste consultor"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                              <span>Trocar Senha</span>
                            </button>

                            {/* Editar Nome */}
                            <button
                              onClick={() => {
                                setEditNameMember(member);
                                setNewName(member.nome || '');
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Editar Nome do Consultor"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Excluir Consultor (Desabilitado para o Master) */}
                            {isUserMaster ? (
                              <button
                                disabled
                                className="p-1.5 rounded-lg text-slate-700 cursor-not-allowed"
                                title="Usuário Master não pode ser excluído"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setDeleteModalMember(member)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                title="Excluir este consultor da equipe"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ============================================================================== */}
      {/* MODAL: TROCAR SENHA                                                            */}
      {/* ============================================================================== */}
      {passwordModalMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Redefinir Senha</h3>
                  <p className="text-[11px] text-slate-400">
                    Definir nova senha de acesso para o consultor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {passwordSuccess ? (
                <div className="text-center py-2 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Senha Alterada com Sucesso!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      A nova senha para <strong className="text-white">{passwordModalMember.email}</strong> já está ativa.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-left text-xs space-y-1.5 font-mono">
                    <div className="text-slate-400">
                      Consultor: <strong className="text-white font-sans">{passwordModalMember.nome}</strong>
                    </div>
                    <div className="text-slate-400">
                      Login: <strong className="text-amber-400">{passwordModalMember.email}</strong>
                    </div>
                    <div className="text-slate-400">
                      Nova Senha: <strong className="text-emerald-400">{newPassword}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleCopiarMensagemAcesso}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Mensagem Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Mensagem para WhatsApp</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setPasswordModalMember(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2 rounded-xl transition"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSalvarSenha} className="space-y-4 text-xs">
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                    <div className="text-slate-400">
                      Consultor: <strong className="text-white">{passwordModalMember.nome}</strong>
                    </div>
                    <div className="text-slate-400">
                      E-mail: <strong className="text-amber-400 font-mono">{passwordModalMember.email}</strong>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-300 font-semibold">Nova Senha *</label>
                      <button
                        type="button"
                        onClick={gerarSenhaForte}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline"
                      >
                        Gerar senha forte
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPasswordText ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      O consultor poderá utilizar essa nova senha no próximo login imediatamente.
                    </span>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setPasswordModalMember(null)}
                      className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingPassword || !newPassword}
                      className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                    >
                      {savingPassword ? (
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvar Nova Senha</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL: EXCLUIR MEMBRO                                                          */}
      {/* ============================================================================== */}
      {deleteModalMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Excluir Consultor</h3>
              </div>
              <button
                onClick={() => setDeleteModalMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Tem certeza que deseja excluir o acesso de{' '}
                <strong className="text-white font-bold">{deleteModalMember.nome}</strong> (
                <span className="text-amber-400 font-mono">{deleteModalMember.email}</span>)?
              </p>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-[11px] text-amber-200 space-y-1">
                <strong className="block text-amber-300 font-bold">Importante:</strong>
                <p>
                  • O consultor perderá imediatamente o login no painel UseSol.
                </p>
                <p>
                  • Todas as propostas criadas por este colaborador permanecerão salvas com segurança e serão transferidas para a conta Master Alex.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalMember(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarExclusao}
                  disabled={deleting}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition disabled:opacity-50"
                >
                  {deleting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirmar Exclusão</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL: EDITAR NOME DO CONSULTOR                                               */}
      {/* ============================================================================== */}
      {editNameMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Editar Nome do Consultor</span>
              </h3>
              <button
                onClick={() => setEditNameMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSalvarNome} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome do consultor"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditNameMember(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingName || !newName.trim()}
                  className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {savingName ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar Nome</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* MODAL: SCRIPT SQL DE CONFIGURAÇÃO DO SUPABASE                                 */}
      {/* ============================================================================== */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Script SQL de Gestão da Equipe</h3>
                  <p className="text-[11px] text-slate-400">
                    Funções de segurança instaladas no Supabase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-300">
                Execute o script abaixo no <strong>SQL Editor</strong> do seu painel Supabase para ativar as funções de listagem da equipe, troca de senha e exclusão segura de membros.
              </p>

              <div className="relative">
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-slate-300 max-h-64 overflow-y-auto leading-relaxed">
                  {EQUIPE_SQL_SCRIPT}
                </pre>
                <button
                  onClick={handleCopiarSql}
                  className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <a
                  href="https://supabase.com/dashboard/project/jprqerjltonaxrharsli/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir SQL Editor no Supabase</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={carregarEquipe}
                    className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold transition"
                  >
                    Testar Conexão
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
