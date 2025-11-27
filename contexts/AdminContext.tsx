import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BlogPost, Comment, User, WorkoutPlan, UserPreferences } from '../types';

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

  // Template Bank (Offline Workouts)
  findTemplate: (prefs: UserPreferences) => WorkoutPlan | null;
  saveTemplate: (workout: WorkoutPlan) => void;
  templateCount: number;
  
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

// Initial Database of Workouts (Fallback for offline/production)
const defaultTemplates: WorkoutPlan[] = [
  {
    planName: "Hipertrofia Iniciante A",
    difficulty: "Iniciante",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Iniciante",
    duration: "45",
    warmup: "5 min esteira leve + 10 rotações de ombros e braços.",
    exercises: [
      { name: "Agachamento Livre (Peso do Corpo)", sets: "3", reps: "12-15", notes: "Mantenha a postura ereta." },
      { name: "Flexão de Braços (pode usar joelhos)", sets: "3", reps: "8-12", notes: "Contraia o abdômen." },
      { name: "Puxada Alta (ou Remada Curvada)", sets: "3", reps: "12", notes: "Foco nas costas." },
      { name: "Desenvolvimento com Halteres", sets: "3", reps: "10-12", notes: "Cuidado com a lombar." },
      { name: "Abdominal Supra", sets: "3", reps: "15-20", notes: "Expire na subida." }
    ],
    cooldown: "Alongamento estático de pernas e peitoral (30s cada posição)."
  },
  {
    planName: "Hipertrofia Total Body",
    difficulty: "Intermediário",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Intermediário",
    duration: "60",
    warmup: "5 min bike carga média + mobilidade de quadril.",
    exercises: [
      { name: "Agachamento com Barra/Halter", sets: "4", reps: "8-10", notes: "Carga moderada a alta." },
      { name: "Supino Reto", sets: "4", reps: "8-10", notes: "Controle a descida." },
      { name: "Levantamento Terra Romeno", sets: "3", reps: "10-12", notes: "Foco nos posteriores." },
      { name: "Remada Curvada", sets: "4", reps: "10", notes: "Tronco firme." },
      { name: "Elevação Lateral", sets: "3", reps: "12-15", notes: "Para ombros." }
    ],
    cooldown: "5 min caminhada leve + alongamento geral."
  },
  {
    planName: "Queima de Gordura Express",
    difficulty: "Iniciante",
    targetGoal: "Perder Peso",
    targetLevel: "Iniciante",
    duration: "30",
    warmup: "3 min polichinelos e corrida estacionária.",
    exercises: [
      { name: "Agachamento com Salto (ou rápido)", sets: "3", reps: "15", notes: "Explosão na subida." },
      { name: "Flexão de Braços", sets: "3", reps: "10", notes: "Ritmo constante." },
      { name: "Mountain Climbers", sets: "3", reps: "30s", notes: "Acelere se possível." },
      { name: "Passada (Lunge)", sets: "3", reps: "10 cada perna", notes: "Equilíbrio." },
      { name: "Prancha Abdominal", sets: "3", reps: "20-30s", notes: "Corpo reto." }
    ],
    cooldown: "Respiração profunda e alongamento leve."
  },
  {
    planName: "Metabólico Insano",
    difficulty: "Avançado",
    targetGoal: "Perder Peso",
    targetLevel: "Avançado",
    duration: "45",
    warmup: "5 min corda ou corrida + mobilidade articular.",
    exercises: [
      { name: "Burpees", sets: "4", reps: "15", notes: "Sem parar." },
      { name: "Thrusters (Agachamento + Desenvolvimento)", sets: "4", reps: "12", notes: "Use o impulso das pernas." },
      { name: "Kettlebell Swing (ou Halter)", sets: "4", reps: "20", notes: "Quadril explosivo." },
      { name: "Box Jump (ou Salto em Distância)", sets: "4", reps: "10", notes: "Amortecer a queda." },
      { name: "Prancha Dinâmica", sets: "4", reps: "45s", notes: "Variando apoios." }
    ],
    cooldown: "Caminhada lenta até baixar FC + Alongamento."
  },
  {
    planName: "Força Pura",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    duration: "60",
    warmup: "Aquecimento específico com cargas leves nos movimentos principais.",
    exercises: [
      { name: "Agachamento Livre", sets: "5", reps: "5", notes: "Carga alta, descanso longo (2-3min)." },
      { name: "Supino Reto", sets: "5", reps: "5", notes: "Foco na execução." },
      { name: "Levantamento Terra", sets: "3", reps: "5", notes: "Técnica perfeita." },
      { name: "Barra Fixa (com peso se possível)", sets: "4", reps: "6-8", notes: "Amplitude total." }
    ],
    cooldown: "Liberação miofascial (rolinho) se disponível ou alongamento passivo."
  },
  {
    planName: "Cardio HIIT Queima Total",
    difficulty: "Intermediário",
    targetGoal: "Perder Peso",
    targetLevel: "Intermediário",
    duration: "30",
    warmup: "5 min corrida estacionária e polichinelos.",
    exercises: [
      { name: "Corrida Estacionária Joelho Alto", sets: "4", reps: "45s", notes: "Intensidade máxima." },
      { name: "Sprawl (Meio Burpee)", sets: "4", reps: "15", notes: "Rápido." },
      { name: "Abdominal Remador", sets: "4", reps: "20", notes: "Expira ao subir." },
      { name: "Agachamento Isométrico", sets: "4", reps: "45s", notes: "Segura firme." },
      { name: "Polichinelo", sets: "4", reps: "60s", notes: "Ritmo constante." }
    ],
    cooldown: "Caminhada lenta e respiração profunda."
  }
];

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
  
  // Template Bank State
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutPlan[]>(defaultTemplates);

  // Initialize data from local storage
  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      setContent({ ...defaultContent, ...JSON.parse(savedContent) });
    }
    
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      const parsedPosts: BlogPost[] = JSON.parse(savedPosts).map((p: any) => ({
        ...p,
        likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
        comments: Array.isArray(p.comments) ? p.comments : []
      }));
      setBlogPosts(parsedPosts);
    }
    
    const savedTemplates = localStorage.getItem('workoutTemplates');
    if (savedTemplates) {
       const parsedTemplates = JSON.parse(savedTemplates);
       setWorkoutTemplates(parsedTemplates);
    } else {
       localStorage.setItem('workoutTemplates', JSON.stringify(defaultTemplates));
    }

    const savedSession = localStorage.getItem('currentUser');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
  }, []);

  // Update localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
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
    if (users.find(user => user.username === u)) return false;

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
    setCurrentUser(newUser);
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

  // --- Template Bank Logic ---
  
  const findTemplate = (prefs: UserPreferences): WorkoutPlan | null => {
    const matches = workoutTemplates.filter(t => 
      t.targetGoal === prefs.goal && 
      t.targetLevel === prefs.level
    );

    if (matches.length > 0) {
      return matches[Math.floor(Math.random() * matches.length)];
    }
    
    return null;
  };

  const saveTemplate = (workout: WorkoutPlan) => {
    const newTemplates = [...workoutTemplates, workout];
    setWorkoutTemplates(newTemplates);
    localStorage.setItem('workoutTemplates', JSON.stringify(newTemplates));
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
      findTemplate,
      saveTemplate,
      templateCount: workoutTemplates.length,
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