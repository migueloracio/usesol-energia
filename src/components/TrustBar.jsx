import React from 'react';
import { Sun, Award, MapPin, ShieldCheck } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: Sun,
      title: "+250",
      subtitle: "sistemas instalados",
      description: "Famílias e empresas que já economizam."
    },
    {
      icon: Award,
      title: "5 anos",
      subtitle: "de experiência",
      description: "No mercado de energia solar."
    },
    {
      icon: MapPin,
      title: "Alto Tietê",
      subtitle: "e região",
      description: "Atendimento próximo e personalizado."
    },
    {
      icon: ShieldCheck,
      title: "Garantia",
      subtitle: "no seu sistema",
      description: "Mais segurança para o seu investimento."
    }
  ];

  return (
    <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-2 transition-transform hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-theme-accent-light border border-theme-accent-border flex items-center justify-center shrink-0 text-theme-primary">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {item.title}
                    </span>
                    <span className="text-sm font-bold text-slate-800 -mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
