import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BlogPost } from '../types';

interface AdminContextType {
  isAdmin: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  content: Record<string, string>;
  updateContent: (key: string, value: string) => void;
  blogPosts: BlogPost[];
  addPost: (content: string, image?: string) => void;
  deletePost: (id: string) => void;
}

const defaultContent: Record<string, string> = {
  'hero-title': 'Centro de \nTreinamento',
  'hero-subtitle': 'Pilates, Spinning, Jump e Dança. Foco total em atendimento personalizado para transformar corpo e mente.',
  'hero-bg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  'class-img-0': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
  'class-img-1': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  'class-img-2': 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=2070&auto=format&fit=crop',
  'class-img-3': 'https://images.unsplash.com/photo-1535525266638-c5f718b58256?q=80&w=1767&auto=format&fit=crop',
  'price-monthly': '149,90',
  'price-recurrent': '149,90',
  'price-annual': '119,90',
  // Coming Soon Section
  'news-title': 'EM BREVE: NOVO ESPAÇO OASIS',
  'news-subtitle': 'Estamos expandindo! Confira o que vem por aí no nosso novo complexo esportivo.',
  'news-img-swim': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop',
  'news-desc-swim': 'Piscinas aquecidas para Hidroginástica e metodologia lúdica exclusiva para Natação Kids.',
  'news-list-swim': '• Natação Kids\n• Natação Bebê\n• Hidroginástica\n• Hidro Power',
  'news-img-fight': 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
  'news-desc-fight': 'Novo dojo profissional equipado para alta performance.',
  'news-list-fight': '• Jiu-Jitsu\n• Muay Thai\n• Boxe\n• Defesa Pessoal',
  'news-img-dance': 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2070&auto=format&fit=crop',
  'news-desc-dance': 'Salas amplas com piso flutuante para diversas modalidades.',
  'news-list-dance': '• Ballet Clássico\n• Jazz\n• Danças Urbanas\n• Fit Dance',
};

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    content: 'Estamos muito animados com o progresso das obras da nova piscina! Em breve, aulas de Hidroginástica para todas as idades. 🏊‍♂️ #OasisCT #Novidades',
    date: new Date().toISOString(),
    likes: 24
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState<Record<string, string>>(defaultContent);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultPosts);

  useEffect(() => {
    // Load saved content from local storage
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      setContent({ ...defaultContent, ...JSON.parse(savedContent) });
    }
    
    // Load saved posts
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setBlogPosts(JSON.parse(savedPosts));
    }

    // Check session
    const session = localStorage.getItem('adminSession');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const login = (u: string, p: string) => {
    if (u === 'admoasis' && p === 'oasis123') {
      setIsAdmin(true);
      localStorage.setItem('adminSession', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminSession');
  };

  const updateContent = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    localStorage.setItem('siteContent', JSON.stringify(newContent));
  };

  const addPost = (text: string, image?: string) => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      content: text,
      image,
      date: new Date().toISOString(),
      likes: 0
    };
    const newPosts = [newPost, ...blogPosts];
    setBlogPosts(newPosts);
    localStorage.setItem('blogPosts', JSON.stringify(newPosts));
  };

  const deletePost = (id: string) => {
    const newPosts = blogPosts.filter(p => p.id !== id);
    setBlogPosts(newPosts);
    localStorage.setItem('blogPosts', JSON.stringify(newPosts));
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, content, updateContent, blogPosts, addPost, deletePost }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};