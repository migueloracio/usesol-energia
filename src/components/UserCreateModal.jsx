import React, { useState } from 'react';
import { X, UserPlus, Mail, Lock, User, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { cadastrarNovoConsultor } from '../lib/auth';

export default function UserCreateModal({ onClose, onUserCreated }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyWhatsApp = () => {
    const msg = `☀️ *UseSol Energia - Acesso ao Painel de Propostas*

Olá *${nome || 'Consultor'}*,
Seu acesso ao Painel UseSol foi liberado:

📧 *Login:* ${email}
🔑 *Senha Inicial:* ${password}

👉 Acesse em: https://usesolenergia.com/#painel`;

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await cadastrarNovoConsultor({
        email: email.trim(),
        password,
        nome: nome.trim()
      });
      setSuccess(true);
      if (onUserCreated) onUserCreated();
    } catch (err) {
      console.error('Erro ao cadastrar consultor:', err);
      let msg = err.message || 'Erro ao criar usuário.';
      if (msg.includes('already registered')) {
        msg = 'Este e-mail já está cadastrado no sistema.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'A senha deve conter no mínimo 6 caracteres.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Novo Consultor UseSol</span>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                  Master
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Crie o acesso para um novo vendedor da sua equipe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Consultor Criado com Sucesso!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  O acesso para <strong className="text-white">{email}</strong> foi registrado no Supabase.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-left text-xs space-y-1">
                <div><span className="text-slate-500">Nome:</span> <strong className="text-slate-300">{nome || '—'}</strong></div>
                <div><span className="text-slate-500">Login:</span> <strong className="text-amber-400">{email}</strong></div>
                <div><span className="text-slate-500">Senha:</span> <strong className="text-slate-300">{password}</strong></div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                * Informe esses dados ao novo consultor para ele acessar em usesolenergia.com/#painel
              </p>

              <button
                onClick={handleCopyWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Mensagem Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Dados para WhatsApp</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs py-2.5 rounded-xl transition"
              >
                Concluir
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome do Consultor</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">E-mail de Acesso *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="consultor@usesolenergia.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Senha Inicial *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:border-amber-400 outline-none font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Você pode passar essa senha para o consultor logar imediatamente.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Cadastrar Consultor</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
