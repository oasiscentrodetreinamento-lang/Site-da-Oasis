import React from 'react';
import { NavLink } from '../types';
import Editable from './Editable';

const Hero: React.FC = () => {
  return (
    <section id={NavLink.HOME} className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Editable 
          id="hero-bg" 
          type="image" 
          editButtonPosition="bottom-right"
          className="w-full h-full object-cover object-center grayscale"
          defaultContent="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-0 md:mt-16 flex flex-col items-center">
        <h2 className="text-brand font-bold uppercase tracking-[0.2em] mb-3 md:mb-4 animate-fade-in-up text-sm md:text-base">Bem-vindo à Oasis</h2>
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-white mb-6 leading-[0.9] uppercase animate-fade-in-up delay-100">
          <Editable 
             id="hero-title" 
             defaultContent={'Centro de \nTreinamento'} 
             className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent block"
          />
        </h1>
        <div className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200 px-2">
           <Editable 
             id="hero-subtitle" 
             type="textarea"
             defaultContent="Pilates, Spinning, Jump e Dança. Foco total em atendimento personalizado para transformar corpo e mente." 
           />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center animate-fade-in-up delay-300 px-4">
          <button 
            onClick={() => document.getElementById(NavLink.MEMBERSHIP)?.scrollIntoView({behavior: 'smooth'})}
            className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-slate-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)] active:scale-95"
          >
            Ver Nossos Planos
          </button>
          <button 
             onClick={() => document.getElementById(NavLink.TRAINER)?.scrollIntoView({behavior: 'smooth'})} 
             className="w-full sm:w-auto bg-slate-800/50 border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all backdrop-blur-sm active:scale-95"
          >
            Gerar Treino Online
          </button>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;