import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { detectPerformanceTier, getPerformanceConfig } from '../../utils/performanceTiers';
import { Button } from '../ui/Button';
import { AnimatedPenguin } from './AnimatedPenguin';
import { SnowEffect } from './SnowEffect';

const { width, height } = Dimensions.get('window');

// Responsive spacing system optimized for centered layout
const getResponsiveSpacing = () => {
  const baseHeight = 800; // Reference height for scaling
  const scale = height / baseHeight;
  
  return {
    buttonSectionHeight: Math.max(height * 0.18, 120), // Adequate space for button + trial note
    verticalPadding: Math.max(height * 0.04, 20), // Consistent padding
  };
};

interface WelcomeScreenProps {
  onGetStarted: () => void;
}


export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  
  // Get responsive spacing
  const spacing = useMemo(() => getResponsiveSpacing(), []);

  // Handle app state changes for performance optimization
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const shouldAnimate = appState === 'active';

  // Performance tier detection
  const performanceTier = useMemo(() => detectPerformanceTier(), []);
  const performanceConfig = useMemo(() => getPerformanceConfig(performanceTier), [performanceTier]);


  const handleGetStarted = async () => {
    // Add haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onGetStarted();
  };

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Optimized single background gradient */}
      <LinearGradient
        colors={[
          '#64748B', 
          '#7C3AED', 
          '#312E81', 
          '#1E1B4B'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative circles */}
      <View style={[styles.decorativeCircle, styles.topCircle]} />
      <View style={[styles.decorativeCircle, styles.bottomCircle]} />
      
      {/* Snow effect - adaptive intensity */}
      <SnowEffect intensity={performanceConfig.snowIntensity} />

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + spacing.verticalPadding, 40),
            paddingBottom: Math.max(insets.bottom + spacing.verticalPadding, 20),
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Centered content: Penguin + Branding */}
        <View style={styles.centeredContent}>
          {/* Penguin */}
          <View style={styles.penguinContainer}>
            <AnimatedPenguin size={Math.min(160, width * 0.4)} />
          </View>

          {/* App branding */}
          <View style={styles.brandingContainer}>
            <Text style={styles.title}>GetGoing</Text>
            <Text style={styles.subtitle}>
              Build habits. Crush goals.{'\n'}Stay motivated.
            </Text>
          </View>
        </View>

        {/* Get Started button - Fixed at bottom */}
        <View style={[styles.buttonContainer, {
          minHeight: spacing.buttonSectionHeight,
        }]}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={styles.getStartedButton}
            textStyle={styles.buttonText}
          />
          <Text style={styles.trialNote}>Free trial • No signup needed</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, width * 0.08), // Responsive padding
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  penguinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 32,
  },
  brandingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Math.min(48, width * 0.12), // Responsive font size
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: Math.min(18, width * 0.045), // Responsive font size
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: Math.min(24, width * 0.06),
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  getStartedButton: {
    width: '80%',
    maxWidth: 280,
    minHeight: 44, // Ensure minimum touch target
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  trialNote: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    textAlign: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
  },
  topCircle: {
    width: 320,
    height: 320,
    top: -160,
    right: -160,
  },
  bottomCircle: {
    width: 384,
    height: 384,
    bottom: -192,
    left: -192,
    backgroundColor: 'rgba(219, 39, 119, 0.05)',
  },
});