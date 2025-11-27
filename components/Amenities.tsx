import React from 'react';
import Editable from './Editable';

const amenitiesList = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    idPrefix: 'amenities-trainers'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 13v6m-3-4v4m-3-5v5m-3-3v3m9-11v-.5A2.5 2.5 0 0013.5 3h-5A2.5 2.5 0 006 5.5V11a2 2 0 002 2h9a2 2 0 002-2V9.5z" />
      </svg>
    ),
    idPrefix: 'amenities-showers'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    idPrefix: 'amenities-kids'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    idPrefix: 'amenities-wifi'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    idPrefix: 'amenities-store'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4" /> 
         {/* Car icon equivalent */}
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    idPrefix: 'amenities-parking'
  }
];

const Amenities: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-brand font-bold uppercase tracking-widest mb-2 text-sm md:text-base">
            Infraestrutura
          </h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-white uppercase mb-4">
             <Editable id="amenities-title" defaultContent="Estrutura Completa" />
          </h3>
          <p className="max-w-2xl mx-auto text-slate-400">
             <Editable type="textarea" id="amenities-subtitle" defaultContent="Muito mais do que apenas equipamentos. Pensamos em cada detalhe para sua comodidade e conforto." />
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenitiesList.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-brand/30 transition-all group">
              <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-brand mb-6 shadow-lg border border-slate-700 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-white uppercase mb-3 font-display tracking-wide">
                <Editable id={`${item.idPrefix}-title`} defaultContent="Título" />
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                 <Editable type="textarea" id={`${item.idPrefix}-desc`} defaultContent="Descrição..." />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;