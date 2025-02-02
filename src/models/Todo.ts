export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skatingStyle: 'freestyle' | 'speed' | 'dance' | 'slalom';
  createdAt: Date;
  completedAt?: Date;
  points: number;
  streakCount: number;
} 