import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingStackParamList } from './types';
import { useOnboarding } from '../contexts/OnboardingContext';

// Import the welcome screen component
import { WelcomeScreen } from '../components/onboarding/WelcomeScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const { completeOnboarding } = useOnboarding();

  const handleOnboardingComplete = async () => {
    await completeOnboarding();
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Welcome">
        {() => <WelcomeScreen onGetStarted={handleOnboardingComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}