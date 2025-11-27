
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
  dateCreated?: string; // New field to track when it was saved
  // Fields for Template Bank matching
  targetGoal?: string;
  targetLevel?: string;
  targetEquipment?: string;
}

export interface UserPreferences {
  goal: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  equipment: string;
  duration: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string; // In a real app, this would be hashed.
  isAdmin: boolean;
  savedWorkouts: WorkoutPlan[];
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  date: string;
  author: {
    id: string;
    name: string;
    isAdmin: boolean;
    avatar?: string;
  }
}

export interface BlogPost {
  id: string;
  content: string;
  image?: string;
  date: string;
  likedBy: string[]; // Array of User IDs
  comments: Comment[];
  author: {
    id: string;
    name: string;
    isAdmin: boolean;
    avatar?: string;
  }
}

export enum NavLink {
  HOME = 'home',
  BLOG = 'blog',
  CLASSES = 'classes',
  TRAINER = 'trainer',
  MEMBERSHIP = 'membership',
}
