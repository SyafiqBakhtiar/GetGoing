import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

import { AppProviders } from '@/src/providers';
import { RootNavigator } from '@/src/navigation/RootNavigator';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppProviders>
      <RootNavigator />
      <StatusBar style="auto" />
    </AppProviders>
  );
}
