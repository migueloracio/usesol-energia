import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Home,
  Building2,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero() {
  const [billAmount, setBillAmount] = useState(650);
  const [propertyType, setPropertyType] = useState('residencial');
  const [city, setCity] = useState('Ferraz de Vasconcelos');

  // Cálculos de energia solar no Brasil
  const estimatedNewBill = Math.max(propertyType === 'residencial' ? 65 : 150, Math.round(billAmount * 0.08));
  const monthlySavings = Math.max(0, billAmount - estimatedNewBill);
  const yearlySavings = monthlySavings * 12;

  const citiesList = [
    'Ferraz de Vasconcelos',
    'Mogi das Cruzes',
    'Suzano',
    'Poá',
    'Itaquaquecetuba',
    'Arujá',
    'Santa Isabel',
    'Santos (Litoral)',
    'São Paulo (capital)'
  ];

  const handleSimulateWhatsApp = (e) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    const message = encodeURIComponent(
      `Olá, equipe Use Sol! Fiz a simulação no site:\n\n` +
      `• Minha conta atual: R$ ${billAmount.toLocaleString('pt-BR')}/mês\n` +
      `• Perfil: ${propertyType === 'residencial' ? 'Residencial' : 'Comercial'}\n` +
      `• Minha cidade: ${city}\n` +
      `• Economia estimada calculada: ~R$ ${yearlySavings.toLocaleString('pt-BR')}/ano\n\n` +
      `Gostaria de receber a análise técnica gratuita com as opções de parcelamento!`
    );

    const waUrl = `https://wa.me/5511994333471?text=${message}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="inicio" className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-24 sm:pb-28 lg:pt-36 lg:pb-36 flex flex-col justify-center overflow-hidden">
      {/* Background Solar House Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Casa moderna com sistema de energia solar fotovoltaica no telhado - Use Sol Energia"
          className="w-full h-full object-cover object-[center_right] lg:object-center brightness-[0.98]"
        />

        {/* Dark Vignette Overlay for High Readability on Left Side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02130C]/95 via-[#02130C]/85 via-45% to-[#02130C]/35 sm:to-transparent" />

        {/* Subtle top shade for navbar contrast */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#02130C]/80 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">

            {/* Regional Badge / Kicker */}
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-bold tracking-wider text-theme-kicker uppercase drop-shadow-sm">
                ENERGIA SOLAR NO ALTO TIETÊ
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
              Sua conta de luz<br className="hidden sm:inline" /> pode estar custando<br />
              <span className="text-theme-kicker">muito mais do que deveria.</span>
            </h1>

            {/* Subtitle with direct problem-solution */}
            <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed drop-shadow-sm">
              Gere sua própria energia e reduza em até <strong className="text-white font-bold">95% o valor da sua conta de luz</strong>. Projeto, instalação e homologação para residências e empresas em todo o Alto Tietê.
            </p>

            {/* Main WhatsApp CTA Pill Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="https://wa.me/5511994333471?text=Ol%C3%A1!%20Gostaria%20de%20calcular%20minha%20economia%20com%20energia%20solar%20no%20Alto%20Tiet%C3%AA."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-text font-bold text-sm sm:text-base px-7 py-4 rounded-full shadow-xl shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Calcular minha economia no WhatsApp</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Trust Micro-Bullets */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-200 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white shrink-0" />
                <span><strong className="text-white">Simulação gratuita</strong><br /><span className="text-slate-300">Sem compromisso</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span><strong className="text-white">Atendimento local</strong><br /><span className="text-slate-300">Alto Tietê e região</span></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span><strong className="text-white">Equipe especializada</strong><br /><span className="text-slate-300">Do projeto à instalação</span></span>
              </div>
            </div>

          </div>

          {/* Right Column: Lead-First Interactive Simulator Card */}
          <div className="lg:col-span-5" id="simulador">
            <div className="relative bg-white text-slate-900 rounded-[28px] p-6 sm:p-7 shadow-2xl shadow-black/60 border border-slate-100 max-w-md mx-auto lg:ml-auto">

              {/* Card Header */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-theme-accent-light text-theme-primary flex items-center justify-center shrink-0 border border-theme-accent-border">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    Descubra quanto você pode economizar
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSimulateWhatsApp} className="space-y-4">

                {/* Input: Valor da Conta */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quanto você paga de energia por mês?
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`R$ ${billAmount.toLocaleString('pt-BR')},00`}
                      className="w-full bg-slate-100/90 border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Range Slider for immediate interactivity */}
                  <input
                    type="range"
                    min="250"
                    max="5000"
                    step="50"
                    value={billAmount}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--theme-primary)] mt-2.5"
                  />

                  {/* Preset Quick Chips */}
                  <div className="flex items-center justify-between gap-1.5 mt-1.5">
                    {[350, 650, 1200, 2500].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setBillAmount(val)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-all ${billAmount === val
                            ? 'bg-theme-primary text-theme-primary-text shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        R$ {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Você é:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPropertyType('residencial')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${propertyType === 'residencial'
                          ? 'bg-theme-primary text-theme-primary-text shadow-sm'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Residencial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPropertyType('comercial')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${propertyType === 'comercial'
                          ? 'bg-theme-primary text-theme-primary-text shadow-sm'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Comercial</span>
                    </button>
                  </div>
                </div>

                {/* City Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Sua cidade:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/30 focus:border-[var(--theme-primary)]"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Calculation Snapshot */}
                <div className="bg-theme-accent-light border border-theme-accent-border rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Nova conta estimada:</span>
                    <span className="font-bold text-slate-800">
                      ~R$ {estimatedNewBill.toLocaleString('pt-BR')}/mês
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-theme-primary" />
                      Economia no 1º ano:
                    </span>
                    <span className="font-extrabold text-theme-primary">
                      R$ {yearlySavings.toLocaleString('pt-BR')},00
                    </span>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-text font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-black/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Calcular minha economia</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  🔒 Simulação gratuita e sem compromisso.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Cursive Decorative Phrase in Bottom Right Patio */}
      <div className="hidden lg:block absolute bottom-28 xl:bottom-32 right-8 sm:right-12 xl:right-24 z-20 pointer-events-none select-none text-right">
        <p className="font-['Caveat',cursive] text-2xl sm:text-3xl text-white font-bold tracking-wide drop-shadow-md">
          Mais economia<br />
          <span className="relative inline-block">
            para o seu futuro.
            <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-emerald-400" viewBox="0 0 160 12" fill="none">
              <path d="M2 9C50 3 110 3 158 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </p>
      </div>

      {/* Organic White Wave Divider into White Background Section */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          className="relative block w-full h-12 sm:h-16 md:h-20 lg:h-24 text-white"
          viewBox="0 0 1440 120"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,36 C320,115 720,115 1080,48 C1260,18 1380,26 1440,36 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
