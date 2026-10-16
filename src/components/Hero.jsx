import React, { useState, useEffect } from 'react';
import {
  Calculator,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Home,
  Building2,
  TrendingUp,
  MessageCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Hero() {
  const [billAmount, setBillAmount] = useState(650);
  const [propertyType, setPropertyType] = useState('residencial');
  const [city, setCity] = useState('Ferraz de Vasconcelos');
  const [detectedCity, setDetectedCity] = useState('');

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

  // Detecção inteligente da cidade do visitante via IP (sem pedir permissão invasiva)
  useEffect(() => {
    let isMounted = true;

    const resolveLocation = (cityRaw, orgRaw) => {
      const org = (orgRaw || '').toLowerCase();
      const city = (cityRaw || '').trim();

      // Provedores locais de fibra de Ferraz de Vasconcelos (ex: Tera Soluções, Telex Fibra, ASN 271023)
      if (org.includes('tera') || org.includes('telex') || org.includes('271023')) {
        return 'Ferraz de Vasconcelos';
      }

      // Se a base de dados de IP retornar o nome macro "Região Metropolitana de São Paulo"
      const lower = city.toLowerCase();
      if (lower.includes('metropolitana') || lower.includes('região') || lower.includes('regiao')) {
        return 'Alto Tietê';
      }

      return city;
    };

    const detectCity = async () => {
      // 1ª Tentativa: geojs.io (rápida e precisa em cidades do Brasil)
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (res.ok) {
          const data = await res.json();
          const cleanCity = resolveLocation(data.city, data.organization_name || data.organization);
          if (cleanCity && isMounted) {
            setDetectedCity(cleanCity);
            const found = citiesList.find((c) =>
              c.toLowerCase().includes(cleanCity.toLowerCase())
            );
            if (found) {
              setCity(found);
            }
            return;
          }
        }
      } catch {
        // Fallback silencioso
      }

      // 2ª Tentativa: ipwho.is
      try {
        const res = await fetch('https://ipwho.is/?lang=pt-BR');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && isMounted) {
            const org = data.connection ? (data.connection.isp || data.connection.org) : '';
            const cleanCity = resolveLocation(data.city, org);
            if (cleanCity) {
              setDetectedCity(cleanCity);
              const found = citiesList.find((c) =>
                c.toLowerCase().includes(cleanCity.toLowerCase())
              );
              if (found) {
                setCity(found);
              }
              return;
            }
          }
        }
      } catch {
        // Fallback silencioso
      }
    };

    detectCity();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cálculos de energia solar no Brasil
  const estimatedNewBill = Math.max(propertyType === 'residencial' ? 65 : 150, Math.round(billAmount * 0.08));
  const monthlySavings = Math.max(0, billAmount - estimatedNewBill);
  const yearlySavings = monthlySavings * 12;

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
    <section id="inicio" className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 sm:pb-20 lg:pt-36 lg:pb-28 flex flex-col justify-center overflow-hidden bg-slate-950">
      {/* Background Video / Sunset Solar Photography (Always in background on Desktop & Mobile) */}
      <div className="absolute inset-x-0 top-0 h-[800px] sm:h-[860px] lg:h-full lg:inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-bg.jpg"
          className="w-full h-full object-cover object-[50%_35%] lg:object-center transform-gpu will-change-transform"
        >
          <source src="/Animating_bg_Usesol.mp4" type="video/mp4" />
          <img
            src="/hero-bg.jpg"
            alt="Casa moderna com sistema de energia solar fotovoltaica no telhado - Use Sol Energia"
            className="w-full h-full object-cover object-[50%_35%] lg:object-center"
          />
        </video>

        {/* Desktop Gradient: Left side dark vignette for readable text, Center 100% OPEN for solar house, Right subtle behind card */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 via-30% to-transparent via-65% to-slate-950/45" />

        {/* Mobile Gradient: Top vignette for text readability, open middle for house, bottom fade into dark */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/20 via-40% to-slate-950" />

        {/* Top Navbar Shadow */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />

        {/* Bottom Transition */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">

          {/* Left Column: Value Proposition & Copy (Pushed far to the left) */}
          <div className="w-full lg:max-w-[480px] xl:max-w-[530px] shrink-0 space-y-6 text-left">

            {/* Regional Badge / Kicker com Detecção Dinâmica de Cidade */}
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-bold tracking-wider text-theme-kicker uppercase drop-shadow-sm bg-theme-accent-light px-3.5 py-1.5 rounded-full border border-theme-accent-border inline-flex items-center gap-1.5 transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>
                  {detectedCity && !detectedCity.toLowerCase().includes('alto tietê')
                    ? `ENERGIA SOLAR EM ${detectedCity.toUpperCase()}`
                    : 'ENERGIA SOLAR NO ALTO TIETÊ'}
                </span>
              </span>
            </div>

            {/* Main Headline (Clean 3-line cadence like Driveo) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
              Sua conta de luz<br />
              <span className="text-theme-primary">pode custar menos.</span><br />
              Economize até 95%.
            </h1>

            {/* Subtitle with direct problem-solution */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed drop-shadow-sm">
              Gere sua própria energia e livre-se dos aumentos constantes. Projeto, instalação técnica e homologação para residências e empresas no Alto Tietê.
            </p>

            {/* Double Action Buttons (Driveo Pattern - Descidos no mobile para destacar a casa e posicionar na piscina) */}
            <div className="pt-24 sm:pt-28 lg:pt-4 mt-6 sm:mt-8 lg:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <a
                href={`https://wa.me/5511994333471?text=${encodeURIComponent(
                  detectedCity
                    ? `Olá! Sou de ${detectedCity} e gostaria de calcular minha economia com energia solar na Use Sol.`
                    : 'Olá! Gostaria de calcular minha economia com energia solar no Alto Tietê.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-theme-primary hover:bg-theme-primary-hover text-theme-primary-text font-bold text-sm sm:text-base px-6 sm:px-7 py-3.5 sm:py-4 rounded-full shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Simular no WhatsApp</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#apresentacao"
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-3.5 sm:py-4 rounded-full backdrop-blur-md border border-white/20 transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                </span>
                <span>Como Funciona</span>
              </a>
            </div>

            {/* Trust Micro-Bullets (Desktop) */}
            <div className="hidden lg:grid pt-4 grid-cols-3 gap-3 text-slate-200 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-theme-primary shrink-0" />
                <span><strong className="text-white">Simulação gratuita</strong><br /><span className="text-slate-400">Sem compromisso</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-theme-primary shrink-0" />
                <span><strong className="text-white">Atendimento local</strong><br /><span className="text-slate-400">Alto Tietê e região</span></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-theme-primary shrink-0" />
                <span><strong className="text-white">Equipe especializada</strong><br /><span className="text-slate-400">Do projeto à instalação</span></span>
              </div>
            </div>

          </div>

          {/* Mobile Spacer: Respiro suave antes do card da calculadora */}
          <div className="lg:hidden h-8 sm:h-12 w-full pointer-events-none" />

          {/* Right Column: Lead-First Interactive Simulator Card (Pushed far to the right) */}
          <div className="w-full lg:max-w-[420px] xl:max-w-[460px] shrink-0 lg:ml-auto" id="simulador">
            <div className="relative bg-white text-slate-900 rounded-[32px] p-6 sm:p-7 shadow-2xl shadow-black/50 border border-slate-100 transition-all">

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
