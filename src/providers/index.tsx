import { PropsWithChildren } from 'react';
import { QueryProvider } from './QueryProvider';
import { OnboardingProvider } from '../contexts/OnboardingContext';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </QueryProvider>
  );
}

export { QueryProvider };