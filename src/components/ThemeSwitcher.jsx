import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher({ className = "" }) {
  const { theme, setTheme } = useTheme();

  return (
    <div 
      className={`inline-flex items-center bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-lg select-none transition-all ${className}`}
      role="group"
      aria-label="Alternar identidade visual (Verde ou Laranja)"
    >
      {/* Botão Modo Verde */}
      <button
        type="button"
        onClick={() => setTheme('green')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          theme === 'green'
            ? 'bg-[#005a36] text-white shadow-md shadow-black/40 scale-105'
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        }`}
        title="Visualizar no Modo Verde Floresta"
      >
        <span className="text-xs">🌿</span>
        <span className="text-[11px] sm:text-xs">Verde</span>
      </button>

      {/* Botão Modo Laranja */}
      <button
        type="button"
        onClick={() => setTheme('orange')}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          theme === 'orange'
            ? 'bg-[#F7A838] text-slate-950 shadow-md shadow-amber-500/30 scale-105 font-black'
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        }`}
        title="Visualizar no Modo Laranja Solar (Uniforme & Marca)"
      >
        <span className="text-xs">☀️</span>
        <span className="text-[11px] sm:text-xs">Laranja</span>
      </button>
    </div>
  );
}
