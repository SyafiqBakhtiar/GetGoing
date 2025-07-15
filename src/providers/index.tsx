import { PropsWithChildren } from 'react';
import { QueryProvider } from './QueryProvider';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <OnboardingProvider>
          {children}
        </OnboardingProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export { QueryProvider, ThemeProvider };