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

// --- INITIAL TEMPLATE DATABASE ---
// This ensures that EVERY combination of Equipment + Goal has at least one valid workout.
// Mapped to:
// Goals: 'Ganhar Músculo', 'Perder Peso', 'Melhorar Resistência', 'Treino de Força', 'Mobilidade e Flexibilidade'
// Levels: 'Iniciante', 'Intermediário', 'Avançado'
// Equipment: 'Academia Completa', 'Apenas Halteres', 'Apenas Peso do Corpo', 'Academia em Casa (Básica)'

const defaultTemplates: WorkoutPlan[] = [
  // =========================================================================
  // 1. ACADEMIA COMPLETA (Full Gym)
  // =========================================================================
  {
    planName: "Hipertrofia Clássica (ABC)",
    difficulty: "Intermediário",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Intermediário",
    targetEquipment: "Academia Completa",
    duration: "60",
    warmup: "5 min bike + manguito rotador.",
    exercises: [
      { name: "Supino Reto com Barra", sets: "4", reps: "8-10", notes: "Carga progressiva." },
      { name: "Puxada Alta (Polia)", sets: "4", reps: "10-12", notes: "Foco na largura das costas." },
      { name: "Leg Press 45", sets: "4", reps: "12", notes: "Amplitude completa." },
      { name: "Desenvolvimento Máquina", sets: "3", reps: "10-12", notes: "Ombros." },
      { name: "Tríceps Corda + Rosca Direta", sets: "3", reps: "12+12", notes: "Bi-set braços." }
    ],
    cooldown: "Alongamento geral 5 min."
  },
  {
    planName: "Força Bruta 5x5",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    targetEquipment: "Academia Completa",
    duration: "70",
    warmup: "Aquecimento específico com cargas leves.",
    exercises: [
      { name: "Agachamento Livre", sets: "5", reps: "5", notes: "Carga alta (80% RM)." },
      { name: "Supino Reto", sets: "5", reps: "5", notes: "Descanso de 2-3 min." },
      { name: "Levantamento Terra", sets: "3", reps: "3-5", notes: "Técnica perfeita." },
      { name: "Desenvolvimento Militar", sets: "4", reps: "6", notes: "Em pé com barra." },
      { name: "Remada Curvada", sets: "4", reps: "6", notes: "Explosão na subida." }
    ],
    cooldown: "Alongamento passivo."
  },
  {
    planName: "Queima Calórica (Máquinas)",
    difficulty: "Iniciante",
    targetGoal: "Perder Peso",
    targetLevel: "Iniciante",
    targetEquipment: "Academia Completa",
    duration: "45",
    warmup: "10 min esteira inclinação média.",
    exercises: [
      { name: "Leg Press Horizontal", sets: "3", reps: "15", notes: "Ritmo constante." },
      { name: "Supino Vertical (Máquina)", sets: "3", reps: "15", notes: "Pouco descanso." },
      { name: "Remada Sentada", sets: "3", reps: "15", notes: "Postura ereta." },
      { name: "Cadeira Extensora", sets: "3", reps: "15-20", notes: "Queimação muscular." },
      { name: "Abdominal Máquina", sets: "3", reps: "20", notes: "Foco no core." }
    ],
    cooldown: "5 min bike leve."
  },
  {
    planName: "Resistência Muscular Total",
    difficulty: "Intermediário",
    targetGoal: "Melhorar Resistência",
    targetLevel: "Intermediário",
    targetEquipment: "Academia Completa",
    duration: "50",
    warmup: "5 min elíptico.",
    exercises: [
      { name: "Agachamento Hack", sets: "3", reps: "20", notes: "Séries longas." },
      { name: "Cadeira Flexora", sets: "3", reps: "20", notes: "Controle o retorno." },
      { name: "Peck Deck (Voador)", sets: "3", reps: "20", notes: "Isolamento peitoral." },
      { name: "Elevação Lateral Halteres", sets: "3", reps: "15-20", notes: "Queimação ombros." },
      { name: "Prancha Abdominal", sets: "3", reps: "1 min", notes: "Isometria." }
    ],
    cooldown: "Alongamento de membros inferiores."
  },

  // =========================================================================
  // 2. APENAS HALTERES (Dumbbells Only)
  // =========================================================================
  {
    planName: "Full Body com Halteres",
    difficulty: "Iniciante",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Iniciante",
    targetEquipment: "Apenas Halteres",
    duration: "45",
    warmup: "Polichinelos + Rotação de braços.",
    exercises: [
      { name: "Goblet Squat (Agachamento)", sets: "3", reps: "12", notes: "Segure o halter no peito." },
      { name: "Supino Reto com Halteres (Chão/Banco)", sets: "3", reps: "12", notes: "Empurre para cima." },
      { name: "Remada Unilateral (Serrote)", sets: "3", reps: "10 cada", notes: "Apoie em algo firme." },
      { name: "Desenvolvimento Arnold", sets: "3", reps: "10", notes: "Gire os punhos." },
      { name: "Stiff com Halteres", sets: "3", reps: "12", notes: "Coluna reta, desça até o joelho." }
    ],
    cooldown: "Alongamento leve."
  },
  {
    planName: "Metabólico Halteres HIIT",
    difficulty: "Intermediário",
    targetGoal: "Perder Peso",
    targetLevel: "Intermediário",
    targetEquipment: "Apenas Halteres",
    duration: "30",
    warmup: "Corrida estacionária 3 min.",
    exercises: [
      { name: "Thrusters (Agachamento + Press)", sets: "4", reps: "15", notes: "Movimento contínuo." },
      { name: "Renegade Row (Remada em Prancha)", sets: "4", reps: "10 cada", notes: "Core firme." },
      { name: "Passada (Lunge) Dinâmica", sets: "4", reps: "20 total", notes: "Alternando pernas." },
      { name: "Swing com Halter", sets: "4", reps: "20", notes: "Use o quadril." },
      { name: "Abdominal com Carga", sets: "4", reps: "15", notes: "Segure halter no peito." }
    ],
    cooldown: "Respiração profunda."
  },
  {
    planName: "Força Funcional DB",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    targetEquipment: "Apenas Halteres",
    duration: "55",
    warmup: "Mobilidade de ombros e quadril.",
    exercises: [
      { name: "Agachamento Búlgaro", sets: "4", reps: "6-8", notes: "Carga alta, uma perna por vez." },
      { name: "Supino Halteres Unilateral", sets: "4", reps: "8", notes: "Ativação do core." },
      { name: "Remada Curvada Dupla", sets: "4", reps: "8-10", notes: "Tronco paralelo ao chão." },
      { name: "Levantamento Terra Romeno", sets: "4", reps: "8-10", notes: "Foco posterior." },
      { name: "Farmer's Walk (Caminhada Fazendeiro)", sets: "3", reps: "40s", notes: "Carga máxima nas mãos." }
    ],
    cooldown: "Alongamento passivo."
  },
  {
    planName: "Mobilidade com Carga",
    difficulty: "Iniciante",
    targetGoal: "Mobilidade e Flexibilidade",
    targetLevel: "Iniciante",
    targetEquipment: "Apenas Halteres",
    duration: "30",
    warmup: "Rotações articulares.",
    exercises: [
      { name: "Agachamento Cosmo (Cossack)", sets: "3", reps: "8 cada", notes: "Use halter leve para contrapeso." },
      { name: "Jefferson Curl (leve)", sets: "3", reps: "10", notes: "Desenrole a coluna devagar." },
      { name: "Halo (Giro ao redor da cabeça)", sets: "3", reps: "10 cada", notes: "Mobilidade de ombros." },
      { name: "Good Morning com Halter", sets: "3", reps: "12", notes: "Halter no peito, flexione quadril." },
      { name: "Windmill (Moinho)", sets: "3", reps: "5 cada", notes: "Olhe para o halter." }
    ],
    cooldown: "Relaxamento."
  },

  // =========================================================================
  // 3. APENAS PESO DO CORPO (Bodyweight / Calistenia)
  // =========================================================================
  {
    planName: "Calistenia Fundamentos",
    difficulty: "Iniciante",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Iniciante",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "40",
    warmup: "Polichinelos e agachamentos livres.",
    exercises: [
      { name: "Agachamento Livre", sets: "3", reps: "15", notes: "Desça devagar." },
      { name: "Flexão de Braços (pode usar joelho)", sets: "3", reps: "8-12", notes: "Peito no chão." },
      { name: "Afundo Estático", sets: "3", reps: "10 cada", notes: "Mãos na cintura." },
      { name: "Prancha Abdominal", sets: "3", reps: "30s", notes: "Corpo reto." },
      { name: "Superman (Dorsal)", sets: "3", reps: "15", notes: "Tire peito e coxas do chão." }
    ],
    cooldown: "Alongamento completo."
  },
  {
    planName: "Queima de Gordura em Casa",
    difficulty: "Intermediário",
    targetGoal: "Perder Peso",
    targetLevel: "Intermediário",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "25",
    warmup: "Corrida no lugar.",
    exercises: [
      { name: "Burpees", sets: "4", reps: "10-12", notes: "Completo." },
      { name: "Mountain Climbers", sets: "4", reps: "40s", notes: "Acelerado." },
      { name: "Agachamento com Salto", sets: "4", reps: "15", notes: "Amortecer a queda." },
      { name: "Flexão Toca Ombro", sets: "4", reps: "12 total", notes: "Estabilidade." },
      { name: "Polichinelo", sets: "4", reps: "1 min", notes: "Sem parar." }
    ],
    cooldown: "Caminhada lenta."
  },
  {
    planName: "Calistenia Avançada (Força)",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "60",
    warmup: "Aquecimento de punhos e ombros.",
    exercises: [
      { name: "Pistol Squat (Agachamento 1 perna)", sets: "4", reps: "5-8", notes: "Use apoio se precisar." },
      { name: "Flexão Diamante", sets: "4", reps: "10-15", notes: "Mãos unidas (tríceps)." },
      { name: "Barra Fixa (Se tiver) ou Flexão Pike", sets: "4", reps: "8-12", notes: "Pike: Quadril alto, topo da cabeça no chão." },
      { name: "L-Sit (Isometria)", sets: "4", reps: "15s+", notes: "Pernas esticadas." },
      { name: "Plyo Pushups (Flexão com palma)", sets: "3", reps: "8", notes: "Explosão." }
    ],
    cooldown: "Alongamento passivo."
  },
  {
    planName: "Flow de Mobilidade Natural",
    difficulty: "Iniciante",
    targetGoal: "Mobilidade e Flexibilidade",
    targetLevel: "Iniciante",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "30",
    warmup: "Respiração.",
    exercises: [
      { name: "Cachorro Olhando Baixo", sets: "3", reps: "30s", notes: "Alongar posterior." },
      { name: "Deep Squat Hold (Cócoras)", sets: "3", reps: "30-60s", notes: "Calcanhar no chão." },
      { name: "Escorpião", sets: "3", reps: "10 total", notes: "Rotação de tronco deitado." },
      { name: "Gato e Vaca", sets: "3", reps: "10", notes: "Coluna." },
      { name: "Pidgeon Pose (Pombo)", sets: "2", reps: "45s cada", notes: "Glúteos." }
    ],
    cooldown: "Meditação."
  },

  // =========================================================================
  // 4. ACADEMIA EM CASA (Básica - Halteres + Elásticos + Peso do Corpo)
  // =========================================================================
  {
    planName: "Home Gym Full Body",
    difficulty: "Intermediário",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Intermediário",
    targetEquipment: "Academia em Casa (Básica)",
    duration: "50",
    warmup: "Polichinelos + Mobilidade.",
    exercises: [
      { name: "Agachamento com Halteres", sets: "4", reps: "12", notes: "Halteres nos ombros ou ao lado." },
      { name: "Flexão de Braços (ou Supino Chão)", sets: "4", reps: "12-15", notes: "Peitoral." },
      { name: "Remada Curvada (Halter ou Elástico)", sets: "4", reps: "12", notes: "Costas." },
      { name: "Elevação Lateral (Halter/Elástico)", sets: "3", reps: "15", notes: "Ombros." },
      { name: "Rosca Direta + Tríceps Francês", sets: "3", reps: "12+12", notes: "Braços." }
    ],
    cooldown: "Alongamento."
  },
  {
    planName: "Queima Total Home Gym",
    difficulty: "Avançado",
    targetGoal: "Perder Peso",
    targetLevel: "Avançado",
    targetEquipment: "Academia em Casa (Básica)",
    duration: "40",
    warmup: "Corda (simulada) 3 min.",
    exercises: [
      { name: "Devil Press (Burpee com Halter)", sets: "4", reps: "10", notes: "Intenso." },
      { name: "Agachamento + Desenvolvimento (Thruster)", sets: "4", reps: "15", notes: "Movimento único." },
      { name: "Remada Renegada", sets: "4", reps: "12 total", notes: "Prancha com remada." },
      { name: "Abdominal V-Up", sets: "4", reps: "15", notes: "Mãos nos pés." },
      { name: "Box Jump (ou Salto no Degrau)", sets: "4", reps: "15", notes: "Explosão." }
    ],
    cooldown: "Caminhada leve."
  },
  {
    planName: "Resistência com Elásticos",
    difficulty: "Iniciante",
    targetGoal: "Melhorar Resistência",
    targetLevel: "Iniciante",
    targetEquipment: "Academia em Casa (Básica)",
    duration: "35",
    warmup: "Giro de braços e agachamento livre.",
    exercises: [
      { name: "Remada em Pé com Elástico", sets: "3", reps: "20", notes: "Pise no elástico e puxe." },
      { name: "Supino em Pé com Elástico", sets: "3", reps: "20", notes: "Elástico nas costas." },
      { name: "Agachamento segurando Elástico", sets: "3", reps: "20", notes: "Resistência na subida." },
      { name: "Rosca Bíceps Elástico", sets: "3", reps: "20", notes: "Alta repetição." },
      { name: "Tríceps Testa Elástico", sets: "3", reps: "20", notes: "Prenda o elástico alto." }
    ],
    cooldown: "Alongamento."
  },
  {
    planName: "Força Adaptada Home",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    targetEquipment: "Academia em Casa (Básica)",
    duration: "50",
    warmup: "Mobilidade completa.",
    exercises: [
      { name: "Agachamento Unilateral (Pistol ou Búlgaro)", sets: "5", reps: "6-8", notes: "Com halter se possível." },
      { name: "Flexão de Braço c/ Pés Elevados", sets: "4", reps: "8-12", notes: "Foco peitoral superior/ombros." },
      { name: "Remada Unilateral Pesada", sets: "4", reps: "8-10", notes: "Halter." },
      { name: "Stiff Unilateral", sets: "4", reps: "8-10", notes: "Equilíbrio e força." },
      { name: "Prancha com Peso (Halter nas costas)", sets: "3", reps: "45s", notes: "Cuidado ao colocar." }
    ],
    cooldown: "Alongamento."
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
    
    // Always merge default templates with local storage to ensure updates in code (like new templates) appear
    const savedTemplatesStr = localStorage.getItem('workoutTemplates');
    let finalTemplates = defaultTemplates;

    if (savedTemplatesStr) {
       const savedTemplates: WorkoutPlan[] = JSON.parse(savedTemplatesStr);
       // Add any user-created templates that are NOT in default
       // This is a simple merge strategy. In a real app, IDs would be better.
       const customTemplates = savedTemplates.filter(st => 
         !defaultTemplates.some(dt => dt.planName === st.planName && dt.targetEquipment === st.targetEquipment)
       );
       finalTemplates = [...defaultTemplates, ...customTemplates];
    }
    
    setWorkoutTemplates(finalTemplates);
    localStorage.setItem('workoutTemplates', JSON.stringify(finalTemplates));

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
    // CRITICAL: Filter by Equipment FIRST.
    // We never want to show a Gym workout to someone with only Bodyweight.
    const equipmentMatches = workoutTemplates.filter(t => t.targetEquipment === prefs.equipment);
    
    if (equipmentMatches.length === 0) {
        // If literally no template matches the equipment, we shouldn't return a wrong one.
        // But since we hardcoded templates for all 4 types, this shouldn't happen.
        // Fallback: Return null to force AI (or error handle).
        return null;
    }

    // 1. Exact Match (Goal + Level) within Equipment
    const exactMatches = equipmentMatches.filter(t => 
      t.targetGoal === prefs.goal && 
      t.targetLevel === prefs.level
    );
    if (exactMatches.length > 0) return exactMatches[Math.floor(Math.random() * exactMatches.length)];

    // 2. Goal Match (Any Level) within Equipment
    // If we don't have "Advanced" for "Weight Loss", show "Intermediate".
    const goalMatches = equipmentMatches.filter(t => t.targetGoal === prefs.goal);
    if (goalMatches.length > 0) return goalMatches[Math.floor(Math.random() * goalMatches.length)];

    // 3. Level Match (Any Goal) within Equipment
    const levelMatches = equipmentMatches.filter(t => t.targetLevel === prefs.level);
    if (levelMatches.length > 0) return levelMatches[Math.floor(Math.random() * levelMatches.length)];
    
    // 4. Last Resort: Any workout with the correct equipment
    return equipmentMatches[Math.floor(Math.random() * equipmentMatches.length)];
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