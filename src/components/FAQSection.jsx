import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Quanto posso economizar na conta de luz com energia solar?",
      a: "A economia média nos projetos da Use Sol chega a até 95%. Como você passa a gerar sua própria eletricidade, paga à concessionária apenas a taxa mínima de disponibilidade da rede e a iluminação pública municipal. O restante do seu consumo é zerado pelos créditos solares."
    },
    {
      q: "Preciso pagar alguma coisa para solicitar a simulação e o orçamento?",
      a: "Não! A análise preliminar da sua conta de luz e o estudo de dimensionamento são 100% gratuitos e sem nenhum compromisso. Você descobre exatamente quanto vai economizar antes de tomar qualquer decisão."
    },
    {
      q: "Como funciona o financiamento bancário?",
      a: "Trabalhamos com bancos parceiros consolidados (como Santander e Banco BV). O financiamento pode ser feito em até 72 meses com carência de até 90 a 120 dias para o primeiro pagamento. Na grande maioria dos casos, a economia gerada na fatura de luz é maior ou igual ao valor da parcela."
    },
    {
      q: "O sistema funciona em dias nublados ou chuvosos?",
      a: "Sim! Os painéis solares modernos operam com a radiação solar (luz difusa), e não apenas com o sol a pino. Embora a produção seja menor em dias com chuva intensa, o sistema gera excedentes em dias ensolarados que viram créditos válidos por até 5 anos na concessionária."
    },
    {
      q: "Quem cuida da burocracia e da homologação com a concessionária?",
      a: "A Use Sol cuida de 100% do processo técnico e burocrático. Nosso engenheiro emite a ART (Anotação de Responsabilidade Técnica), protocola o projeto junto à concessionária local (EDP, Enel, etc.), agenda a vistoria e acompanha a troca do medidor para o modelo bidirecional."
    },
    {
      q: "Quanto tempo dura um painel solar e qual a garantia?",
      a: "Os módulos solares possuem garantia de fábrica de até 15 anos dada pelos fabricantes (com durabilidade e vida útil projetada para mais de 25 anos). A instalação executada pela equipe técnica da Use Sol possui garantia de 1 ano com suporte de pós-venda dedicado."
    },
    {
      q: "Quais cidades a Use Sol atende?",
      a: "Nossa sede fica em Ferraz de Vasconcelos e atendemos com equipe própria todo o Alto Tietê (Mogi das Cruzes, Suzano, Poá, Itaquaquecetuba, Arujá, Santa Isabel) além de regiões metropolitanas de SP e cidades do Litoral (como Santos e Boraceia)."
    }
  ];

  return (
    <section id="duvidas" className="py-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#005a36] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>TIRE SUAS DÚVIDAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-600 text-base">
            Tudo o que você precisa saber para tomar uma decisão segura e transparente sobre energia solar.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50 border-emerald-600/40 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full text-left py-4.5 px-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 m-0">
                    {faq.q}
                  </h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#005a36] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-600 mb-3">
            Ainda tem alguma dúvida específica sobre o telhado da sua casa ou empresa?
          </p>
          <a
            href="https://wa.me/5511994333471?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20energia%20solar%20que%20gostaria%20de%20esclarecer."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#005a36] hover:text-[#00472b] transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Falar diretamente com um especialista técnico da Use Sol no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
