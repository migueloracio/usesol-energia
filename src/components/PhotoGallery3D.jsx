import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Maximize2, X } from 'lucide-react';

const galleryItems = [
  {
    src: '/img%20e%20videos/2.jpeg',
    title: 'Instalação Residencial Completa',
    location: 'Mogi das Cruzes - SP',
    highlight: '12 Módulos de Alta Eficiência',
    economy: 'Economia média: R$ 750/mês'
  },
  {
    src: '/img%20e%20videos/3.jpeg',
    title: 'Estrutura em Telhado Colonial',
    location: 'Ferraz de Vasconcelos - SP',
    highlight: 'Vedação Especial Contra Infiltrações',
    economy: 'Economia média: R$ 620/mês'
  },
  {
    src: '/img%20e%20videos/4.jpeg',
    title: 'Geração Máxima & Padrão Técnico',
    location: 'Suzano - SP',
    highlight: 'Inversor Inteligente com Monitoramento Wi-Fi',
    economy: 'Economia média: R$ 980/mês'
  },
  {
    src: '/img%20e%20videos/5.jpeg',
    title: 'Projeto Comercial em Galpão',
    location: 'Poá - SP',
    highlight: 'Fixação em Telha Metálica Reforçada',
    economy: 'Economia média: R$ 2.400/mês'
  },
  {
    src: '/img%20e%20videos/6.jpeg',
    title: 'Alinhamento & Estética Impecável',
    location: 'Arujá - SP',
    highlight: 'Acabamento Premium sem Fios Aparentes',
    economy: 'Economia média: R$ 890/mês'
  },
  {
    src: '/img%20e%20videos/7.jpeg',
    title: 'Sistema Conectado à Rede (On-Grid)',
    location: 'Itaquaquecetuba - SP',
    highlight: 'Homologação Rápida na Concessionária',
    economy: 'Economia média: R$ 540/mês'
  },
  {
    src: '/img%20e%20videos/8.jpeg',
    title: 'Equipe Especializada em Altura',
    location: 'Alto Tietê - SP',
    highlight: 'Normas de Segurança NR-10 e NR-35',
    economy: 'Projeto 100% Chave na Mão'
  },
  {
    src: '/img%20e%20videos/WhatsApp%20Image%202026-10-10%20at%2013.26.14.jpeg',
    title: 'Garantia de 25 Anos nos Painéis',
    location: 'Região Metropolitana - SP',
    highlight: 'Equipamentos Tier 1 Certificados pelo Inmetro',
    economy: 'Economia média: R$ 1.150/mês'
  }
];

export default function PhotoGallery3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const containerRef = useRef(null);

  const total = galleryItems.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay a cada 3.8s quando não estiver pausado
  useEffect(() => {
    if (isPaused || selectedPhoto !== null) return;
    const interval = setInterval(nextSlide, 3800);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, selectedPhoto]);

  // Suporte a Touch Swipe para celular (iPhone Pro Max / Android)
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStart(e.touches[0].clientX);
    setTouchDelta(0);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  };

  const handleTouchEnd = () => {
    if (touchStart === null) return;
    if (touchDelta < -40) {
      nextSlide();
    } else if (touchDelta > 40) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsPaused(false);
  };

  // Suporte a Teclado (setas esquerda e direita)
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'Escape') setSelectedPhoto(null);
  };

  const currentItem = galleryItems[currentIndex];
  const whatsappUrl = `https://wa.me/5511994333471?text=${encodeURIComponent(
    `Olá! Vi o projeto "${currentItem.title}" (${currentItem.location}) na galeria do site da Use Sol e gostaria de simular um sistema similar para o meu telhado!`
  )}`;

  return (
    <section 
      id="galeria" 
      className="py-14 sm:py-20 bg-gradient-to-b from-[#02140D] via-[#041D14] to-[#02140D] text-white relative overflow-hidden select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Galeria 3D de instalações reais da Use Sol"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nossas Instalações Reais</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Fotos de projetos entregues e homologados<br className="hidden sm:inline" />
            <span className="text-emerald-400"> no Alto Tietê e região.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Veja a qualidade técnica, o acabamento e a segurança das nossas instalações residenciais e comerciais. Arraste ou use as setas para explorar.
          </p>
        </div>

        {/* 3D Carousel Stage */}
        <div 
          ref={containerRef}
          className="relative h-[340px] sm:h-[430px] md:h-[480px] w-full flex items-center justify-center overflow-visible"
          style={{ perspective: '1100px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {galleryItems.map((item, index) => {
            // Distância circular modular para rotação 3D contínua
            let diff = (index - currentIndex) % total;
            if (diff < -Math.floor(total / 2)) diff += total;
            if (diff > Math.floor(total / 2)) diff -= total;

            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            // Variáveis de posição 3D
            const translateX = diff * 58; // Porcentagem no mobile/desktop
            const rotateY = diff * -28;   // Angulação 3D
            const translateZ = -Math.abs(diff) * 140; // Profundidade Z
            const scale = isCenter ? 1 : Math.max(0.72, 1 - Math.abs(diff) * 0.16);
            const zIndex = 30 - Math.abs(diff) * 10;
            const opacity = isCenter ? 1 : Math.max(0.35, 1 - Math.abs(diff) * 0.4);

            return (
              <div
                key={index}
                onClick={() => {
                  if (isCenter) {
                    setSelectedPhoto(item);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                className={`absolute w-[270px] sm:w-[380px] md:w-[460px] h-[300px] sm:h-[390px] md:h-[430px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out transform ${
                  isCenter 
                    ? 'ring-2 ring-emerald-400 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.25)]' 
                    : 'shadow-2xl ring-1 ring-white/10 filter brightness-75 hover:brightness-95'
                }`}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
                aria-label={item.title}
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity ${
                  isCenter ? 'opacity-90' : 'opacity-70'
                }`} />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005a36]/90 backdrop-blur-md border border-emerald-400/40 text-[11px] sm:text-xs font-bold text-white shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Instalação Real</span>
                  </span>

                  {isCenter && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(item);
                      }}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 transition-transform active:scale-95"
                      title="Ver imagem ampliada"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Bottom Card Information */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.location}</span>
                  </div>

                  <h3 className="text-sm sm:text-lg font-bold text-white leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
                    {item.highlight}
                  </p>

                  <div className="pt-1 flex items-center justify-between border-t border-white/15">
                    <span className="text-[11px] sm:text-xs font-extrabold text-amber-300">
                      {item.economy}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Foto {index + 1} de {total}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 z-40 p-2.5 sm:p-3 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white border border-emerald-500/30 backdrop-blur-md transition-all shadow-xl hover:border-emerald-400 group"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 z-40 p-2.5 sm:p-3 rounded-full bg-black/65 hover:bg-black/90 active:scale-95 text-white border border-emerald-500/30 backdrop-blur-md transition-all shadow-xl hover:border-emerald-400 group"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {galleryItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-400/50' 
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir para a foto ${idx + 1}`}
            />
          ))}
        </div>

        {/* Interactive CTA to simulate similar project */}
        <div className="mt-10 sm:mt-12 text-center space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#005a36] hover:bg-[#00472b] text-white font-bold text-sm sm:text-base py-3.5 px-8 rounded-full shadow-xl shadow-black/40 hover:shadow-[#005a36]/40 transition-all duration-200 hover:-translate-y-0.5 group border border-emerald-400/30"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Quero um projeto com esse padrão no meu telhado</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <p className="text-xs text-slate-400">
            Envie sua conta de luz e receba o estudo personalizado com equipamentos homologados.
          </p>
        </div>

      </div>

      {/* Lightbox Modal (Zoom em tela cheia) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Fechar zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="w-full h-full max-h-[75vh] object-contain bg-black"
            />
            <div className="bg-[#03140E] p-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-emerald-800/40">
              <div>
                <h4 className="font-bold text-base text-white">{selectedPhoto.title}</h4>
                <p className="text-xs text-emerald-300">{selectedPhoto.location} • {selectedPhoto.highlight}</p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Simular Este Modelo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
