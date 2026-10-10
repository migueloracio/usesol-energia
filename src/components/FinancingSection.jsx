import React from 'react';
import { CreditCard, Landmark, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function FinancingSection() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Persuasive Argumentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>FACILIDADE DE PAGAMENTO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Troque a conta de luz pela parcela de um{' '}
              <span className="text-[#005a36]">
                patrimônio que é seu.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Você não precisa se descapitalizar para instalar energia solar. Com as condições negociadas pela Use Sol, a economia mensal na fatura frequentemente cobre o valor da parcela.
            </p>

            {/* Comparison Logic Box */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✕
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Conta da concessionária:</strong> Você paga para o resto da vida, sofre com reajustes anuais constantes e nunca recupera 1 centavo.
                </p>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#005a36] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Parcela solar Use Sol:</strong> Tem prazo fixo para terminar. Quando você quita, a energia continua gerando de graça por 20+ anos.
                </p>
              </div>
            </div>

            {/* Quick Conditions List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#005a36] shrink-0" />
                <span>Até <strong>21x no cartão de crédito</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#005a36] shrink-0" />
                <span>Financiamento bancário em até <strong>72x</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#005a36] shrink-0" />
                <span>Carência de até <strong>90 a 120 dias</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#005a36] shrink-0" />
                <span>Análise de crédito 100% online</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20simular%20o%20financiamento%20de%20um%20sistema%20solar%20com%20a%20Use%20Sol."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#005a36] hover:bg-[#00472b] text-white font-bold text-sm sm:text-base px-7 py-4 rounded-2xl shadow-lg shadow-emerald-950/15 transition-all hover:-translate-y-0.5 group"
              >
                <span>Simular opções de financiamento no WhatsApp</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Bank Badges & Financial Offer Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/60 relative">
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#005a36] flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    Parceiros Financeiros Oficiais
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aprovação facilitada e taxas especiais para energia fotovoltaica
                  </p>
                </div>
              </div>

              {/* Partner Banks Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Santander Financiamentos */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                    Santander
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800">
                    Financiamentos
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    Taxas para energia solar
                  </span>
                </div>

                {/* Banco BV */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Banco BV
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800">
                    Crédito Solar
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    Parcelamento estendido
                  </span>
                </div>
              </div>

              {/* Commercial Offer Callout (From Instagram campaigns) */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">
                    Referência para residências:
                  </span>
                  <span className="text-xs bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
                    ~350 kWh/mês
                  </span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  Sistemas a partir de <span className="text-[#005a36]">R$ 11.500</span>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consulte os requisitos do seu telhado e tenha uma simulação com parcelas projetadas exatamente para o seu consumo real.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#005a36] shrink-0" />
                <span>Simulação sem custos e sem compromisso de contratação.</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
