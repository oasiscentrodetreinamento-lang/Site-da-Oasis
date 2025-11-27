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
  // --- INICIANTE ---
  {
    planName: "Adaptação Full Body",
    difficulty: "Iniciante",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Iniciante",
    duration: "45",
    warmup: "5 min esteira leve + 10 rotações de ombros e braços.",
    exercises: [
      { name: "Agachamento Livre (no banco)", sets: "3", reps: "12-15", notes: "Sente e levante controlando." },
      { name: "Flexão de Braços (joelhos no chão)", sets: "3", reps: "8-12", notes: "Contraia o abdômen." },
      { name: "Puxada Alta (Máquina)", sets: "3", reps: "12", notes: "Traga a barra até o peito." },
      { name: "Desenvolvimento Halteres", sets: "3", reps: "10-12", notes: "Sentado, costas apoiadas." },
      { name: "Abdominal Supra", sets: "3", reps: "15-20", notes: "Tire apenas as escápulas do chão." }
    ],
    cooldown: "Alongamento estático de pernas e peitoral (30s cada)."
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
      { name: "Flexão de Braços Inclinada (mãos no banco)", sets: "3", reps: "10", notes: "Corpo reto." },
      { name: "Mountain Climbers (Escalador)", sets: "3", reps: "30s", notes: "Ritmo moderado." },
      { name: "Passada (Lunge) Alternada", sets: "3", reps: "10 cada", notes: "Mãos na cintura." },
      { name: "Prancha Abdominal", sets: "3", reps: "20-30s", notes: "Umbigo nas costas." }
    ],
    cooldown: "Respiração profunda e alongamento leve."
  },

  // --- INTERMEDIÁRIO ---
  {
    planName: "Hipertrofia Total Body",
    difficulty: "Intermediário",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Intermediário",
    duration: "60",
    warmup: "5 min bike carga média + mobilidade de quadril.",
    exercises: [
      { name: "Agachamento Livre com Barra", sets: "4", reps: "8-10", notes: "Amplitude máxima segura." },
      { name: "Supino Reto com Barra/Halter", sets: "4", reps: "8-10", notes: "Controle a descida (3seg)." },
      { name: "Levantamento Terra Romeno (Stiff)", sets: "3", reps: "10-12", notes: "Coluna neutra sempre." },
      { name: "Remada Curvada", sets: "4", reps: "10", notes: "Tronco paralelo ao chão." },
      { name: "Elevação Lateral + Frontal (Bi-set)", sets: "3", reps: "12+12", notes: "Sem descanso entre exercícios." }
    ],
    cooldown: "5 min caminhada leve + alongamento geral."
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
      { name: "Sprawl (Meio Burpee)", sets: "4", reps: "15", notes: "Rápido transição chão-pé." },
      { name: "Abdominal Remador", sets: "4", reps: "20", notes: "Estenda todo o corpo." },
      { name: "Agachamento Isométrico", sets: "4", reps: "45s", notes: "Segura firme na parede ou livre." },
      { name: "Polichinelo", sets: "4", reps: "60s", notes: "Ritmo constante." }
    ],
    cooldown: "Caminhada lenta e respiração profunda."
  },
  {
    planName: "Superiores com Foco em Braços",
    difficulty: "Intermediário",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Intermediário",
    duration: "50",
    warmup: "Rotação de ombros + Flexão de braço leve.",
    exercises: [
      { name: "Supino Inclinado Halteres", sets: "4", reps: "10-12", notes: "Foco parte superior peitoral." },
      { name: "Puxada Aberta (Polia)", sets: "4", reps: "10-12", notes: "Esmague as costas no final." },
      { name: "Tríceps Testa + Supinado (Bi-set)", sets: "3", reps: "10+10", notes: "Queima total tríceps." },
      { name: "Rosca Direta Barra W", sets: "3", reps: "10-12", notes: "Cotovelos colados no corpo." },
      { name: "Desenvolvimento Arnold", sets: "3", reps: "12", notes: "Giro completo do punho." }
    ],
    cooldown: "Alongamento de tríceps e bíceps."
  },

  // --- AVANÇADO (Novas Variações) ---
  {
    planName: "Leg Day - Volume Alto",
    difficulty: "Avançado",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Avançado",
    duration: "75",
    warmup: "Agachamento peso do corpo (2x20) + Mobilidade de tornozelo.",
    exercises: [
      { name: "Agachamento Livre", sets: "5", reps: "6-8", notes: "Carga alta. Descanso 2-3min." },
      { name: "Leg Press 45º", sets: "4", reps: "12-15", notes: "Pés baixos na plataforma (foco quadríceps)." },
      { name: "Afundo Búlgaro (com halteres)", sets: "3", reps: "10 cada", notes: "Incline o tronco levemente à frente." },
      { name: "Cadeira Extensora (Drop-set)", sets: "3", reps: "10+10+10", notes: "Reduza o peso 2x sem descanso." },
      { name: "Mesa Flexora", sets: "4", reps: "12", notes: "Segure 1s na contração máxima." },
      { name: "Panturrilha em Pé", sets: "5", reps: "15-20", notes: "Amplitude total." }
    ],
    cooldown: "Alongamento passivo de quadríceps e posteriores."
  },
  {
    planName: "Peito e Tríceps - Força & Pump",
    difficulty: "Avançado",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Avançado",
    duration: "60",
    warmup: "Manguito rotador no elástico + Flexões explosivas.",
    exercises: [
      { name: "Supino Reto Barra", sets: "5", reps: "5", notes: "Foco em força bruta (85% RM)." },
      { name: "Supino Inclinado Halteres", sets: "4", reps: "8-10", notes: "Amplitude máxima." },
      { name: "Crossover (Polia Alta)", sets: "4", reps: "15", notes: "Foco na contração de pico." },
      { name: "Tríceps Paralelas (com peso)", sets: "4", reps: "8-10", notes: "Tronco ereto para focar tríceps." },
      { name: "Tríceps Corda", sets: "3", reps: "15-20", notes: "Fadiga final." }
    ],
    cooldown: "Alongamento peitoral na parede."
  },
  {
    planName: "Dorsais e Bíceps - Construção em V",
    difficulty: "Avançado",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Avançado",
    duration: "60",
    warmup: "Remada TRX ou Barra Australiana 2x15.",
    exercises: [
      { name: "Barra Fixa (Pull-ups)", sets: "4", reps: "Até a falha", notes: "Use peso extra se fizer +12." },
      { name: "Remada Curvada Supinada", sets: "4", reps: "8-10", notes: "Foco na espessura das costas." },
      { name: "Puxada Triângulo", sets: "3", reps: "12", notes: "Traga no peito." },
      { name: "Pulldown (Polia Alta)", sets: "3", reps: "15", notes: "Braços estendidos (foco latíssimo)." },
      { name: "Rosca Scott (Máquina ou Livre)", sets: "4", reps: "10", notes: "Isolamento total." },
      { name: "Rosca Martelo Alternada", sets: "3", reps: "12", notes: "Foco no braquial." }
    ],
    cooldown: "Pendurar na barra fixa (30s) para alongar dorsais."
  },
  {
    planName: "Metabólico Insano (WOD)",
    difficulty: "Avançado",
    targetGoal: "Perder Peso",
    targetLevel: "Avançado",
    duration: "45",
    warmup: "5 min corda + mobilidade articular.",
    exercises: [
      { name: "Burpees", sets: "5", reps: "15", notes: "Peito no chão. O mais rápido possível." },
      { name: "Thrusters (Agachamento + Desenvolvimento)", sets: "5", reps: "12", notes: "Use o impulso das pernas." },
      { name: "Kettlebell Swing", sets: "5", reps: "20", notes: "Quadril explosivo. Altura dos olhos." },
      { name: "Box Jump (Salto na Caixa)", sets: "5", reps: "12", notes: "Estenda o quadril no topo." },
      { name: "Prancha Dinâmica (Sobe e Desce)", sets: "4", reps: "45s", notes: "Variando apoios cotovelo/mão." }
    ],
    cooldown: "Caminhada lenta até baixar FC + Alongamento."
  },
  {
    planName: "Calistenia Pro (Peso do Corpo)",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    duration: "55",
    warmup: "Polichinelos, rotação de punhos e ombros.",
    exercises: [
      { name: "Pistol Squat (Agachamento Unilateral)", sets: "4", reps: "5-8 cada", notes: "Use apoio se necessário." },
      { name: "Flexão Arqueira (Archer Pushup)", sets: "4", reps: "8-10 cada", notes: "Braço de apoio esticado." },
      { name: "Barra Fixa Estrita", sets: "5", reps: "8-12", notes: "Sem balanço (kipping)." },
      { name: "Dips (Paralelas) em Barra Reta ou Argola", sets: "4", reps: "10-15", notes: "Controle a instabilidade." },
      { name: "L-Sit (Isometria)", sets: "4", reps: "15-30s", notes: "Pernas esticadas, corpo suspenso." }
    ],
    cooldown: "Alongamento profundo de ombros e posteriores."
  },
  
  // --- MOBILIDADE / FLEXIBILIDADE (Todos os Níveis) ---
  {
    planName: "Mobilidade e Core Flow",
    difficulty: "Iniciante",
    targetGoal: "Mobilidade e Flexibilidade",
    targetLevel: "Iniciante",
    duration: "30",
    warmup: "Respiração diafragmática 2 min.",
    exercises: [
      { name: "Gato e Vaca (Cat-Cow)", sets: "3", reps: "10 ciclos", notes: "Mobilidade de coluna." },
      { name: "Cachorro Olhando para Baixo", sets: "3", reps: "30s", notes: "Alongar cadeia posterior." },
      { name: "World's Greatest Stretch", sets: "3", reps: "5 cada lado", notes: "Passada longa com rotação torácica." },
      { name: "Deadbug (Inseto Morto)", sets: "3", reps: "12 total", notes: "Controle do core, lombar no chão." },
      { name: "Bird-Dog (Perdigueiro)", sets: "3", reps: "12 total", notes: "Estabilidade cruzada." },
      { name: "Posição de Criança (Child's Pose)", sets: "1", reps: "2 min", notes: "Relaxamento final." }
    ],
    cooldown: "Meditação rápida."
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
       // Merge default templates with saved ones to ensure new hardcoded ones appear if user hasn't modified them heavily
       // Simple approach: prefer saved, but if we want to force update defaults we might need versioning.
       // For now, we will just use saved. To reset, admin can clear cache or we add a reset button.
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
    // Basic filtering based on Goal and Level
    // For 'equipment', we generally assume templates are gym-based unless specified 'bodyweight'
    // but for simplicity we filter mainly by goal/level to ensure we return *something*.
    
    let matches = workoutTemplates.filter(t => 
      t.targetGoal === prefs.goal && 
      t.targetLevel === prefs.level
    );
    
    // Fallback logic: if no exact match for level, try to find same goal but adjacent level
    if (matches.length === 0) {
         matches = workoutTemplates.filter(t => t.targetGoal === prefs.goal);
    }

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