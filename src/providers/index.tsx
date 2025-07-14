import { PropsWithChildren } from 'react';
import { QueryProvider } from './QueryProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}

export { QueryProvider };