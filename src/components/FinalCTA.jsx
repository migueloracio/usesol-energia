import React from 'react';
import { MessageCircle, ArrowRight, Sun, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  const whatsappUrl = "https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20enviar%20minha%20conta%20de%20luz%20para%20uma%20simula%C3%A7%C3%A3o%20gratuita%20sem%20compromisso.";

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-gradient-to-br from-[#021810] via-[#005a36] to-[#021810] rounded-[32px] p-8 sm:p-14 shadow-2xl shadow-emerald-950/20 text-white relative space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
            <Sun className="w-4 h-4 text-amber-300" />
            <span>Comece a Economizar Hoje Mesmo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Pare de pagar caro na conta de luz.<br />
            <span className="text-emerald-300">
              Gere sua própria energia com a Use Sol.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Envie uma foto da sua fatura recente pelo WhatsApp e receba em poucas horas um estudo de viabilidade completo, mostrando seu investimento, economia e tempo de retorno.
          </p>

          {/* Highlights checklist */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-emerald-100">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              100% Gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              Sem compromisso de contratação
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              Atendimento humano e próximo
            </span>
          </div>

          {/* Main Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-[#005a36] font-black text-base sm:text-lg px-8 sm:px-10 py-4.5 rounded-full shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-1 group"
            >
              <MessageCircle className="w-6 h-6 fill-current text-[#005a36]" />
              <span>Quero minha simulação gratuita no WhatsApp</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <p className="text-xs text-emerald-200/80 italic">
            "Enquanto o sol brilha, você economiza." — Alto Tietê e região
          </p>

        </div>

      </div>
    </section>
  );
}
