import React, { useState } from 'react';
import { NavLink, UserPreferences, WorkoutPlan } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { useAdmin } from '../contexts/AdminContext';

const AITrainer: React.FC = () => {
  const { currentUser, isAdmin, saveWorkout, openAuthModal, findTemplate, saveTemplate, templateCount } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [templateSavedSuccess, setTemplateSavedSuccess] = useState(false);
  const [source, setSource] = useState<'bank' | 'ai'>('bank');
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    goal: 'Ganhar Músculo',
    level: 'Intermediário',
    equipment: 'Academia Completa',
    duration: '60'
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setWorkout(null);
    setSavedSuccess(false);
    setTemplateSavedSuccess(false);
    
    // 1. Try to fetch from Template Bank first (Offline/Production safe)
    // We add a small artificial delay just to make the UI feel responsive/processed
    await new Promise(r => setTimeout(r, 800)); 

    const template = findTemplate(prefs);
    
    if (template) {
      setWorkout(template);
      setSource('bank');
      setLoading(false);
      return;
    }

    // 2. If no template found, try AI (Fallback)
    // Only admins might strictly need this to populate the bank, 
    // or if the bank is empty.
    try {
      const plan = await generateWorkoutPlan(prefs);
      if (plan) {
        // Tag the plan with the parameters so it can be saved as a template later
        const taggedPlan: WorkoutPlan = {
            ...plan,
            targetGoal: prefs.goal,
            targetLevel: prefs.level
        };
        setWorkout(taggedPlan);
        setSource('ai');
      } else {
        setError('Não foi possível gerar um plano específico neste momento. Tente mudar os parâmetros ou tente novamente mais tarde.');
      }
    } catch (e) {
      setError('Ocorreu um erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!workout) return;
    
    if (!currentUser) {
       openAuthModal();
       return;
    }

    saveWorkout(workout);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAsTemplate = () => {
      if (!workout || !isAdmin) return;
      saveTemplate(workout);
      setTemplateSavedSuccess(true);
      setTimeout(() => setTemplateSavedSuccess(false), 3000);
  };

  return (
    <section id={NavLink.TRAINER} className="py-24 bg-slate-900 relative">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-brand font-bold uppercase tracking-widest mb-2">Tecnologia e Performance</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase">
            Seu Assistente de Treino <span className="text-brand-accent">Virtual</span>
          </h3>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Complemente seu acompanhamento presencial. Obtenha um plano de treino extra instantaneamente, adaptado aos seus objetivos para os dias em que não puder vir ao CT.
          </p>
          {isAdmin && (
              <div className="mt-4 inline-block bg-slate-800 px-4 py-2 rounded-lg border border-brand/20">
                  <p className="text-brand text-xs font-bold uppercase">Painel Admin: {templateCount} Treinos no Banco</p>
              </div>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Controls */}
          <div className="lg:col-span-4 bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-xl">
            <h4 className="text-2xl font-display text-white mb-6 uppercase">Configure Seu Perfil</h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Objetivo Principal</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-brand focus:outline-none"
                  value={prefs.goal}
                  onChange={(e) => setPrefs({...prefs, goal: e.target.value})}
                >
                  <option>Ganhar Músculo</option>
                  <option>Perder Peso</option>
                  <option>Melhorar Resistência</option>
                  <option>Treino de Força</option>
                  <option>Mobilidade e Flexibilidade</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Nível de Experiência</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Iniciante', 'Intermediário', 'Avançado'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setPrefs({...prefs, level: lvl as any})}
                      className={`p-2 rounded-lg text-sm font-semibold transition-all ${prefs.level === lvl ? 'bg-brand text-slate-900 shadow-lg' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Equipamento</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-brand focus:outline-none"
                  value={prefs.equipment}
                  onChange={(e) => setPrefs({...prefs, equipment: e.target.value})}
                >
                  <option>Academia Completa</option>
                  <option>Apenas Halteres</option>
                  <option>Apenas Peso do Corpo</option>
                  <option>Academia em Casa (Básica)</option>
                </select>
              </div>

               <div>
                <label className="block text-slate-400 text-sm font-semibold mb-2">Duração (Minutos)</label>
                <input 
                  type="range" 
                  min="15" 
                  max="120" 
                  step="15" 
                  value={prefs.duration}
                  onChange={(e) => setPrefs({...prefs, duration: e.target.value})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="text-right text-brand font-bold mt-1">{prefs.duration} min</div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg flex justify-center items-center gap-2 ${loading ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand text-slate-900 transform hover:-translate-y-1 transition-all'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Gerando...</span>
                  </>
                ) : (
                  <>
                    <span>Gerar Treino</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-8 min-h-[400px] flex flex-col justify-center">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl text-center">
                {error}
              </div>
            )}

            {!workout && !loading && !error && (
              <div className="border-2 border-dashed border-slate-700 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center bg-slate-800/20">
                <div className="bg-slate-800 p-6 rounded-full mb-6 text-slate-500">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Pronto para Treinar?</h4>
                <p className="text-slate-400 max-w-md mx-auto">
                    Selecione suas preferências ao lado. Nosso sistema buscará o melhor treino para você em nosso banco de dados especializado.
                </p>
              </div>
            )}

            {loading && !workout && (
               <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                 <div className="flex space-x-2 mb-4">
                    <div className="w-4 h-4 bg-brand rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-brand rounded-full animate-bounce delay-100"></div>
                    <div className="w-4 h-4 bg-brand rounded-full animate-bounce delay-200"></div>
                 </div>
                 <p className="text-brand-accent font-mono animate-pulse">Buscando o melhor treino...</p>
               </div>
            )}

            {workout && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                {/* Workout Header */}
                <div className="bg-gradient-to-r from-brand to-brand-dark p-8 text-slate-900 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 22 16.29 20.57 14.86z"/></svg>
                   </div>
                   <div className="relative z-10">
                       <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                           <div>
                               <div className="flex justify-between items-start mb-2 gap-4">
                                   <h3 className="text-3xl font-display uppercase font-bold tracking-wide text-slate-900">{workout.planName}</h3>
                               </div>
                               <div className="flex flex-wrap gap-2 mb-4">
                                   <span className="bg-slate-900/20 px-3 py-1 rounded text-sm font-bold uppercase backdrop-blur-md border border-slate-900/20 text-slate-900 whitespace-nowrap">
                                   {workout.difficulty}
                                   </span>
                                   {source === 'ai' && (
                                       <span className="bg-white/30 px-3 py-1 rounded text-sm font-bold uppercase backdrop-blur-md text-slate-900 whitespace-nowrap">
                                           Gerado por IA
                                       </span>
                                   )}
                                   {source === 'bank' && (
                                       <span className="bg-white/30 px-3 py-1 rounded text-sm font-bold uppercase backdrop-blur-md text-slate-900 whitespace-nowrap flex items-center gap-1">
                                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                           Banco Oasis
                                       </span>
                                   )}
                               </div>
                           </div>
                           
                           {/* Action Buttons */}
                           <div className="flex flex-col gap-2">
                               <button 
                                   onClick={handleSave}
                                   className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                                       savedSuccess ? 'bg-green-600 text-white cursor-default' : 'bg-slate-900 text-brand hover:bg-slate-800'
                                   }`}
                               >
                                   {savedSuccess ? (
                                       <>
                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                           Salvo!
                                       </>
                                   ) : (
                                       <>
                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                           {currentUser ? 'Salvar no Perfil' : 'Entrar para Salvar'}
                                       </>
                                   )}
                               </button>

                               {isAdmin && source === 'ai' && (
                                   <button 
                                       onClick={handleSaveAsTemplate}
                                       className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all ${
                                           templateSavedSuccess ? 'bg-green-600 text-white cursor-default' : 'bg-white/20 text-slate-900 hover:bg-white/40'
                                       }`}
                                   >
                                       {templateSavedSuccess ? 'Salvo no Banco!' : 'Salvar como Modelo'}
                                   </button>
                               )}
                           </div>
                       </div>

                       <div className="flex gap-6 text-sm font-medium text-slate-800 border-t border-slate-900/10 pt-4">
                         <span className="flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           {workout.duration} Min
                         </span>
                          <span className="flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                           {workout.targetGoal || prefs.goal}
                         </span>
                       </div>
                   </div>
                </div>

                {/* Workout Body */}
                <div className="p-8 space-y-8">
                  {/* Warmup */}
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                    <h5 className="text-brand font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       Aquecimento
                    </h5>
                    <p className="text-slate-300">{workout.warmup}</p>
                  </div>

                  {/* Exercises */}
                  <div>
                     <h5 className="text-white font-bold uppercase tracking-wider text-lg mb-4 border-b border-slate-700 pb-2">Circuito Principal</h5>
                     <div className="space-y-4">
                       {workout.exercises.map((ex, idx) => (
                         <div key={idx} className="bg-slate-700/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 md:items-center justify-between hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                              <span className="bg-slate-800 text-brand w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm border border-brand/20">{idx + 1}</span>
                              <div>
                                <h6 className="text-white font-bold text-lg">{ex.name}</h6>
                                <p className="text-sm text-slate-400">{ex.notes}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 pl-12 md:pl-0">
                               <div className="text-center">
                                 <div className="text-brand font-bold text-lg">{ex.sets}</div>
                                 <div className="text-xs text-slate-500 uppercase">Séries</div>
                               </div>
                               <div className="w-px h-8 bg-slate-600"></div>
                               <div className="text-center">
                                 <div className="text-brand font-bold text-lg">{ex.reps}</div>
                                 <div className="text-xs text-slate-500 uppercase">Reps</div>
                               </div>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Cooldown */}
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
                    <h5 className="text-brand font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                       Desaquecimento
                    </h5>
                    <p className="text-slate-300">{workout.cooldown}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITrainer;