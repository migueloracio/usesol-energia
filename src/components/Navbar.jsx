import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { MessageCircle, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = "https://wa.me/5511994333471?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Use%20Sol%20e%20gostaria%20de%20falar%20com%20um%20especialista.";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#02140D]/90 backdrop-blur-md border-b border-emerald-950/60 py-3 shadow-lg shadow-black/30' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Logo isDark={true} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <a href="#inicio" className="text-sm font-semibold text-white transition-colors relative py-1">
              Início
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            </a>
            <a href="#apresentacao" className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors py-1">
              Vídeo
            </a>
            <a href="#galeria" className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors py-1">
              Galeria 3D
            </a>
            <a href="#solucoes" className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors py-1 inline-flex items-center gap-1">
              <span>Soluções</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </a>
            <a href="#projetos" className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors py-1">
              Projetos
            </a>
            <a href="#duvidas" className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors py-1">
              Dúvidas
            </a>
            <a href="#contato" className="text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors py-1">
              Contato
            </a>
          </nav>

          {/* Controls: Desktop CTA */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop CTA Button */}
            <div className="hidden sm:flex items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary-hover text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-black/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Fale com um especialista</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-black/30 focus:outline-none"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-6 pt-3 px-4 rounded-2xl bg-[#02140D]/95 backdrop-blur-xl border border-emerald-900/60 shadow-2xl flex flex-col gap-3">
            <a 
              href="#inicio" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-emerald-900/40"
            >
              Início
            </a>
            <a 
              href="#apresentacao" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-900/40"
            >
              Vídeo Apresentação
            </a>
            <a 
              href="#galeria" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-900/40"
            >
              Galeria 3D de Instalações
            </a>
            <a 
              href="#solucoes" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-900/40"
            >
              Soluções
            </a>
            <a 
              href="#projetos" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-900/40"
            >
              Projetos & Casos Reais
            </a>
            <a 
              href="#duvidas" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-900/40"
            >
              Dúvidas
            </a>
            <a 
              href="#contato" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-900/40"
            >
              Contato
            </a>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#005a36] hover:bg-[#00472b] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
