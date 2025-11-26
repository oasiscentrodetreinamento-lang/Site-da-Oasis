import React, { useState } from 'react';
import { NavLink } from '../types';
import Editable from './Editable';

const classes = [
  {
    title: 'Mat Pilates',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    description: 'Fortalecimento do core e flexibilidade através de movimentos controlados no solo.',
    details: 'O Mat Pilates é a versão clássica do método, realizada no solo sobre um tapete (mat). Utiliza o peso do próprio corpo e acessórios como bolas e elásticos para desafiar a gravidade. O foco é o "Powerhouse" (centro de força abdominal), promovendo alinhamento postural e consciência corporal.',
    recommendedFor: [
      'Alívio de dores nas costas e melhora da postura.',
      'Definição abdominal e fortalecimento do core.',
      'Aumento da flexibilidade e mobilidade articular.',
      'Redução do estresse através da respiração controlada.'
    ],
    id: 'class-img-0'
  },
  {
    title: 'Spinning',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'Pedale com alta intensidade ao som de músicas motivadoras.',
    details: 'Uma aula de ciclismo indoor eletrizante, guiada por instrutores que simulam percursos de subidas, descidas e tiros de velocidade, tudo sincronizado com músicas de alta energia. É um treino intervalado que desafia seus limites cardiovasculares.',
    recommendedFor: [
      'Queima calórica acelerada (até 700kcal/hora).',
      'Melhora drástica do condicionamento cardiovascular.',
      'Fortalecimento e tonificação de pernas e glúteos.',
      'Quem busca um treino dinâmico e sem impacto nas articulações.'
    ],
    id: 'class-img-1'
  },
  {
    title: 'Jump',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=2070&auto=format&fit=crop',
    description: 'Aula aeróbica divertida e intensa utilizando mini trampolins.',
    details: 'O Jump é uma aula coreografada realizada sobre um mini trampolim. A superfície elástica absorve cerca de 80% do impacto, tornando o exercício seguro para as articulações enquanto oferece um trabalho cardiovascular intenso e muito divertido.',
    recommendedFor: [
      'Auxílio poderoso na drenagem linfática e combate à celulite.',
      'Melhora do equilíbrio e coordenação motora.',
      'Fortalecimento da musculatura inferior e core.',
      'Quem quer emagrecer se divertindo.'
    ],
    id: 'class-img-2'
  },
  {
    title: 'Stepdance',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop',
    description: 'Coreografias rítmicas utilizando o step para queimar calorias e tonificar.',
    details: 'Uma fusão de exercício aeróbico com dança, utilizando uma plataforma (step). Você sobe e desce do step seguindo coreografias rítmicas que estimulam a memória, a coordenação e o ritmo, proporcionando um gasto calórico elevado.',
    recommendedFor: [
      'Tonificação intensa de coxas, panturrilhas e glúteos.',
      'Melhora da coordenação motora e memória cognitiva.',
      'Aumento da resistência física.',
      'Quem gosta de dançar e quer fugir da rotina tradicional.'
    ],
    id: 'class-img-3'
  }
];

const schedule = [
  {
    day: 'Segunda-Feira',
    events: [
      { time: '07:00', name: 'Mat Pilates' },
      { time: '16:00', name: 'Mat Pilates' },
      { time: '19:00', name: 'Spinning' },
      { time: '20:00', name: 'Mat Pilates' },
    ]
  },
  {
    day: 'Terça-Feira',
    events: [
      { time: '07:00', name: 'Spinning' },
      { time: '18:00', name: 'Jump' },
      { time: '19:30', name: 'Stepdance' },
      { time: '20:30', name: 'Mat Pilates' },
    ]
  },
  {
    day: 'Quarta-Feira',
    events: [
      { time: '08:00', name: 'Spinning' },
      { time: '16:00', name: 'Mat Pilates' },
      { time: '19:00', name: 'Spinning' },
      { time: '20:00', name: 'Mat Pilates' },
    ]
  },
  {
    day: 'Quinta-Feira',
    events: [
      { time: '08:00', name: 'Spinning' },
      { time: '18:00', name: 'Jump' },
      { time: '19:30', name: 'Stepdance' },
      { time: '20:30', name: 'Mat Pilates' },
    ]
  },
  {
    day: 'Sexta-Feira',
    events: [
      { time: '08:00', name: 'Spinning' },
      { time: '16:00', name: 'Mat Pilates' },
      { time: '19:00', name: 'Spinning' },
      { time: '20:00', name: 'Mat Pilates' },
    ]
  }
];

const Classes: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<typeof classes[0] | null>(null);

  return (
    <section id={NavLink.CLASSES} className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-brand font-bold uppercase tracking-widest mb-2">Nossas Modalidades</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">
              Mova-se com <span className="text-white">Energia</span>
            </h3>
          </div>
        </div>

        {/* Class Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {classes.map((cls, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedClass(cls)}
              className="group relative h-96 rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-brand transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]"
            >
              <Editable 
                id={cls.id} 
                type="image" 
                defaultContent={cls.defaultImage}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-brand text-xs font-bold uppercase tracking-wider block">{cls.time}</span>
                   <span className="bg-brand text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      SAIBA MAIS
                   </span>
                </div>
                <h4 className="text-2xl font-display font-bold text-white uppercase mb-2 group-hover:text-brand transition-colors">{cls.title}</h4>
                <p className="text-slate-300 text-sm line-clamp-2">
                  {cls.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Table */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-display font-bold text-white uppercase">Grade de modalidades</h3>
            <div className="w-20 h-1 bg-brand mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {schedule.map((day, idx) => (
              <div key={idx} className="bg-slate-950/50 rounded-xl p-6 border border-slate-800/50 hover:border-brand/30 transition-all hover:bg-slate-800/50 flex flex-col h-full">
                <h4 className="text-brand font-bold uppercase tracking-wider mb-6 pb-2 border-b border-slate-800 text-center">
                  {day.day}
                </h4>
                <ul className="space-y-4 flex-1">
                  {day.events.map((event, evtIdx) => (
                    <li key={evtIdx} className="flex justify-between items-center group">
                      <span className="text-slate-400 font-mono text-sm bg-slate-900 px-2 py-1 rounded border border-slate-800 group-hover:text-brand group-hover:border-brand/30 transition-colors">
                        {event.time}
                      </span>
                      <span className="text-white font-bold uppercase text-xs tracking-wide text-right">
                        {event.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-xs mt-8 italic">
            * A grade de horários está sujeita a alterações. Consulte a recepção.
          </p>
        </div>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedClass(null)}
        >
          <div 
            className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-brand/20 shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-brand hover:text-slate-900 text-white p-2 rounded-full transition-colors"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Image Side */}
            <div className="md:w-2/5 h-64 md:h-auto relative">
               <Editable 
                  id={selectedClass.id} 
                  type="image" 
                  defaultContent={selectedClass.defaultImage}
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
               <div className="absolute bottom-4 left-4 md:hidden">
                  <h3 className="text-3xl font-display font-bold text-white uppercase">{selectedClass.title}</h3>
               </div>
            </div>

            {/* Content Side */}
            <div className="md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
               <h3 className="hidden md:block text-4xl font-display font-bold text-white uppercase mb-4 text-brand-gradient">
                 {selectedClass.title}
               </h3>
               
               <div className="mb-8">
                 <h4 className="text-brand font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Sobre a Atividade
                 </h4>
                 <p className="text-slate-300 leading-relaxed text-lg">
                    {selectedClass.details}
                 </p>
               </div>

               <div>
                 <h4 className="text-brand font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recomendado Para
                 </h4>
                 <ul className="space-y-3">
                    {selectedClass.recommendedFor.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0"></div>
                         <span className="text-slate-200">{rec}</span>
                      </li>
                    ))}
                 </ul>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-800">
                  <button 
                    onClick={() => { setSelectedClass(null); document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="w-full bg-brand hover:bg-brand-dark text-slate-900 font-bold py-3 rounded-lg uppercase tracking-wider transition-colors"
                  >
                     Começar a Treinar
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Classes;