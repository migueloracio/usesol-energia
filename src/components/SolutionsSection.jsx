import React from 'react';
import { Home, Building2, Wrench, Sparkles, ArrowRight, Check, Zap } from 'lucide-react';

export default function SolutionsSection() {
  const solutions = [
    {
      id: "residencial",
      tag: "Mais Procurado",
      tagColor: "bg-amber-400 text-slate-950 font-bold shadow-xs",
      icon: Home,
      title: "Energia Solar Residencial",
      subtitle: "Mais economia e conforto para sua família",
      description: "Livre-se dos aumentos constantes de tarifas e bandeiras tarifárias. Ligue o ar-condicionado e seus eletrodomésticos sem medo da fatura no final do mês.",
      benefits: [
        "Redução de até 95% na fatura mensal",
        "Valorização imediata do seu imóvel",
        "Proteção contra reajustes anuais de energia",
        "Vida útil superior a 25 anos dos equipamentos"
      ],
      ctaText: "Simular para minha casa",
      ctaUrl: "https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20energia%20solar%20residencial.",
      featured: true
    },
    {
      id: "comercial",
      tag: "Alto Retorno",
      tagColor: "bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200",
      icon: Building2,
      title: "Energia Solar Comercial & PME",
      subtitle: "Transforme custo fixo pesado em margem de lucro",
      description: "A eletricidade é uma das maiores despesas de comércios, clínicas, padarias e galpões. Gere energia no horário de pico e aumente sua rentabilidade operacional.",
      benefits: [
        "Corte drástico nos custos fixos do negócio",
        "Payback acelerado (retorno médio entre 3 e 4 anos)",
        "Marketing ESG e compromisso com sustentabilidade",
        "Financiamento com parcelas menores que a fatura"
      ],
      ctaText: "Simular para minha empresa",
      ctaUrl: "https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20um%20estudo%20de%20energia%20solar%20comercial.",
      featured: false
    }
  ];

  const extraServices = [
    {
      icon: Wrench,
      title: "Manutenção Preventiva & Corretiva",
      desc: "Revisão periódica de inversores, cabeamento, aperto de conexões e proteção elétrica para manter seu sistema seguro e com máxima eficiência."
    },
    {
      icon: Sparkles,
      title: "Limpeza Técnica de Painéis",
      desc: "A sujeira e fuligem acumuladas podem reduzir até 25% da geração. Realizamos limpeza técnica com produtos e água desmineralizada apropriada."
    }
  ];

  return (
    <section id="solucoes" className="py-20 bg-slate-50 border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#005a36] text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>SOLUÇÕES EM ENERGIA SOLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Energia solar para todos os tipos de imóvel
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Não existe sistema genérico. Cada imóvel no Alto Tietê tem uma orientação solar e padrão de consumo único que calculamos com precisão de engenharia.
          </p>
        </div>

        {/* 2 Main Columns: Residential & Commercial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.id}
                className={`relative rounded-3xl p-8 sm:p-9 transition-all duration-300 flex flex-col justify-between bg-white ${
                  sol.featured
                    ? 'border-2 border-emerald-600/40 shadow-2xl shadow-emerald-950/10 hover:shadow-2xl'
                    : 'border border-slate-200 shadow-xl shadow-slate-200/40 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-xs px-3.5 py-1.5 rounded-full ${sol.tagColor}`}>
                      {sol.tag}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-theme-accent-light border border-theme-accent-border flex items-center justify-center text-theme-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    {sol.title}
                  </h3>
                  <p className="text-sm font-semibold text-theme-primary mb-4">
                    {sol.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {sol.description}
                  </p>

                  {/* Bullet Benefits */}
                  <div className="space-y-3.5 mb-8">
                    {sol.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-theme-accent-light text-theme-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="font-medium">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={sol.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all group ${
                    sol.featured
                      ? 'bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-text shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  <span>{sol.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Extra Services: Manutenção e Limpeza */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="max-w-2xl mb-6">
            <h4 className="text-lg font-bold text-slate-900">
              Já tem energia solar instalada no seu telhado?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              Oferecemos suporte técnico de pós-venda para garantir que seus painéis operem sempre na capacidade máxima.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {extraServices.map((srv, idx) => {
              const SrvIcon = srv.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/60">
                    <SrvIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 mb-1">{srv.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
