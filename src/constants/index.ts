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
  backgrounds: {
    gradients: {
      calm: {
        colors: ['#F0F9FF', '#7DD3FC', '#0284C7', '#0C4A6E'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Calming blue gradient for focus and productivity',
      },
      energetic: {
        colors: ['#FEF3C7', '#F59E0B', '#DC2626', '#7F1D1D'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Energetic sunset gradient for motivation and action',
      },
      focus: {
        colors: ['#F8FAFC', '#E2E8F0', '#64748B', '#334155'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Neutral gray gradient for deep focus sessions',
      },
      wellness: {
        colors: ['#F7FDF7', '#BBF7D0', '#059669', '#064E3B'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Sage green gradient for mental wellness and balance',
      },
      night: {
        colors: ['#0F172A', '#1E293B', '#334155', '#475569'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Dark gradient for evening and night sessions',
      },
      minimalist: {
        colors: ['#FFFFFF', '#F8FAFC', '#E2E8F0', '#CBD5E1'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Clean minimalist gradient for distraction-free focus',
      },
      'nature-inspired': {
        colors: ['#F0FDF4', '#86EFAC', '#16A34A', '#14532D'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Natural earth tones for grounding and connection',
      },
      corporate: {
        colors: ['#F8FAFC', '#E1E7EF', '#3B82F6', '#1E3A8A'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Professional blue gradient for business environments',
      },
      retro: {
        colors: ['#FEF3C7', '#F59E0B', '#D97706', '#92400E'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Vintage warm gradient for nostalgic productivity',
      },
      futuristic: {
        colors: ['#0F0F23', '#1E1B4B', '#6366F1', '#06B6D4'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        description: 'Cyberpunk neon gradient for innovative thinking',
      },
    },
    solid: {
      light: '#F8FAFC',
      dark: '#0F172A',
      neutral: '#F1F5F9',
    },
    overlays: {
      light: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(0, 0, 0, 0.1)',
      accent: 'rgba(124, 58, 237, 0.05)',
    },
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
    inter: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semiBold: 'Inter_600SemiBold',
      bold: 'Inter_700Bold',
      extraBold: 'Inter_800ExtraBold',
    },
  },
  typography: {
    // Display styles for large headings
    display: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: 'bold' as const,
      letterSpacing: -0.5,
    },
    // Heading hierarchy
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 'bold' as const,
      letterSpacing: -0.25,
    },
    h2: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: 'bold' as const,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    // Body text styles
    body1: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    // Specialized text styles
    subtitle1: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500' as const,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500' as const,
      letterSpacing: 0.1,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 10,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
    // Button text styles
    button: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
    },
    // Link styles
    link: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
      textDecorationLine: 'underline' as const,
    },
    // Semantic Typography Variants
    // Screenshot-style (Bold, Strong) - for branding, primary headings, CTAs, achievements
    appName: {
      fontSize: 40,
      lineHeight: 48,
      fontWeight: 'bold' as const,
      letterSpacing: -0.5,
    },
    primaryHeading: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: 'bold' as const,
      letterSpacing: -0.25,
    },
    ctaButton: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: 'bold' as const,
      letterSpacing: 0.25,
      textTransform: 'none' as const,
    },
    achievement: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'bold' as const,
      letterSpacing: -0.25,
    },
    navigationHeader: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 'bold' as const,
      letterSpacing: 0,
    },
    heroSection: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 'bold' as const,
      letterSpacing: -0.25,
    },
    // Forest-style (Light/Regular) - for body text, descriptions, secondary content
    tagline: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '300' as const,
      letterSpacing: 0.15,
    },
    bodyText: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    secondaryHeading: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '500' as const,
      letterSpacing: 0,
    },
    formLabel: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    quote: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '300' as const,
      letterSpacing: 0,
      fontStyle: 'italic' as const,
    },
    helpText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '300' as const,
      letterSpacing: 0.1,
    },
    timestamp: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '300' as const,
      letterSpacing: 0.4,
    },
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