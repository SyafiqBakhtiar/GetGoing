import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, THEME } from '../constants';

// Types
export type ThemeMode = 'calm' | 'energetic' | 'focus' | 'wellness' | 'night' | 'minimalist' | 'nature-inspired' | 'corporate' | 'retro' | 'futuristic';
export type BackgroundGradient = typeof THEME.backgrounds.gradients[keyof typeof THEME.backgrounds.gradients];

interface ThemeContextType {
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  backgroundGradient: BackgroundGradient;
  isLoading: boolean;
  theme: typeof THEME;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme storage key
const THEME_STORAGE_KEY = `${STORAGE_KEYS.theme}_mode`;

export function ThemeProvider({ children, defaultTheme = 'futuristic' }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    // Temporary: Clear saved theme to test new default
    clearSavedTheme();
    loadThemeFromStorage();
  }, []);

  // Save theme to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveThemeToStorage(currentTheme);
    }
  }, [currentTheme, isLoading]);

  const loadThemeFromStorage = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      // Simple: Use saved theme if exists, otherwise use default
      if (savedTheme && isValidTheme(savedTheme)) {
        setCurrentTheme(savedTheme as ThemeMode);
      } else {
        setCurrentTheme(defaultTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
      setCurrentTheme(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeToStorage = async (theme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.log('Error saving theme to storage:', error);
    }
  };

  const clearSavedTheme = async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.log('Error clearing saved theme:', error);
    }
  };


  const isValidTheme = (theme: string): boolean => {
    return Object.keys(THEME.backgrounds.gradients).includes(theme);
  };

  const setTheme = (theme: ThemeMode) => {
    if (isValidTheme(theme)) {
      setCurrentTheme(theme);
    }
  };

  const backgroundGradient = THEME.backgrounds.gradients[currentTheme as keyof typeof THEME.backgrounds.gradients];

  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    backgroundGradient,
    isLoading,
    theme: THEME,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hook for background gradient
export function useBackgroundGradient(): BackgroundGradient {
  const { backgroundGradient } = useTheme();
  return backgroundGradient;
}

// Theme selector hook with all available themes
export function useThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  
  const availableThemes = Object.keys(THEME.backgrounds.gradients).map(key => {
    const themeKey = key as keyof typeof THEME.backgrounds.gradients;
    return {
      key: key as ThemeMode,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      description: THEME.backgrounds.gradients[themeKey].description,
      colors: THEME.backgrounds.gradients[themeKey].colors,
    };
  });

  return {
    currentTheme,
    setTheme,
    availableThemes,
  };
}