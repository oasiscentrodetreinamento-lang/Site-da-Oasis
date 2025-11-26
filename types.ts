export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export interface WorkoutPlan {
  planName: string;
  difficulty: string;
  duration: string;
  warmup: string;
  exercises: Exercise[];
  cooldown: string;
}

export interface UserPreferences {
  goal: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  equipment: string;
  duration: string;
}

export interface BlogPost {
  id: string;
  content: string;
  image?: string;
  date: string;
  likes: number;
}

export enum NavLink {
  HOME = 'home',
  BLOG = 'blog',
  CLASSES = 'classes',
  TRAINER = 'trainer',
  MEMBERSHIP = 'membership',
}