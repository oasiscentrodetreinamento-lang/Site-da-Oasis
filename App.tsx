import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Classes from './components/Classes';
import AITrainer from './components/AITrainer';
import Membership from './components/Membership';
import Footer from './components/Footer';
import ComingSoon from './components/ComingSoon';
import Blog from './components/Blog';
import AuthModal from './components/AuthModal';
import { AdminProvider } from './contexts/AdminContext';
import { NavLink } from './types';

// Oasis App Version 1.1

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'blog'>('home');

  const handleNavigate = (view: 'home' | 'blog', sectionId?: string) => {
    setCurrentView(view);
    
    // Handle scrolling
    if (view === 'home') {
      if (sectionId) {
        // If switching from blog to home, we need a small delay to allow render
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AdminProvider>
      <div className="bg-slate-900 min-h-screen text-slate-50 selection:bg-brand selection:text-white flex flex-col">
        <Navbar onNavigate={handleNavigate} currentView={currentView} />
        <AuthModal />
        
        <main className="flex-grow">
          {currentView === 'home' ? (
            <>
              <Hero />
              <ComingSoon />
              <Classes />
              <AITrainer />
              <Membership />
            </>
          ) : (
            <Blog />
          )}
        </main>
        
        <Footer />
      </div>
    </AdminProvider>
  );
}

export default App;