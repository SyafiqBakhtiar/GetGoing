import { TamaguiProvider as OriginalTamaguiProvider } from '@tamagui/core';
import { PropsWithChildren, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import config from '../../tamagui.config';

export function TamaguiProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  const tamaguiConfig = useMemo(() => {
    return {
      ...config,
      defaultTheme: colorScheme === 'dark' ? 'dark' : 'light',
    };
  }, [colorScheme]);

  return (
    <OriginalTamaguiProvider config={tamaguiConfig}>
      {children}
    </OriginalTamaguiProvider>
  );
}