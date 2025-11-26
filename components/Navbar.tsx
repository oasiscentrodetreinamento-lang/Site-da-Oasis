import React, { useState, useEffect } from 'react';
import { NavLink } from '../types';

interface NavbarProps {
  onNavigate: (view: 'home' | 'blog', sectionId?: string) => void;
  currentView: 'home' | 'blog';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || currentView === 'blog' ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => handleLinkClick(NavLink.HOME)}>
          <span className="text-3xl font-display font-bold text-white italic tracking-wider">
            OASIS<span className="text-brand">CT</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {[
            { id: NavLink.HOME, label: 'Início' },
            { id: NavLink.BLOG, label: 'Blog' },
            { id: NavLink.CLASSES, label: 'Aulas' },
            { id: NavLink.TRAINER, label: 'Personal IA' },
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
          <button 
            onClick={() => handleLinkClick(NavLink.MEMBERSHIP)}
            className="bg-brand hover:bg-brand-dark text-slate-900 px-6 py-2 rounded-full font-bold uppercase text-sm tracking-wide transition-all transform hover:scale-105"
          >
            Matricular-se
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 absolute top-full w-full border-t border-slate-800">
          <div className="flex flex-col p-4 space-y-4">
             {[
              { id: NavLink.HOME, label: 'Início' },
              { id: NavLink.BLOG, label: 'Blog' },
              { id: NavLink.CLASSES, label: 'Aulas' },
              { id: NavLink.TRAINER, label: 'Personal IA' },
              { id: NavLink.MEMBERSHIP, label: 'Planos' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left text-lg font-display uppercase tracking-wider ${
                  (currentView === 'blog' && link.id === NavLink.BLOG) ? 'text-brand' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
             <button 
                onClick={() => handleLinkClick(NavLink.MEMBERSHIP)}
                className="bg-brand text-slate-900 py-3 rounded text-center font-bold uppercase w-full"
             >
               Matricular-se
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;