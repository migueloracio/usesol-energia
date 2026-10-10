import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isDesktopVisible, setIsDesktopVisible] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // Desktop timer to appear gracefully
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDesktopVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mobile scroll detection for simulator visibility
  useEffect(() => {
    let ticking = false;

    const checkSimulatorVisibility = () => {
      const simulatorEl = document.getElementById('simulador');
      if (simulatorEl) {
        const rect = simulatorEl.getBoundingClientRect();
        // O card sai da tela pelo topo quando o rect.bottom fica perto ou abaixo do topo da tela (<= 130px).
        // Quando o usuário está no topo ou navegando no simulador, rect.bottom > 130, então a barra fica oculta.
        // Assim que ele passa do simulador (card quase saindo ou já fora), a barra desliza suavemente para cima.
        const isPastSimulator = rect.bottom <= 130;
        setShowMobileBar(isPastSimulator);
      } else {
        setShowMobileBar(window.scrollY > 750);
      }
      ticking = false;
    };

    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkSimulatorVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    checkSimulatorVisibility();

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const whatsappUrl = "https://wa.me/5511994333471?text=Ol%C3%A1!%20Estou%20no%20site%20da%20Use%20Sol%20e%20gostaria%20de%20uma%20simula%C3%A7%C3%A3o%20de%20economia%20solar.";

  return (
    <>
      {/* 1. Desktop Floating WhatsApp Button (Bottom-Right) */}
      <aside
        aria-label="Atendimento rápido"
        className={`hidden sm:block fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isDesktopVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className="relative flex flex-col items-end">
          
          {/* Conversational Floating Tooltip Bubble */}
          {!tooltipDismissed && (
            <div className="mb-3 bg-white text-slate-800 p-3.5 rounded-2xl shadow-2xl border border-emerald-100 max-w-xs flex items-start gap-2.5 animate-bounce duration-1000">
              <div className="text-xs">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Especialista Online Agora
                </p>
                <p className="text-slate-600 mt-0.5">
                  Envie sua conta de luz e receba sua simulação de economia em instantes!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTooltipDismissed(true)}
                className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors"
                aria-label="Fechar mensagem"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Floating Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-5 rounded-full shadow-2xl shadow-emerald-950/80 hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all duration-200 group border-2 border-emerald-400/40"
            aria-label="Falar pelo WhatsApp com a Use Sol"
          >
            <MessageCircle className="w-6 h-6 fill-current text-white animate-pulse" />
            <span className="text-sm tracking-wide">Simular no WhatsApp</span>
          </a>
        </div>
      </aside>

      {/* 2. Mobile Sticky Bottom Action Bar (iPhone Pro Max & Mobile Optimized) */}
      <aside
        aria-label="Atendimento móvel"
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom,0px))] bg-[#061A14]/95 backdrop-blur-md border-t border-emerald-800/60 shadow-[0_-10px_30px_rgba(0,0,0,0.45)] transition-all duration-500 ease-out transform ${
          showMobileBar
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-[#005a36] to-emerald-600 active:scale-[0.98] text-white font-bold text-sm sm:text-base py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-all duration-150"
        >
          <MessageCircle className="w-5 h-5 fill-current text-white animate-pulse" />
          <span className="tracking-wide">Simular Economia no WhatsApp</span>
        </a>
      </aside>
    </>
  );
}
