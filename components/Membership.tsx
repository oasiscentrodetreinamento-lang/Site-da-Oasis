import React from 'react';
import { NavLink } from '../types';
import Editable from './Editable';

const Membership: React.FC = () => {
  return (
    <section id={NavLink.MEMBERSHIP} className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-brand font-bold uppercase tracking-widest mb-2">Junte-se ao Time</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">
            Escolha seu <span className="text-brand-accent">Plano</span>
          </h3>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Sem taxas de matrícula escondidas. Acesso total a todas as modalidades: Mat Pilates, Spinning, Jump e Stepdance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Plano Mensal */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-brand/50 transition-all flex flex-col">
            <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-4">Mensal</h4>
            <div className="text-4xl font-bold text-white mb-6">
                R$ <Editable id="price-monthly" defaultContent="149,90" type="price" />
                <span className="text-lg text-slate-500 font-normal">/mês</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Acesso 1x ao dia
              </li>
              <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Todas as Aulas em Grupo
              </li>
              <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                1 Consultoria de Treino
              </li>
              <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Sem fidelidade
              </li>
            </ul>
            <button className="w-full py-3 border border-slate-600 text-white rounded-lg font-bold uppercase hover:bg-slate-700 hover:text-brand transition-colors">Escolher Mensal</button>
          </div>

          {/* Plano Recorrente */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-brand/50 transition-all flex flex-col relative">
             <div className="absolute top-0 inset-x-0 -mt-3 flex justify-center">
               <span className="bg-slate-700 text-brand text-xs font-bold uppercase px-3 py-1 rounded-full border border-brand/30">Mais Flexibilidade</span>
            </div>
            <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-4 mt-2">Recorrente</h4>
            <div className="text-4xl font-bold text-white mb-6">
                R$ <Editable id="price-recurrent" defaultContent="149,90" type="price" />
                <span className="text-lg text-slate-500 font-normal">/mês</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 -mt-4 italic">Cobrança automática no cartão</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="font-bold text-brand-accent">Acesso Ilimitado (Várias vezes ao dia)</span>
              </li>
              <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Todas as Aulas em Grupo
              </li>
              <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                1 Consultoria de Treino
              </li>
               <li className="flex items-center text-slate-300">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Renovação Automática
              </li>
            </ul>
            <button className="w-full py-3 border border-slate-600 text-white rounded-lg font-bold uppercase hover:bg-slate-700 hover:text-brand transition-colors">Escolher Recorrente</button>
          </div>

          {/* Plano Anual - Highlighted */}
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-brand relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(250,204,21,0.15)] flex flex-col">
            <div className="absolute top-0 right-0 bg-brand text-slate-900 text-xs font-bold uppercase px-3 py-1 rounded-bl-lg rounded-tr-lg">Melhor Valor</div>
            <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider mb-4 text-brand">Anual</h4>
            <div className="text-4xl font-bold text-white mb-2">
                R$ <Editable id="price-annual" defaultContent="119,90" type="price" />
                <span className="text-lg text-slate-500 font-normal">/mês</span>
            </div>
             <p className="text-sm text-slate-400 mb-6">Total de R$ 1438,80 (12x no cartão)</p>
            
            <ul className="space-y-4 mb-8 flex-1">
               <li className="flex items-center text-white font-semibold">
                <svg className="w-5 h-5 text-brand-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                4 Avaliações Físicas Gratuitas
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Acesso Total e Ilimitado
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Todas as Aulas em Grupo
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Acesso ao Personal IA
              </li>
            </ul>
            <button className="w-full py-4 bg-brand hover:bg-brand-dark text-slate-900 rounded-lg font-bold uppercase transition-colors shadow-lg transform hover:scale-[1.02]">Garantir Oferta Anual</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Membership;