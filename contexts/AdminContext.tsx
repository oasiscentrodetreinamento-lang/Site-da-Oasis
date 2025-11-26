import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BlogPost, Comment, User, WorkoutPlan } from '../types';

interface AdminContextType {
  currentUser: User | null;
  isAdmin: boolean; // Derived from currentUser
  login: (u: string, p: string) => boolean;
  register: (name: string, u: string, p: string) => boolean;
  logout: () => void;
  
  // Content Management
  content: Record<string, string>;
  updateContent: (key: string, value: string) => void;
  
  // Blog Management
  blogPosts: BlogPost[];
  addPost: (content: string, image?: string) => void;
  deletePost: (id: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;

  // User Data Management
  saveWorkout: (workout: WorkoutPlan) => void;
  deleteWorkout: (index: number) => void;
  
  // UI State
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const defaultContent: Record<string, string> = {
  'hero-title': 'Centro de \nTreinamento',
  'hero-subtitle': 'Pilates, Spinning, Jump e Dança. Foco total em atendimento personalizado para transformar corpo e mente.',
  'hero-bg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  'class-img-0': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
  'class-img-1': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  'class-img-2': 'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=2070&auto=format&fit=crop',
  'class-img-3': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop',
  'price-monthly': '149,90',
  'price-recurrent': '149,90',
  'price-annual': '119,90',
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
    likedBy: [],
    comments: [],
    author: {
      id: 'admin',
      name: 'Oasis CT',
      isAdmin: true
    }
  }
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [content, setContent] = useState<Record<string, string>>(defaultContent);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultPosts);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize data from local storage
  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      setContent({ ...defaultContent, ...JSON.parse(savedContent) });
    }
    
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      // Migration logic: Ensure new fields (likedBy, comments) exist if loading old data
      const parsedPosts: BlogPost[] = JSON.parse(savedPosts).map((p: any) => ({
        ...p,
        likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
        comments: Array.isArray(p.comments) ? p.comments : []
      }));
      setBlogPosts(parsedPosts);
    }

    // Check for active session
    const savedSession = localStorage.getItem('currentUser');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
  }, []);

  // Update localStorage whenever currentUser changes (to sync saved workouts)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Also update the user in the main 'users' database in localStorage
      if (!currentUser.isAdmin) {
        const usersStr = localStorage.getItem('users');
        if (usersStr) {
          const users: User[] = JSON.parse(usersStr);
          const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
      }
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = (u: string, p: string) => {
    // 1. Check Admin
    if (u === 'admoasis' && p === 'oasis123') {
      const adminUser: User = {
        id: 'admin',
        username: 'admoasis',
        name: 'Administrador',
        isAdmin: true,
        savedWorkouts: []
      };
      setCurrentUser(adminUser);
      return true;
    }

    // 2. Check Registered Users
    const usersStr = localStorage.getItem('users');
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr);
      const user = users.find(user => user.username === u && user.password === p);
      if (user) {
        setCurrentUser(user);
        return true;
      }
    }

    return false;
  };

  const register = (name: string, u: string, p: string) => {
    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(user => user.username === u)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      username: u,
      password: p,
      isAdmin: false,
      savedWorkouts: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setCurrentUser(newUser); // Auto login after register
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateContent = (key: string, value: string) => {
    if (!currentUser?.isAdmin) return;
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    localStorage.setItem('siteContent', JSON.stringify(newContent));
  };

  const addPost = (text: string, image?: string) => {
    if (!currentUser) return;

    const newPost: BlogPost = {
      id: Date.now().toString(),
      content: text,
      image,
      date: new Date().toISOString(),
      likedBy: [],
      comments: [],
      author: {
        id: currentUser.id,
        name: currentUser.isAdmin ? 'Oasis CT' : currentUser.name,
        isAdmin: currentUser.isAdmin,
        avatar: currentUser.avatar
      }
    };
    const newPosts = [newPost, ...blogPosts];
    setBlogPosts(newPosts);
    localStorage.setItem('blogPosts', JSON.stringify(newPosts));
  };

  const deletePost = (id: string) => {
    // Admins can delete all, Users can only delete their own
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    if (currentUser?.isAdmin || post.author.id === currentUser?.id) {
      const newPosts = blogPosts.filter(p => p.id !== id);
      setBlogPosts(newPosts);
      localStorage.setItem('blogPosts', JSON.stringify(newPosts));
    }
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;

    const newPosts = blogPosts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(currentUser.id);
        const newLikedBy = hasLiked 
          ? post.likedBy.filter(id => id !== currentUser.id)
          : [...post.likedBy, currentUser.id];
        return { ...post, likedBy: newLikedBy };
      }
      return post;
    });

    setBlogPosts(newPosts);
    localStorage.setItem('blogPosts', JSON.stringify(newPosts));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
      author: {
        id: currentUser.id,
        name: currentUser.isAdmin ? 'Oasis CT' : currentUser.name,
        isAdmin: currentUser.isAdmin,
        avatar: currentUser.avatar
      }
    };

    const newPosts = blogPosts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    setBlogPosts(newPosts);
    localStorage.setItem('blogPosts', JSON.stringify(newPosts));
  };

  const saveWorkout = (workout: WorkoutPlan) => {
    if (!currentUser) return;
    
    const workoutWithDate = { ...workout, dateCreated: new Date().toISOString() };
    const updatedUser = { 
      ...currentUser, 
      savedWorkouts: [workoutWithDate, ...currentUser.savedWorkouts] 
    };
    setCurrentUser(updatedUser);
  };

  const deleteWorkout = (index: number) => {
    if (!currentUser) return;
    const newWorkouts = [...currentUser.savedWorkouts];
    newWorkouts.splice(index, 1);
    setCurrentUser({ ...currentUser, savedWorkouts: newWorkouts });
  };

  return (
    <AdminContext.Provider value={{ 
      currentUser,
      isAdmin: !!currentUser?.isAdmin,
      login, 
      register,
      logout, 
      content, 
      updateContent, 
      blogPosts, 
      addPost, 
      deletePost,
      toggleLike,
      addComment,
      saveWorkout,
      deleteWorkout,
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false)
    }}>
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