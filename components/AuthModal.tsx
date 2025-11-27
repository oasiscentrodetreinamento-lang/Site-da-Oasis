import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAdmin();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (mode === 'register' && !name)) {
      setError('Preencha todos os campos.');
      return;
    }

    if (mode === 'login') {
      const success = login(username, password);
      if (success) {
        handleClose();
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } else {
      const success = register(name, username, password);
      if (success) {
        handleClose();
      } else {
        setError('Nome de usuário já existe.');
      }
    }
  };

  const handleClose = () => {
    setName('');
    setUsername('');
    setPassword('');
    setError('');
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-sm transition-colors ${mode === 'login' ? 'bg-slate-800 text-brand' : 'text-slate-500 hover:text-white'}`}
          >
            Entrar
          </button>
          <button 
             onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-4 text-center font-bold uppercase tracking-wider text-sm transition-colors ${mode === 'register' ? 'bg-slate-800 text-brand' : 'text-slate-500 hover:text-white'}`}
          >
            Criar Conta
          </button>
        </div>

        <div className="p-8 relative">
          <button 
             onClick={handleClose}
             className="absolute top-4 right-4 text-slate-500 hover:text-white"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h3 className="text-2xl font-display font-bold text-white mb-6 uppercase text-center">
            {mode === 'login' ? 'Bem-vindo de Volta' : 'Junte-se ao Time'}
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Seu Nome</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
                  placeholder="Ex: João Silva"
                />
              </div>
            )}
            
            <div>
               <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Usuário</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
                 placeholder="Digite seu usuário"
               />
            </div>

            <div>
               <label className="block text-slate-400 text-xs font-bold uppercase mb-1">Senha</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-brand focus:outline-none transition-colors"
                 placeholder="Digite sua senha"
               />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark text-slate-900 font-bold py-3 rounded-lg uppercase tracking-wider transition-colors mt-4 shadow-lg shadow-brand/20"
            >
              {mode === 'login' ? 'Acessar Conta' : 'Cadastrar Grátis'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;