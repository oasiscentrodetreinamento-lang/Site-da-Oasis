import React from 'react';
import { NavLink } from '../types';
import Editable from './Editable';

const Hero: React.FC = () => {
  return (
    <section id={NavLink.HOME} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Editable 
          id="hero-bg" 
          type="image" 
          className="w-full h-full object-cover object-center grayscale"
          defaultContent="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <h2 className="text-brand font-bold uppercase tracking-[0.2em] mb-4 animate-fade-in-up">Bem-vindo à Oasis</h2>
        <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 leading-tight uppercase animate-fade-in-up delay-100">
          <Editable 
             id="hero-title" 
             defaultContent={'Centro de \nTreinamento'} 
             className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent block"
          />
        </h1>
        <div className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
           <Editable 
             id="hero-subtitle" 
             type="textarea"
             defaultContent="Pilates, Spinning, Jump e Dança. Foco total em atendimento personalizado para transformar corpo e mente." 
           />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <button 
            onClick={() => document.getElementById(NavLink.MEMBERSHIP)?.scrollIntoView({behavior: 'smooth'})}
            className="bg-brand hover:bg-brand-dark text-slate-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
          >
            Ver Nossos Planos
          </button>
          <button onClick={() => document.getElementById(NavLink.TRAINER)?.scrollIntoView({behavior: 'smooth'})} className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all backdrop-blur-sm">
            Testar Personal IA
          </button>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default Hero;