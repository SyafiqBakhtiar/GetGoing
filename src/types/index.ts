// Core app types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  progress: number;
  milestones: Milestone[];
  habits: Habit[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  goalId?: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
  reminders: Reminder[];
  completions: HabitCompletion[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  milestoneId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isCompleted: boolean;
  subtasks: Subtask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: string;
  note?: string;
}

export interface Reminder {
  id: string;
  habitId: string;
  time: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VirtualPet {
  id: string;
  name: string;
  level: number;
  xp: number;
  health: number;
  happiness: number;
  type: 'cat' | 'dog' | 'bird' | 'fish';
  accessories: string[];
  lastFed: string;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  duration: number;
  type: 'work' | 'short-break' | 'long-break';
  startTime: string;
  endTime?: string;
  isCompleted: boolean;
  taskId?: string;
  createdAt: string;
}

export interface AICoaching {
  id: string;
  type: 'suggestion' | 'insight' | 'motivation';
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Journey: undefined;
  Insights: undefined;
  Pet: undefined;
  More: undefined;
  Onboarding: undefined;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}