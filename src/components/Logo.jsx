import React from 'react';

export default function Logo({ className = "h-10", isDark = true }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sun Icon */}
      <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 shadow-sm shrink-0">
        <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400">
          <g transform="translate(50, 50)">
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(0)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(45)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(90)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(135)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(180)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(225)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(270)"/>
            <polygon points="-8,-34 8,-34 11,-24 -11,-24" transform="rotate(315)"/>
            <circle r="13" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            use
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            sol
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-theme-kicker">
          energia renovável
        </span>
      </div>
    </div>
  );
}
