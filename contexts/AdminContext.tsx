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
  addPost: (title: string, category: string, content: string, image?: string) => void;
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
  // Amenities Section
  'amenities-title': 'Estrutura Completa',
  'amenities-subtitle': 'Muito mais do que apenas equipamentos. Pensamos em cada detalhe para sua comodidade e conforto.',
  'amenities-trainers-title': 'Instrutores Full-Time',
  'amenities-trainers-desc': 'Acompanhamento profissional durante todo o horário de funcionamento.',
  'amenities-showers-title': 'Vestiários Premium',
  'amenities-showers-desc': 'Duchas quentes e secadores de cabelo disponíveis para seu conforto pós-treino.',
  'amenities-kids-title': 'Espaço Kids',
  'amenities-kids-desc': 'Área segura e divertida para seu filho enquanto você treina.',
  'amenities-wifi-title': 'Wi-Fi Gratuito',
  'amenities-wifi-desc': 'Conexão de alta velocidade em toda a academia.',
  'amenities-store-title': 'Oasis Store & Café',
  'amenities-store-desc': 'Suplementos, cereais, barras proteicas, energéticos e bebidas.',
  'amenities-parking-title': 'Estacionamento',
  'amenities-parking-desc': 'Vagas exclusivas e seguras para alunos.',
};

// --- INITIAL TEMPLATE DATABASE ---
const defaultTemplates: WorkoutPlan[] = [
  // --- ACADEMIA COMPLETA ---
  // Iniciante
  {
    planName: "Adaptação Total (Full Body)",
    difficulty: "Iniciante",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Iniciante",
    targetEquipment: "Academia Completa",
    duration: "45",
    warmup: "5 min esteira caminhada rápida + rotação de braços.",
    exercises: [
      { name: "Leg Press 45", sets: "3", reps: "12-15", notes: "Pés na largura do quadril." },
      { name: "Puxada Frontal (Polia)", sets: "3", reps: "12-15", notes: "Tronco levemente inclinado." },
      { name: "Supino Máquina", sets: "3", reps: "12-15", notes: "Controle na descida." },
      { name: "Elevação Lateral", sets: "3", reps: "12", notes: "Não suba além da linha do ombro." },
      { name: "Rosca Direta (Polia)", sets: "3", reps: "12", notes: "Cotovelos fixos." },
      { name: "Tríceps Corda", sets: "3", reps: "12", notes: "Estenda todo o braço." },
      { name: "Abdominal Supra", sets: "3", reps: "15-20", notes: "Olhando para o teto." }
    ],
    cooldown: "Alongamento leve de peitoral e pernas."
  },
  {
    planName: "Perda de Peso (Circuito)",
    difficulty: "Iniciante",
    targetGoal: "Perder Peso",
    targetLevel: "Iniciante",
    targetEquipment: "Academia Completa",
    duration: "45",
    warmup: "5 min elíptico moderado.",
    exercises: [
      { name: "Agachamento Globet (Halter)", sets: "3", reps: "15", notes: "Segure o peso no peito." },
      { name: "Remada Máquina", sets: "3", reps: "15", notes: "Sem descanso, vá para o próximo." },
      { name: "Polichinelo", sets: "3", reps: "30s", notes: "Acelere o ritmo." },
      { name: "Supino Vertical Máquina", sets: "3", reps: "15", notes: "Controle a respiração." },
      { name: "Prancha Abdominal", sets: "3", reps: "30s", notes: "Contraia o abdômen." }
    ],
    cooldown: "Caminhada leve 5 min na esteira."
  },
   // Intermediário
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
  // Avançado
  {
    planName: "Peito e Tríceps (Força)",
    difficulty: "Avançado",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Avançado",
    targetEquipment: "Academia Completa",
    duration: "60",
    warmup: "Aquecimento manguito + 2 séries leves supino.",
    exercises: [
      { name: "Supino Reto Barra", sets: "5", reps: "5", notes: "Foco em força (Carga alta)." },
      { name: "Supino Inclinado Halter", sets: "4", reps: "8-10", notes: "Controle total." },
      { name: "Crossover (Polia)", sets: "3", reps: "12-15", notes: "Pico de contração." },
      { name: "Tríceps Testa (Barra W)", sets: "4", reps: "8-10", notes: "Cuidado com cotovelos." },
      { name: "Mergulho nas Paralelas", sets: "3", reps: "Falha", notes: "Inclina o tronco pra frente." }
    ],
    cooldown: "Alongamento peitoral."
  },
  {
    planName: "Pernas Completo (Leg Day)",
    difficulty: "Avançado",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Avançado",
    targetEquipment: "Academia Completa",
    duration: "60",
    warmup: "5 min bike + mobilidade de quadril.",
    exercises: [
      { name: "Agachamento Livre", sets: "4", reps: "6-8", notes: "Profundidade máxima." },
      { name: "Leg Press 45", sets: "4", reps: "10-12", notes: "Carga alta." },
      { name: "Cadeira Extensora", sets: "3", reps: "15 + Drop", notes: "Drop-set na última." },
      { name: "Stiff com Barra", sets: "4", reps: "8-10", notes: "Foco no posterior." },
      { name: "Mesa Flexora", sets: "4", reps: "12", notes: "Controle a volta." },
      { name: "Panturrilha Sentado", sets: "5", reps: "15", notes: "Amplitude total." }
    ],
    cooldown: "Alongamento membros inferiores."
  },

  // --- APENAS HALTERES ---
  {
    planName: "Full Body Halteres",
    difficulty: "Iniciante",
    targetGoal: "Ganhar Músculo",
    targetLevel: "Iniciante",
    targetEquipment: "Apenas Halteres",
    duration: "45",
    warmup: "Polichinelos 30s + Rotação braços.",
    exercises: [
      { name: "Agachamento Globet", sets: "3", reps: "12", notes: "Halter no peito." },
      { name: "Supino Reto (Chão ou Banco)", sets: "3", reps: "12", notes: "Empurre controlado." },
      { name: "Remada Curvada Unilateral", sets: "3", reps: "12/lado", notes: "Costas retas." },
      { name: "Desenvolvimento Militar", sets: "3", reps: "10", notes: "Sentado ou em pé." },
      { name: "Rosca Martelo", sets: "3", reps: "12", notes: "Para bíceps." }
    ],
    cooldown: "Alongamento leve."
  },
  {
    planName: "Definição com Halteres",
    difficulty: "Intermediário",
    targetGoal: "Perder Peso",
    targetLevel: "Intermediário",
    targetEquipment: "Apenas Halteres",
    duration: "40",
    warmup: "1 min Corrida estacionária.",
    exercises: [
      { name: "Thruster (Agachamento + Desenvolvimento)", sets: "4", reps: "12", notes: "Movimento explosivo." },
      { name: "Passada (Avanço)", sets: "3", reps: "10/perna", notes: "Passos largos." },
      { name: "Remada Alta", sets: "3", reps: "15", notes: "Cotovelos acima do ombro." },
      { name: "Crucifixo Inverso", sets: "3", reps: "12", notes: "Para posterior de ombro." },
      { name: "Mountain Climbers", sets: "4", reps: "30s", notes: "Cardio no solo." }
    ],
    cooldown: "Respiração profunda."
  },
  {
    planName: "Halteres Hardcore",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    targetEquipment: "Apenas Halteres",
    duration: "50",
    warmup: "Mobilidade ombros e quadril.",
    exercises: [
      { name: "Agachamento Búlgaro", sets: "4", reps: "8/perna", notes: "Equilíbrio e força." },
      { name: "Supino Inclinado (ou Ponte Glúteo c/ Supino)", sets: "4", reps: "8-10", notes: "Carga máxima possível." },
      { name: "Remada Cavalinho (Halter)", sets: "4", reps: "10", notes: "Apoie o peito se precisar." },
      { name: "Levantamento Terra Romeno", sets: "4", reps: "10", notes: "Foco total na posterior." },
      { name: "Arnold Press", sets: "3", reps: "10", notes: "Rotação completa de ombro." }
    ],
    cooldown: "Alongamento estático."
  },

  // --- APENAS PESO DO CORPO (CALISTENIA) ---
  {
    planName: "Calistenia Básica",
    difficulty: "Iniciante",
    targetGoal: "Melhorar Resistência",
    targetLevel: "Iniciante",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "30",
    warmup: "Polichinelos 1 min.",
    exercises: [
      { name: "Agachamento Livre", sets: "3", reps: "15", notes: "Calcanhar no chão." },
      { name: "Flexão de Braços (Joelhos se precisar)", sets: "3", reps: "8-12", notes: "Peito quase no chão." },
      { name: "Prancha Abdominal", sets: "3", reps: "20-30s", notes: "Corpo reto." },
      { name: "Polichinelo", sets: "3", reps: "30", notes: "Cardio." },
      { name: "Ponte para Glúteos", sets: "3", reps: "15", notes: "Contraia glúteo no topo." }
    ],
    cooldown: "Alongamento."
  },
  {
    planName: "Queima Gordura em Casa",
    difficulty: "Intermediário",
    targetGoal: "Perder Peso",
    targetLevel: "Intermediário",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "40",
    warmup: "30s corrida no lugar + 30s polichinelo.",
    exercises: [
      { name: "Burpees", sets: "3", reps: "10", notes: "Intensidade!" },
      { name: "Agachamento com Salto", sets: "3", reps: "15", notes: "Amorteça a queda." },
      { name: "Flexão Diamante (ou fechada)", sets: "3", reps: "8-10", notes: "Foco tríceps." },
      { name: "Abdominal Bicicleta", sets: "3", reps: "20 total", notes: "Gire bem o tronco." },
      { name: "Avanço Alternado", sets: "3", reps: "20 total", notes: "Joelho quase toca o chão." }
    ],
    cooldown: "Alongamento de pernas."
  },
  {
    planName: "Calistenia Pro",
    difficulty: "Avançado",
    targetGoal: "Treino de Força",
    targetLevel: "Avançado",
    targetEquipment: "Apenas Peso do Corpo",
    duration: "50",
    warmup: "Mobilidade de punhos e ombros.",
    exercises: [
      { name: "Flexão Arqueiro (ou Uma mão assistida)", sets: "4", reps: "6-8/lado", notes: "Técnica apurada." },
      { name: "Pistol Squat (ou assistido)", sets: "4", reps: "5/perna", notes: "Agachamento unilateral." },
      { name: "Barra Fixa (Se tiver barra) ou Remada na Mesa", sets: "4", reps: "Max", notes: "Costas." },
      { name: "Flexão Plantar Unilateral", sets: "4", reps: "15/perna", notes: "Panturrilha." },
      { name: "Hollow Body Hold", sets: "4", reps: "45s", notes: "Abdômen de aço." }
    ],
    cooldown: "Yoga flow rápido."
  },

  // --- ACADEMIA EM CASA (BÁSICA) ---
  {
    planName: "Mix Equipamentos Leves",
    difficulty: "Iniciante",
    targetGoal: "Mobilidade e Flexibilidade",
    targetLevel: "Iniciante",
    targetEquipment: "Academia em Casa (Básica)",
    duration: "30",
    warmup: "Rotação articular geral.",
    exercises: [
      { name: "Agachamento Livre", sets: "3", reps: "12", notes: "Foco na postura." },
      { name: "Remada com Elástico (ou garrafa)", sets: "3", reps: "15", notes: "Aperte as escápulas." },
      { name: "Elevação Lateral (Halter leve/Garrafa)", sets: "3", reps: "12", notes: "Ombros." },
      { name: "Abdominal Remador", sets: "3", reps: "12", notes: "Completo." }
    ],
    cooldown: "Alongamento."
  },
  {
    planName: "Funcional Home",
    difficulty: "Intermediário",
    targetGoal: "Melhorar Resistência",
    targetLevel: "Intermediário",
    targetEquipment: "Academia em Casa (Básica)",
    duration: "45",
    warmup: "Pular corda (simulado) 2 min.",
    exercises: [
      { name: "Swing (Kettlebell ou Halter)", sets: "4", reps: "15", notes: "Explosão de quadril." },
      { name: "Flexão de Braços", sets: "4", reps: "12", notes: "Clássica." },
      { name: "Agachamento Isométrico (Parede)", sets: "3", reps: "45s", notes: "Segure firme." },
      { name: "Tríceps Banco", sets: "3", reps: "15", notes: "Use uma cadeira firme." }
    ],
    cooldown: "Alongamento."
  }
];

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'A Nova Era da Oasis: Expansão Aquática',
    category: 'Novidades',
    content: 'Estamos muito animados em compartilhar os detalhes do nosso novo complexo aquático! \n\nAlém de uma piscina semi-olímpica para treinos de performance, teremos uma área dedicada exclusivamente para a metodologia de Natação Kids, com água aquecida e tratamento a sal. \n\nPara os adultos, a Hidroginástica ganha um novo formato "Hidro Power", focado em queima calórica e baixo impacto. As obras estão a todo vapor e a previsão de inauguração é para o próximo semestre.',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop',
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
        title: p.title || 'Sem Título', // Fallback for old posts
        category: p.category || 'Geral', // Fallback for old posts
        likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
        comments: Array.isArray(p.comments) ? p.comments : []
      }));
      setBlogPosts(parsedPosts);
    }
    
    const savedTemplatesStr = localStorage.getItem('workoutTemplates');
    let finalTemplates = defaultTemplates;

    if (savedTemplatesStr) {
       const savedTemplates: WorkoutPlan[] = JSON.parse(savedTemplatesStr);
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

  const addPost = (title: string, category: string, text: string, image?: string) => {
    if (!currentUser) return;
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title,
      category,
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

  const findTemplate = (prefs: UserPreferences): WorkoutPlan | null => {
    const equipmentMatches = workoutTemplates.filter(t => t.targetEquipment === prefs.equipment);
    
    if (equipmentMatches.length === 0) {
        // Fallback: If "Home Gym" is requested but not found, try Bodyweight
        if (prefs.equipment === "Academia em Casa (Básica)") {
            const bodyweightMatches = workoutTemplates.filter(t => t.targetEquipment === "Apenas Peso do Corpo");
             if (bodyweightMatches.length > 0) return { ...bodyweightMatches[0], duration: prefs.duration };
        }
        return null;
    }

    let template: WorkoutPlan | null = null;
    
    // 1. Try exact match (Goal + Level)
    const exactMatches = equipmentMatches.filter(t => 
      t.targetGoal === prefs.goal && 
      t.targetLevel === prefs.level
    );

    if (exactMatches.length > 0) {
        template = exactMatches[Math.floor(Math.random() * exactMatches.length)];
    } else {
        // 2. Try match by Goal only (any level)
        const goalMatches = equipmentMatches.filter(t => t.targetGoal === prefs.goal);
        if (goalMatches.length > 0) {
            template = goalMatches[Math.floor(Math.random() * goalMatches.length)];
        } else {
             // 3. Try match by Level only (any goal)
            const levelMatches = equipmentMatches.filter(t => t.targetLevel === prefs.level);
            if (levelMatches.length > 0) {
                template = levelMatches[Math.floor(Math.random() * levelMatches.length)];
            } else {
                // 4. Random from correct equipment
                template = equipmentMatches[Math.floor(Math.random() * equipmentMatches.length)];
            }
        }
    }

    if (template) {
        return { ...template, duration: prefs.duration };
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