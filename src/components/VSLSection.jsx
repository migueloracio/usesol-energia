import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, MessageCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function VSLSection() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      setHasInteracted(true);
      // Se estava pausado, garante o play ao desmutar
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const whatsappUrl = "https://wa.me/5511994333471?text=Ol%C3%A1!%20Assisti%20ao%20v%C3%ADdeo%20no%20site%20da%20Use%20Sol%20e%20gostaria%20de%20solicitar%20minha%20simula%C3%A7%C3%A3o%20gratuita.";

  return (
    <section id="apresentacao" className="py-14 sm:py-20 bg-gradient-to-b from-white via-emerald-950/[0.03] to-white relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-accent-light border border-theme-accent-border text-theme-primary text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Apresentação Oficial Use Sol</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Veja como funciona a energia solar na prática<br className="hidden sm:inline" />
            <span className="text-theme-primary"> e comece a economizar de verdade.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Entenda em menos de um minuto por que mais de 250 clientes no Alto Tietê escolheram a Use Sol para zerar a preocupação com a conta de luz.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/20 border-2 border-emerald-900/10 bg-slate-950 group">
          
          {/* Main Video Element */}
          <div className="relative aspect-video w-full bg-black cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              src="/UseSol-Video.mp4"
              playsInline
              autoPlay
              muted
              loop
              preload="metadata"
              className="w-full h-full object-cover sm:object-contain bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Overlay Gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Play / Pause Center Icon indicator on pause */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-[#005a36] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
                </div>
              </div>
            )}

            {/* Prominent Sound Toggle Overlay (High Mobile CRO) */}
            <button
              type="button"
              onClick={toggleSound}
              className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg text-xs sm:text-sm font-bold ${
                isMuted
                  ? 'bg-emerald-600/95 hover:bg-emerald-500 text-white animate-pulse shadow-emerald-950/50 border border-emerald-400/40'
                  : 'bg-black/70 hover:bg-black/85 text-white border border-white/20'
              }`}
              aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>Toque para ativar o som 🔊</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Som ativado</span>
                </>
              )}
            </button>

            {/* Bottom Bar inside video with pause button & branding */}
            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none text-white text-xs sm:text-sm">
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
                  aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <span className="font-medium drop-shadow-sm text-slate-200 text-xs hidden sm:inline">
                  Use Sol Energia Renovável
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-300 font-semibold drop-shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Vídeo Oficial</span>
              </div>
            </div>

          </div>

          {/* Under-Video Quick Value Highlights */}
          <div className="bg-[#041a13] px-5 py-4 sm:px-8 sm:py-5 border-t border-emerald-900/50 text-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Projeto Turnkey:</strong> Nós cuidamos de tudo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Homologação inclusa:</strong> Sem burocracia
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-white">Equipamentos Tier 1:</strong> Alta durabilidade
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button Below Video */}
        <div className="mt-8 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-text font-bold text-sm sm:text-base py-3.5 px-8 rounded-full shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Falar com especialista pelo WhatsApp</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="text-xs text-slate-500 mt-2">
            Atendimento imediato para tirar dúvidas do vídeo e simular sua economia.
          </p>
        </div>

      </div>
    </section>
  );
}
