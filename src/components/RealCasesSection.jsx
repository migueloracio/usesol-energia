import React from 'react';
import { TrendingDown, CheckCircle, ArrowDownRight, MapPin, Quote } from 'lucide-react';

export default function RealCasesSection() {
  const cases = [
    {
      name: "Mariana A.",
      role: "Cliente Residencial",
      city: "Ferraz de Vasconcelos - SP",
      system: "Sistema 10 Placas (4.5 kWp)",
      beforeBill: 780,
      afterBill: 68,
      monthlySavings: 712,
      yearlySavings: 8544,
      quote: "Minha conta de energia pesava demais no final do mês. A Use Sol cuidou de tudo com muita transparência. Hoje a conta vem praticamente a taxa mínima e a economia paga com folga qualquer investimento.",
      initials: "MA",
      badgeColor: "bg-emerald-500/20 text-emerald-300"
    },
    {
      name: "Carlos R.",
      role: "Comércio / Padaria",
      city: "Mogi das Cruzes - SP",
      system: "Sistema 28 Placas (14.2 kWp)",
      beforeBill: 2450,
      afterBill: 195,
      monthlySavings: 2255,
      yearlySavings: 27060,
      quote: "Na empresa, a energia era um dos maiores custos fixos. Fizemos o projeto com a Use Sol e o retorno foi imediato. A instalação foi extremamente rápida e sem atrapalhar nosso expediente.",
      initials: "CR",
      badgeColor: "bg-amber-400/20 text-amber-300"
    },
    {
      name: "Rodrigo M.",
      role: "Cliente Residencial",
      city: "Suzano - SP",
      system: "Sistema 14 Placas (6.3 kWp)",
      beforeBill: 1180,
      afterBill: 85,
      monthlySavings: 1095,
      yearlySavings: 13140,
      quote: "Sem pressão para fechar, tiraram todas as minhas dúvidas sobre a concessionária e homologação. O aplicativo para acompanhar a geração no celular é excelente e a economia é real.",
      initials: "RM",
      badgeColor: "bg-teal-400/20 text-teal-300"
    }
  ];

  return (
    <section id="projetos" className="py-24 bg-[#03150F] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>RESULTADOS COMPROVÁVEIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Veja a economia saindo do papel e virando dinheiro no bolso
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Casos reais de famílias e empresários do Alto Tietê que trocaram contas abusivas pela liberdade da energia solar Use Sol.
          </p>
        </div>

        {/* 3 Real Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c, idx) => (
            <div 
              key={idx}
              className="bg-[#07241A] border border-emerald-800/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-black/40"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#005a36] border border-emerald-500/40 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                      {c.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{c.name}</h4>
                      <p className="text-xs text-emerald-400 font-medium">{c.role}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${c.badgeColor}`}>
                    <MapPin className="w-3 h-3" />
                    {c.city.split(' - ')[0]}
                  </span>
                </div>

                {/* Before and After Metrics Box */}
                <div className="bg-[#02130C] rounded-2xl p-4 border border-emerald-900/60 mb-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Conta antes da Use Sol:</span>
                    <span className="line-through text-rose-400 font-semibold">
                      R$ {c.beforeBill.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span>Nova conta com placas solares:</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ~R$ {c.afterBill.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                      Economia no 1º ano:
                    </span>
                    <span className="text-base font-extrabold text-amber-400">
                      R$ {c.yearlySavings.toLocaleString('pt-BR')},00
                    </span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-emerald-600/30 absolute -top-2 -left-1" />
                  <p className="text-xs sm:text-sm text-slate-300 italic pl-5 leading-relaxed">
                    "{c.quote}"
                  </p>
                </div>
              </div>

              {/* System details tag */}
              <div className="pt-4 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {c.system}
                </span>
                <span className="text-emerald-400 font-semibold">Homologado</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/5511994333471?text=Ol%C3%A1!%20Vi%20os%20casos%20reais%20no%20site%20e%20gostaria%20de%20saber%20quanto%20eu%20economizaria%20no%20meu%20im%C3%B3vel."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
          >
            <span>Quer saber o resultado estimado especificamente para a sua conta? Fale com a gente no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
