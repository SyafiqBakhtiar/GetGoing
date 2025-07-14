import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, ActivityIndicator } from 'react-native';
import { RootStackParamList, TabParamList } from './types';
import { OnboardingNavigator } from './WelcomeNavigator';
import { useOnboarding } from '../contexts/OnboardingContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Import tab screens
import HomeScreen from '@/src/screens/tabs/home';
import JourneyScreen from '@/src/screens/tabs/journey';
import InsightsScreen from '@/src/screens/tabs/insights';
import PetScreen from '@/src/screens/tabs/pet';
import MoreScreen from '@/src/screens/tabs/more';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom tab navigator component
function TabNavigator() {
  const colorScheme = useColorScheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="journey"
        component={JourneyScreen}
        options={{
          title: 'Journey',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'target' : 'target'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="insights"
        component={InsightsScreen}
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'chart.bar.fill' : 'chart.bar'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="pet"
        component={PetScreen}
        options={{
          title: 'Pet',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'heart.fill' : 'heart'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="more"
        component={MoreScreen}
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'ellipsis.circle.fill' : 'ellipsis.circle'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isOnboardingComplete, isLoading } = useOnboarding();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: 'modal',
        }}
      >
        {isOnboardingComplete ? (
          <Stack.Screen 
            name="TabNavigator" 
            component={TabNavigator}
          />
        ) : (
          <Stack.Screen 
            name="OnboardingFlow" 
            component={OnboardingNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}