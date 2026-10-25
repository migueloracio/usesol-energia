import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function ProposalLogin({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        if (data?.user && !data?.session) {
          setSuccessMessage('Conta criada com sucesso! Verifique seu e-mail para confirmar ou faça login se a confirmação estiver desativada.');
        } else {
          onLoginSuccess(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onLoginSuccess(data.user);
      }
      setErrorMessage('');
    } catch (err) {
      console.error('Erro de autenticação:', err);
      let msg = err.message || 'Falha ao autenticar';
      if (msg.includes('Email not confirmed')) {
        msg = 'Seu usuário existe, mas o Supabase exige confirmação de e-mail. Para liberar o login imediato: no painel do Supabase, vá em Authentication > Users e clique nos 3 pontinhos ao lado de Gouloalex@gmail.com > "Confirm user" (ou em Providers > Email e desative "Confirm email").';
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'E-mail ou senha incorretos.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'A senha deve ter pelo menos 6 caracteres.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Glow de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Botão voltar */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Site</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header do Card */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo isDark={true} className="h-10" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Cadastrar Consultor UseSol' : 'Painel de Propostas Comerciais'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isSignUp
              ? 'Crie seu acesso para gerar e gerenciar propostas no Supabase'
              : 'Acesse para gerenciar orçamentos, gerar links e exportar PDFs'}
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail do Consultor
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="consultor@usesolenergia.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-theme-primary hover:bg-theme-primary-hover text-slate-950 font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Criar Conta' : 'Entrar no Painel'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternar entre login e cadastro */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              {isSignUp
                ? 'Já possui uma conta? Faça Login'
                : 'Primeiro acesso? Criar conta de consultor'}
            </button>
          </div>
        </div>

        {/* Rodapé de segurança */}
        <div className="text-center mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autenticação e banco de dados protegidos via Supabase</span>
        </div>

      </div>
    </div>
  );
}
