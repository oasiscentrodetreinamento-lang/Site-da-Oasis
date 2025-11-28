import React, { useState, useEffect } from 'react';
import { NavLink, WorkoutPlan } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import Editable from './Editable';

interface NavbarProps {
  onNavigate: (view: 'home' | 'blog', sectionId?: string) => void;
  currentView: 'home' | 'blog';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const { currentUser, logout, openAuthModal, deleteWorkout } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [workoutsModalOpen, setWorkoutsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === NavLink.BLOG) {
      onNavigate('blog');
    } else {
      onNavigate('home', id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || currentView === 'blog' || mobileMenuOpen ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group z-50 h-16 w-48 relative" onClick={() => handleLinkClick(NavLink.HOME)}>
             <Editable 
                id="navbar-logo" 
                type="image" 
                defaultContent="https://placehold.co/200x80/0f172a/FACC15?text=SUA+LOGO+AQUI"
                className="w-full h-full object-contain object-left transition-transform group-hover:scale-105"
             />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {[
              { id: NavLink.HOME, label: 'Início' },
              { id: NavLink.BLOG, label: 'Blog' },
              { id: NavLink.CLASSES, label: 'Aulas' },
              { id: NavLink.TRAINER, label: 'Treino Digital' },
              { id: NavLink.MEMBERSHIP, label: 'Planos' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm uppercase tracking-widest font-semibold transition-colors ${
                  (currentView === 'blog' && link.id === NavLink.BLOG) || (currentView === 'home' && link.id === NavLink.HOME && !scrolled) 
                    ? 'text-brand' 
                    : 'text-slate-300 hover:text-brand'
                }`}
              >
                {link.label}
              </button>
            ))}
            
            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 py-1 pl-1 pr-4 rounded-full transition-colors border border-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-brand text-slate-900 font-bold flex items-center justify-center text-xs">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="text-sm font-bold text-white truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-xl shadow-xl border border-slate-700 overflow-hidden py-1">
                    <button 
                      onClick={() => { setWorkoutsModalOpen(true); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      Meus Treinos
                    </button>
                    <div className="border-t border-slate-800 my-1"></div>
                    <button 
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={openAuthModal}
                className="bg-brand hover:bg-brand-dark text-slate-900 px-6 py-2 rounded-full font-bold uppercase text-sm tracking-wide transition-all transform hover:scale-105"
              >
                Entrar / Cadastrar
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 z-50">
            {currentUser && (
               <div 
                  onClick={() => setWorkoutsModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-brand text-slate-900 font-bold flex items-center justify-center text-xs cursor-pointer active:scale-90 transition-transform"
                >
                  {getInitials(currentUser.name)}
               </div>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 focus:outline-none">
              <svg className="w-8 h-8 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'none' }}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-slate-950/95 backdrop-blur-xl transition-all duration-500 ease-in-out md:hidden flex items-center justify-center z-40 ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
        >
            <div className="flex flex-col p-8 space-y-6 w-full max-w-sm text-center">
              {[
                { id: NavLink.HOME, label: 'Início' },
                { id: NavLink.BLOG, label: 'Blog' },
                { id: NavLink.CLASSES, label: 'Aulas' },
                { id: NavLink.TRAINER, label: 'Treino Digital' },
                { id: NavLink.MEMBERSHIP, label: 'Planos' },
              ].map((link, idx) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  className={`text-3xl font-display uppercase tracking-widest transition-all duration-300 transform ${
                     mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } ${
                    (currentView === 'blog' && link.id === NavLink.BLOG) ? 'text-brand' : 'text-slate-300 active:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className={`pt-8 w-full transition-all duration-500 delay-300 transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                {!currentUser ? (
                  <button 
                    onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                    className="bg-brand text-slate-900 py-4 rounded-xl text-center font-bold uppercase w-full shadow-lg active:scale-95 transition-transform"
                  >
                    Entrar / Cadastrar
                  </button>
                ) : (
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="bg-slate-800 text-red-400 py-4 rounded-xl text-center font-bold uppercase w-full border border-slate-700 active:scale-95 transition-transform"
                  >
                    Sair da Conta
                  </button>
                )}
              </div>
            </div>
        </div>
      </nav>

      {/* Saved Workouts Modal */}
      {workoutsModalOpen && currentUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
           <div className="bg-slate-900 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[85vh] sm:rounded-2xl border-0 sm:border border-slate-700 shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 rounded-t-2xl z-10">
                 <h3 className="text-2xl font-display font-bold text-white uppercase">Meus Treinos Salvos</h3>
                 <button onClick={() => setWorkoutsModalOpen(false)} className="text-slate-500 hover:text-white p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                 {currentUser.savedWorkouts.length === 0 ? (
                    <div className="text-center py-20">
                       <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                       </div>
                       <h4 className="text-white text-xl font-bold mb-2">Nenhum treino salvo</h4>
                       <p className="text-slate-400 max-w-sm mx-auto">Vá até o Treino Digital, gere uma sessão personalizada e clique em "Salvar" para vê-la aqui.</p>
                       <button onClick={() => { setWorkoutsModalOpen(false); onNavigate('home', NavLink.TRAINER); }} className="mt-6 text-brand font-bold uppercase text-sm hover:underline">Ir para Treino Digital</button>
                    </div>
                 ) : (
                    <div className="grid gap-6">
                       {currentUser.savedWorkouts.map((workout, idx) => (
                          <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative group">
                             <div className="absolute top-4 right-4 flex gap-2">
                                <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                                   {new Date(workout.dateCreated || '').toLocaleDateString('pt-BR')}
                                </span>
                                <button 
                                   onClick={() => deleteWorkout(idx)}
                                   className="bg-red-500/10 text-red-400 p-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                                   title="Excluir treino"
                                >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                             </div>
                             
                             <div className="flex items-baseline gap-4 mb-4 pr-16">
                                <h4 className="text-xl font-bold text-white uppercase">{workout.planName}</h4>
                                <span className="text-brand text-xs font-bold uppercase border border-brand/30 px-2 py-0.5 rounded whitespace-nowrap">{workout.difficulty}</span>
                             </div>

                             <div className="bg-slate-900/50 p-3 rounded mb-4 text-sm text-slate-400">
                                <span className="font-bold text-brand">Aquecimento:</span> {workout.warmup}
                             </div>

                             <div className="space-y-2 mb-4">
                                {workout.exercises.map((ex, i) => (
                                   <div key={i} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                                      <span className="text-white font-medium flex-1 mr-2"><span className="text-brand mr-2">{i+1}.</span>{ex.name}</span>
                                      <span className="text-slate-400 text-xs whitespace-nowrap">{ex.sets} x {ex.reps}</span>
                                   </div>
                                ))}
                             </div>
                             
                             <div className="bg-slate-900/50 p-3 rounded text-sm text-slate-400">
                                <span className="font-bold text-brand">Desaquecimento:</span> {workout.cooldown}
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Navbar;