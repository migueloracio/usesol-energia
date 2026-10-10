import React from 'react';
import { MessageCircle, ArrowRight, Sun, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function FinalCTA() {
  const { isOrange } = useTheme();
  const whatsappUrl = "https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20enviar%20minha%20conta%20de%20luz%20para%20uma%20simula%C3%A7%C3%A3o%20gratuita%20sem%20compromisso.";

  return (
    <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Main CTA Card */}
        <div 
          className={`relative rounded-[32px] p-8 sm:p-14 lg:p-16 shadow-2xl text-white space-y-6 transition-all duration-300 overflow-hidden border ${
            isOrange
              ? 'bg-gradient-to-br from-[#0D1217] via-[#141A22] to-[#0A0E12] border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_50px_rgba(247,168,56,0.12)]'
              : 'bg-gradient-to-br from-[#021810] via-[#004d2f] to-[#02140D] border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_50px_rgba(16,185,129,0.12)]'
          }`}
        >
          {/* Ambient Lighting Orbs */}
          <div 
            className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
              isOrange ? 'bg-amber-500/20' : 'bg-emerald-500/20'
            }`} 
          />
          <div 
            className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
              isOrange ? 'bg-orange-500/15' : 'bg-emerald-600/15'
            }`} 
          />

          {/* Top Kicker Pill */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-sm">
            <Sun className={`w-4 h-4 ${isOrange ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>Comece a Economizar Hoje Mesmo</span>
          </div>

          {/* Headline */}
          <h2 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Pare de pagar caro na conta de luz.<br />
            <span className={`transition-colors duration-300 ${isOrange ? 'text-[#F7A838]' : 'text-emerald-400'}`}>
              Gere sua própria energia com a Use Sol.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="relative z-10 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Envie uma foto da sua fatura recente pelo WhatsApp e receba em poucas horas um estudo de viabilidade completo, mostrando seu investimento, economia e tempo de retorno.
          </p>

          {/* Highlights checklist badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-2 text-xs sm:text-sm text-slate-200">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <CheckCircle2 className={`w-4 h-4 ${isOrange ? 'text-amber-400' : 'text-emerald-400'} shrink-0`} />
              <span>100% Gratuito</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <CheckCircle2 className={`w-4 h-4 ${isOrange ? 'text-amber-400' : 'text-emerald-400'} shrink-0`} />
              <span>Sem compromisso de contratação</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <CheckCircle2 className={`w-4 h-4 ${isOrange ? 'text-amber-400' : 'text-emerald-400'} shrink-0`} />
              <span>Atendimento humano e próximo</span>
            </span>
          </div>

          {/* Main Action Button */}
          <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 font-black text-base sm:text-lg px-8 sm:px-10 py-4.5 rounded-full shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] group ${
                isOrange
                  ? 'bg-gradient-to-r from-[#F7A838] via-[#F59E0B] to-[#EA8815] text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/40'
                  : 'bg-white hover:bg-slate-100 text-[#005a36] shadow-black/30'
              }`}
            >
              <MessageCircle className={`w-6 h-6 fill-current ${isOrange ? 'text-[#073822]' : 'text-[#005a36]'}`} />
              <span>Quero minha simulação gratuita no WhatsApp</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Inspirational Tagline */}
          <p className={`relative z-10 text-xs italic transition-colors duration-300 ${isOrange ? 'text-amber-300/80' : 'text-emerald-300/80'}`}>
            "Enquanto o sol brilha, você economiza." — Alto Tietê e região
          </p>

        </div>

      </div>
    </section>
  );
}
