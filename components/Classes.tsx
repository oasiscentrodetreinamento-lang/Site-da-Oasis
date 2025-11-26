import React from 'react';
import { NavLink } from '../types';
import Editable from './Editable';

const classes = [
  {
    title: 'Mat Pilates',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    description: 'Fortalecimento do core e flexibilidade através de movimentos controlados no solo.',
    id: 'class-img-0'
  },
  {
    title: 'Spinning',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    description: 'Pedale com alta intensidade ao som de músicas motivadoras.',
    id: 'class-img-1'
  },
  {
    title: 'Jump',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=2070&auto=format&fit=crop',
    description: 'Aula aeróbica divertida e intensa utilizando mini trampolins.',
    id: 'class-img-2'
  },
  {
    title: 'Stepdance',
    time: 'Ver Grade de Horários',
    defaultImage: 'https://images.unsplash.com/photo-1535525266638-c5f718b58256?q=80&w=1767&auto=format&fit=crop',
    description: 'Coreografias rítmicas utilizando o step para queimar calorias e tonificar.',
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
            <div key={idx} className="group relative h-96 rounded-xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800 hover:border-brand transition-colors">
              <Editable 
                id={cls.id} 
                type="image" 
                defaultContent={cls.defaultImage}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                <span className="text-brand text-xs font-bold uppercase tracking-wider mb-2 block">{cls.time}</span>
                <h4 className="text-2xl font-display font-bold text-white uppercase mb-2 group-hover:text-brand transition-colors">{cls.title}</h4>
                <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
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
    </section>
  );
};

export default Classes;