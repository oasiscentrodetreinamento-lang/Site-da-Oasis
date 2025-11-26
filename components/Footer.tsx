import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const Footer: React.FC = () => {
  const { login, logout, isAdmin } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-display font-bold text-white italic tracking-wider mb-6 block">
              OASIS<span className="text-brand">CT</span>
            </span>
            <p className="text-slate-400 max-w-sm mb-6">
              Oasis Centro de Treinamento. O seu lugar para evoluir, suar e conquistar seus objetivos.
              Aulas coletivas vibrantes e tecnologia de ponta.
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'Facebook', 'Instagram', 'Youtube'].map(social => (
                <button key={social} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-brand hover:text-slate-900 transition-all">
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-6h2v6z"/></svg>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-6">Funcionamento</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex justify-between border-b border-slate-900 pb-2">
                <span>Seg - Sex:</span>
                <span className="text-white font-semibold">05h às 22h</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-2">
                <span>Sábados:</span>
                <span className="text-white font-semibold">08h às 12h</span>
              </li>
              <li className="flex justify-between">
                <span>Dom e Feriados:</span>
                <span className="text-white font-semibold">09h às 12h</span>
              </li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold uppercase tracking-wider mb-6">Contato</h4>
             <ul className="space-y-3 text-slate-400 text-sm">
               <li className="flex items-start">
                  <svg className="w-5 h-5 text-brand mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Rua Paulo Carneiro n 95,<br/>Bairro Centro - Piranguinho, MG
               </li>
               <li className="flex items-center">
                  <svg className="w-5 h-5 text-brand mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +55 (35) 9774-2332
               </li>
               <li className="flex items-center">
                  <svg className="w-5 h-5 text-brand mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  contato@oasisct.com.br
               </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">© 2024 Oasis Centro de Treinamento. Todos os direitos reservados.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <button 
                onClick={() => isAdmin ? logout() : setShowLogin(true)}
                className="text-slate-600 hover:text-brand text-sm font-semibold transition-colors uppercase tracking-wider"
            >
                {isAdmin ? 'Sair do Admin' : 'Área Administrativa'}
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl relative">
                <button 
                    onClick={() => setShowLogin(false)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h3 className="text-2xl font-display font-bold text-white mb-6 uppercase text-center">Acesso Administrativo</h3>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Usuário</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Senha</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-brand hover:bg-brand-dark text-slate-900 font-bold py-3 rounded-lg uppercase tracking-wider transition-colors mt-2"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;