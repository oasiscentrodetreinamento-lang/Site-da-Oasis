import React, { useState } from 'react';
import Editable from './Editable';

const trainersList = [
  { id: 1, color: '#FACC15' }, // Brand Yellow - Diego
  { id: 2, color: '#34D399' }, // Emerald Green - Luiz
  { id: 3, color: '#22D3EE' }, // Cyan - Arthur
  { id: 4, color: '#60A5FA' }, // Blue - Mateus
  { id: 5, color: '#A78BFA' }, // Purple - Taynan
  { id: 6, color: '#FB923C' }, // Orange - Igor
  { id: 7, color: '#F472B6' }, // Pink - Amanda
];

const Trainers: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);

  const activeTrainer = selectedTrainer ? trainersList.find(t => t.id === selectedTrainer) : null;

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-brand font-bold uppercase tracking-widest mb-2 text-sm md:text-base">
            Especialistas
          </h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-white uppercase mb-4">
             <Editable id="trainers-title" defaultContent="Nosso Time" />
          </h3>
          <p className="max-w-2xl mx-auto text-slate-400">
             <Editable type="textarea" id="trainers-subtitle" defaultContent="Profissionais apaixonados, qualificados e prontos para te levar ao próximo nível." />
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {trainersList.map((trainer) => (
             <div 
               key={trainer.id}
               onClick={() => setSelectedTrainer(trainer.id)}
               className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] border border-slate-800 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-2"
               style={{ 
                  '--trainer-color': trainer.color 
               } as React.CSSProperties}
             >
                {/* Image */}
                <div className="absolute inset-0">
                   <Editable 
                      id={`trainer-${trainer.id}-img`} 
                      type="image" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      defaultContent="" // Content provided by Context defaults
                   />
                </div>
                
                {/* Gradient Overlay - Subtle bottom only for text legibility */}
                <div 
                   className="absolute inset-0 pointer-events-none"
                   style={{
                      background: `linear-gradient(to top, #0F172A 10%, transparent 40%)`
                   }}
                ></div>

                {/* Border Effect */}
                <div 
                   className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-[var(--trainer-color)] rounded-2xl pointer-events-none"
                ></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 w-full pointer-events-none">
                    <div 
                       className="w-8 h-1 mb-2 rounded transition-all duration-300 group-hover:w-16"
                       style={{ backgroundColor: trainer.color }}
                    ></div>
                    <h4 className="text-xl font-display font-bold text-white uppercase mb-1 pointer-events-auto">
                       <Editable id={`trainer-${trainer.id}-name`} defaultContent="Nome" />
                    </h4>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors pointer-events-auto">
                       <Editable id={`trainer-${trainer.id}-role`} defaultContent="Cargo" />
                    </p>
                </div>
             </div>
           ))}
        </div>

      </div>

      {/* Expanded Modal */}
      {selectedTrainer && activeTrainer && (
         <div 
           className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
           onClick={() => setSelectedTrainer(null)}
         >
            <div 
               className="bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-slate-800"
               style={{ boxShadow: `0 0 50px ${activeTrainer.color}20` }}
               onClick={(e) => e.stopPropagation()}
            >
               {/* Close Button */}
               <button 
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-white hover:text-slate-900 text-white p-2 rounded-full transition-colors"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>

               {/* Image Side */}
               <div className="md:w-1/2 h-64 md:h-auto relative">
                   <Editable 
                      id={`trainer-${activeTrainer.id}-img`} 
                      type="image" 
                      className="w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r pointer-events-none"></div>
               </div>

               {/* Info Side */}
               <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span 
                     className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                     style={{ color: activeTrainer.color }}
                  >
                     <Editable id={`trainer-${activeTrainer.id}-role`} defaultContent="Cargo" />
                  </span>
                  
                  <h3 className="text-4xl font-display font-bold text-white uppercase mb-6 leading-none">
                     <Editable id={`trainer-${activeTrainer.id}-name`} defaultContent="Nome" />
                  </h3>

                  <div className="w-20 h-1.5 rounded-full mb-8" style={{ backgroundColor: activeTrainer.color }}></div>

                  <div className="prose prose-invert prose-sm text-slate-300 mb-8">
                     <Editable type="textarea" id={`trainer-${activeTrainer.id}-bio`} defaultContent="Bio..." />
                  </div>

                  <button 
                     className="self-start px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all transform hover:scale-105 active:scale-95 text-slate-900"
                     style={{ backgroundColor: activeTrainer.color }}
                  >
                     Agendar Aula
                  </button>
               </div>
            </div>
         </div>
      )}
    </section>
  );
};

export default Trainers;