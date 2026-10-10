import React from 'react';
import { 
  FileSearch, 
  Compass, 
  BadgePercent, 
  Wrench, 
  CheckCheck, 
  Sun,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function ProcessTimeline() {
  const steps = [
    {
      number: "01",
      icon: FileSearch,
      title: "Análise da Conta de Luz",
      time: "1 a 2 dias úteis",
      desc: "Você nos envia uma foto da sua fatura recente pelo WhatsApp. Nossos engenheiros calculam seu consumo médio e a média de irradiação solar do seu telhado."
    },
    {
      number: "02",
      icon: Compass,
      title: "Projeto de Engenharia",
      time: "Personalizado",
      desc: "Dimensionamos a quantidade ideal de placas e a potência do inversor para cobrir seu consumo atual e prever expansões futuras da sua família ou negócio."
    },
    {
      number: "03",
      icon: BadgePercent,
      title: "Proposta & Financiamento",
      time: "Aprovação rápida",
      desc: "Apresentamos o estudo completo de economia e, se desejar, simulamos o financiamento bancário com parcelas menores do que a sua conta de luz atual."
    },
    {
      number: "04",
      icon: Wrench,
      title: "Instalação Ágil e Segura",
      time: "2 a 3 dias no local",
      desc: "Nossa equipe técnica própria executa a fixação dos painéis e conexão elétrica com padrão estético impecável e respeito total ao seu imóvel."
    },
    {
      number: "05",
      icon: CheckCheck,
      title: "Homologação na Concessionária",
      time: "Cuidamos de tudo",
      desc: "Submetemos toda a documentação legal e ART junto à concessionária local (EDP/Enel) até a vistoria e troca do relógio para o modelo bidirecional."
    },
    {
      number: "06",
      icon: Sun,
      title: "Geração Ativa & Economia",
      time: "Para sempre",
      desc: "Seu sistema começa a gerar créditos na hora. Você acompanha a produção em tempo real no aplicativo pelo celular e vê a conta despencar."
    }
  ];

  return (
    <section id="processo" className="py-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#005a36] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>PROCESSO 100% DESCOMPLICADO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Do orçamento à energia no teto sem dor de cabeça
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Você não precisa entender de cabos, inversores ou trâmites de concessionária. A Use Sol assume toda a responsabilidade técnica do início ao fim.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="relative bg-slate-50 border border-slate-200/80 rounded-3xl p-7 hover:border-emerald-500/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black text-[#005a36] group-hover:text-amber-500 transition-colors font-display">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#005a36] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>

                  <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-3 border border-emerald-200/50">
                    ⏱ {step.time}
                  </span>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency note about timeframe */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Transparência total nos prazos de instalação
            </h4>
            <p className="text-sm text-slate-300 max-w-2xl">
              A instalação no seu telhado leva <strong className="text-white">apenas 2 a 3 dias</strong>. Todo o processo com documentação técnica e homologação pela concessionária leva entre 60 e 90 dias, e nossa equipe monitora cada etapa.
            </p>
          </div>

          <a
            href="https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20enviar%20uma%20foto%20da%20minha%20conta%20de%20luz%20para%20uma%20an%C3%A1lise%20gratuita."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#005a36] hover:bg-[#00472b] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md group"
          >
            <span>Iniciar etapa 01 no WhatsApp</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </section>
  );
}
