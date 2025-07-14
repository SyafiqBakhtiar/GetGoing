// App constants
export const APP_NAME = 'GetGoing';
export const APP_VERSION = '1.0.0';

// Database constants
export const DATABASE_NAME = 'getgoing.db';
export const DATABASE_VERSION = 1;

// Theme constants
export const THEME = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// Navigation constants
export const NAVIGATION = {
  screens: {
    HOME: 'Home',
    JOURNEY: 'Journey',
    INSIGHTS: 'Insights',
    PET: 'Pet',
    MORE: 'More',
    ONBOARDING: 'Onboarding',
  },
  tabs: {
    HOME: 'home',
    JOURNEY: 'journey',
    INSIGHTS: 'insights',
    PET: 'pet',
    MORE: 'more',
  },
};

// Feature constants
export const FOCUS_TIMER = {
  defaultWorkDuration: 25 * 60, // 25 minutes in seconds
  defaultShortBreakDuration: 5 * 60, // 5 minutes in seconds
  defaultLongBreakDuration: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4, // Every 4 work sessions
};

export const GAMIFICATION = {
  xpRewards: {
    completeHabit: 10,
    completeTask: 15,
    completeMilestone: 50,
    completeGoal: 100,
    focusSession: 5,
  },
  levelThresholds: [
    0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000
  ],
};

// API constants
export const API = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.getgoing.app',
  timeout: 10000,
  retryAttempts: 3,
};

// Storage keys
export const STORAGE_KEYS = {
  user: 'user',
  theme: 'theme',
  onboardingComplete: 'onboarding_complete',
  notificationSettings: 'notification_settings',
  focusSettings: 'focus_settings',
};

// Validation constants
export const VALIDATION = {
  goal: {
    titleMinLength: 3,
    titleMaxLength: 100,
    descriptionMaxLength: 500,
  },
  habit: {
    titleMinLength: 3,
    titleMaxLength: 50,
    descriptionMaxLength: 200,
  },
  task: {
    titleMinLength: 3,
    titleMaxLength: 100,
    descriptionMaxLength: 300,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  generic: 'Something went wrong. Please try again.',
  validation: 'Please check your input and try again.',
  unauthorized: 'Please log in to continue.',
  notFound: 'Resource not found.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  goalCreated: 'Goal created successfully!',
  habitCreated: 'Habit created successfully!',
  taskCompleted: 'Task completed!',
  habitCompleted: 'Habit completed!',
  dataSync: 'Data synchronized successfully!',
};