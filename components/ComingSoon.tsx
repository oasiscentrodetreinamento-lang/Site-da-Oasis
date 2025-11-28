import React, { useState } from 'react';
import Editable from './Editable';

const ComingSoon: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleTab = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <section className="relative z-40 bg-slate-950">
      {/* Caution Tape Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer relative h-28 md:h-20 overflow-hidden group shadow-xl border-y-4 border-slate-900 flex items-center"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #FACC15, #FACC15 30px, #0F172A 30px, #0F172A 60px)'
        }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-900 border-2 border-brand transform -skew-x-12 px-4 md:px-8 py-2 shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110 text-center">
                <h3 className="text-xl md:text-3xl font-display font-bold text-brand uppercase tracking-widest transform skew-x-12 flex flex-col md:flex-row items-center gap-2 md:gap-3 leading-tight">
                    <span className="hidden md:inline animate-pulse">⚠️</span>
                    <span>Área Interditada: Obras</span>
                    <span className="text-white text-xs md:text-lg bg-brand/20 px-2 py-1 rounded normal-case font-sans tracking-normal opacity-100">
                        (Clique para Espiar)
                    </span>
                    <span className="hidden md:inline animate-pulse">⚠️</span>
                </h3>
            </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div 
        className={`transition-all duration-700 ease-in-out overflow-hidden bg-slate-900 ${
          isExpanded ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-800">
            <div className="text-center mb-12">
                <span className="text-brand text-sm font-bold uppercase tracking-[0.3em] mb-2 block animate-pulse">Spoiler Alert</span>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase mb-6">
                    <Editable id="news-title" defaultContent="EM BREVE: NOVO ESPAÇO OASIS" />
                </h2>
                <div className="max-w-3xl mx-auto text-slate-400 text-lg">
                    <Editable type="textarea" id="news-subtitle" defaultContent="Estamos expandindo! Confira o que vem por aí no nosso novo complexo esportivo." />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Swim */}
                <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Editable 
                            id="news-img-swim" 
                            type="image" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            defaultContent="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 pointer-events-none"></div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <div className="text-brand font-bold text-xs uppercase tracking-wider mb-2 bg-slate-800 inline-block px-2 py-1 rounded self-start">Piscinas</div>
                        <h3 className="text-2xl font-display font-bold text-white uppercase mb-2">Kids & Hidro</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            <Editable type="textarea" id="news-desc-swim" defaultContent="Piscinas aquecidas para Hidroginástica e metodologia lúdica exclusiva para Natação Kids." />
                        </p>

                        <div className="mt-auto">
                            <button 
                                onClick={() => toggleTab('swim')}
                                className="w-full flex justify-between items-center text-left text-sm font-bold text-white uppercase tracking-wider border-t border-slate-800 pt-4 hover:text-brand transition-colors"
                            >
                                <span>Ver Modalidades</span>
                                <svg className={`w-5 h-5 transform transition-transform ${activeTab === 'swim' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'swim' ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm">
                                    <Editable 
                                        type="textarea" 
                                        id="news-list-swim" 
                                        defaultContent={"• Natação Kids\n• Natação Bebê\n• Hidroginástica\n• Hidro Power"}
                                        className="leading-7"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fight */}
                <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Editable 
                            id="news-img-fight" 
                            type="image" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            defaultContent="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 pointer-events-none"></div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <div className="text-brand font-bold text-xs uppercase tracking-wider mb-2 bg-slate-800 inline-block px-2 py-1 rounded self-start">Artes Marciais</div>
                        <h3 className="text-2xl font-display font-bold text-white uppercase mb-2">Novo Dojo</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            <Editable type="textarea" id="news-desc-fight" defaultContent="Novo dojo profissional equipado para alta performance." />
                        </p>
                        
                        <div className="mt-auto">
                            <button 
                                onClick={() => toggleTab('fight')}
                                className="w-full flex justify-between items-center text-left text-sm font-bold text-white uppercase tracking-wider border-t border-slate-800 pt-4 hover:text-brand transition-colors"
                            >
                                <span>Ver Modalidades</span>
                                <svg className={`w-5 h-5 transform transition-transform ${activeTab === 'fight' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'fight' ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm">
                                    <Editable 
                                        type="textarea" 
                                        id="news-list-fight" 
                                        defaultContent={"• Jiu-Jitsu\n• Muay Thai\n• Boxe\n• Defesa Pessoal"}
                                        className="leading-7"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Dance */}
                 <div className="group relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Editable 
                            id="news-img-dance" 
                            type="image" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            defaultContent="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2070&auto=format&fit=crop"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 pointer-events-none"></div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <div className="text-brand font-bold text-xs uppercase tracking-wider mb-2 bg-slate-800 inline-block px-2 py-1 rounded self-start">Dança</div>
                        <h3 className="text-2xl font-display font-bold text-white uppercase mb-2">Studio de Dança</h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            <Editable type="textarea" id="news-desc-dance" defaultContent="Salas amplas com piso flutuante para diversas modalidades." />
                        </p>

                        <div className="mt-auto">
                            <button 
                                onClick={() => toggleTab('dance')}
                                className="w-full flex justify-between items-center text-left text-sm font-bold text-white uppercase tracking-wider border-t border-slate-800 pt-4 hover:text-brand transition-colors"
                            >
                                <span>Ver Modalidades</span>
                                <svg className={`w-5 h-5 transform transition-transform ${activeTab === 'dance' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeTab === 'dance' ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                <div className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm">
                                    <Editable 
                                        type="textarea" 
                                        id="news-list-dance" 
                                        defaultContent={"• Ballet Clássico\n• Jazz\n• Danças Urbanas\n• Fit Dance"}
                                        className="leading-7"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                 <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-slate-500 hover:text-white uppercase text-xs tracking-widest border-b border-transparent hover:border-brand pb-1 transition-all"
                 >
                    Fechar Novidades
                 </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;