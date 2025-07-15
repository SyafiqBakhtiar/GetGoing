import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  Dimensions,
  DimensionValue,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  ResponsiveConfiguration,
  ScreenDimensions,
  ResponsiveStyles,
  WelcomeScreenLayout,
} from '../../types';
import {
  getResponsiveConfig,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getSafeAreaSpacing,
  getButtonDimensions,
  getThumbZoneSpacing,
  getResponsiveSize,
} from '../../utils/responsive';
import { detectPerformanceTier, getPerformanceConfig } from '../../utils/performanceTiers';
import { Button } from '../ui/Button';
import { AnimatedPenguin } from './AnimatedPenguin';
import { SnowEffect } from './SnowEffect';

const { width, height } = Dimensions.get('window');

// Constants for spacing and animation
const SPACING_MULTIPLIERS = {
  SMALL_PHONE_MARGIN: 0.5,
  PENGUIN_BOTTOM_MARGIN: 2,
} as const;

const ANIMATION_CONFIG = {
  ENTRANCE_DURATION: 1000,
  INITIAL_SLIDE_OFFSET: 50,
  SUBTITLE_LINE_HEIGHT_MULTIPLIER: 1.3,
} as const;

// Comprehensive responsive configuration generator
const createResponsiveConfiguration = (): ResponsiveConfiguration => {
  const responsiveConfig = getResponsiveConfig();
  const insets = { top: 0, bottom: 0, left: 0, right: 0 }; // Will be overridden with actual insets
  
  const dimensions: ScreenDimensions = {
    width,
    height,
    scale: Dimensions.get('screen').scale,
    deviceType: responsiveConfig.deviceType,
    isSmallPhone: responsiveConfig.isSmallPhone,
    isLargeScreen: responsiveConfig.isLargeScreen,
    aspectRatio: width / height,
  };

  const styles: ResponsiveStyles = {
    fontSize: {
      title: getResponsiveFontSize(48, responsiveConfig),
      subtitle: getResponsiveFontSize(18, responsiveConfig),
      button: getResponsiveFontSize(18, responsiveConfig),
      caption: getResponsiveFontSize(14, responsiveConfig),
    },
    spacing: {
      vertical: getResponsiveSpacing(20, responsiveConfig),
      horizontal: getResponsiveSpacing(20, responsiveConfig),
      component: getResponsiveSpacing(16, responsiveConfig),
    },
    dimensions: {
      penguin: getResponsiveSize(160, responsiveConfig),
      button: getButtonDimensions(responsiveConfig),
      decorativeCircles: {
        top: {
          width: getResponsiveSize(320, responsiveConfig),
          height: getResponsiveSize(320, responsiveConfig),
          top: -getResponsiveSize(160, responsiveConfig),
          right: -getResponsiveSize(160, responsiveConfig),
        },
        bottom: {
          width: getResponsiveSize(384, responsiveConfig),
          height: getResponsiveSize(384, responsiveConfig),
          bottom: -getResponsiveSize(192, responsiveConfig),
          left: -getResponsiveSize(192, responsiveConfig),
        },
      },
    },
  };

  const { buttonContainerHeight, bottomOffset } = getThumbZoneSpacing(insets, responsiveConfig);
  
  const layout: WelcomeScreenLayout = {
    centeredContent: {
      flex: 1,
      marginTop: responsiveConfig.isSmallPhone ? styles.spacing.vertical * SPACING_MULTIPLIERS.SMALL_PHONE_MARGIN : undefined,
    },
    buttonContainer: {
      minHeight: buttonContainerHeight,
      marginBottom: bottomOffset,
    },
    safeArea: {
      paddingTop: styles.spacing.vertical * 2,
      paddingBottom: styles.spacing.vertical,
      paddingHorizontal: styles.spacing.horizontal,
    },
  };

  return { dimensions, styles, layout };
};

interface WelcomeScreenProps {
  onGetStarted: () => void;
  responsiveConfig?: ResponsiveConfiguration;
}


export function WelcomeScreen({ onGetStarted, responsiveConfig }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(ANIMATION_CONFIG.INITIAL_SLIDE_OFFSET)).current;
  
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  
  // Get comprehensive responsive configuration
  const config = useMemo(() => {
    if (responsiveConfig) return responsiveConfig;
    
    // Create configuration with actual safe area insets
    const responsiveConfigLocal = getResponsiveConfig();
    const safeAreaSpacing = getSafeAreaSpacing(20, insets, responsiveConfigLocal);
    const baseConfig = createResponsiveConfiguration();
    
    return {
      ...baseConfig,
      layout: {
        ...baseConfig.layout,
        safeArea: safeAreaSpacing,
      },
    };
  }, [responsiveConfig, insets]);

  // Handle app state changes for performance optimization
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);


  // Performance tier detection with responsive considerations
  const performanceTier = useMemo(() => detectPerformanceTier(), []);
  const isSmallPhone = useMemo(() => {
    const responsiveConfigLocal = getResponsiveConfig();
    return responsiveConfigLocal.isSmallPhone;
  }, []);
  
  const performanceConfig = useMemo(() => {
    const baseConfig = getPerformanceConfig(performanceTier);
    // Reduce effects intensity on small phones for better performance
    if (isSmallPhone) {
      return {
        ...baseConfig,
        snowIntensity: 'light' as const,
        sparkleCount: Math.max(baseConfig.sparkleCount - 2, 1),
        snowflakeMultiplier: 1.0, // No increase for small phones
      };
    }
    return baseConfig;
  }, [performanceTier, isSmallPhone]);


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
        duration: ANIMATION_CONFIG.ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_CONFIG.ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // Empty dependency array - animation should only run once on mount

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

      {/* Responsive decorative circles */}
      <View style={[
        styles.decorativeCircle,
        {
          width: config.styles.dimensions.decorativeCircles.top.width,
          height: config.styles.dimensions.decorativeCircles.top.height,
          top: config.styles.dimensions.decorativeCircles.top.top,
          right: config.styles.dimensions.decorativeCircles.top.right,
        }
      ]} />
      <View style={[
        styles.decorativeCircle,
        styles.bottomCircleColor,
        {
          width: config.styles.dimensions.decorativeCircles.bottom.width,
          height: config.styles.dimensions.decorativeCircles.bottom.height,
          bottom: config.styles.dimensions.decorativeCircles.bottom.bottom,
          left: config.styles.dimensions.decorativeCircles.bottom.left,
        }
      ]} />
      
      {/* Snow effect - adaptive intensity */}
      <SnowEffect 
        intensity={performanceConfig.snowIntensity} 
        multiplier={performanceConfig.snowflakeMultiplier}
      />

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: config.layout.safeArea.paddingTop,
            paddingBottom: config.layout.safeArea.paddingBottom,
            paddingHorizontal: config.layout.safeArea.paddingHorizontal,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Centered content: Penguin + Branding */}
        <View style={[
          styles.centeredContent,
          {
            flex: config.layout.centeredContent.flex,
            marginTop: config.layout.centeredContent.marginTop,
            marginBottom: config.layout.centeredContent.marginBottom,
          }
        ]}>
          {/* Penguin */}
          <View style={[
            styles.penguinContainer,
            { marginBottom: config.styles.spacing.component * SPACING_MULTIPLIERS.PENGUIN_BOTTOM_MARGIN }
          ]}>
            <AnimatedPenguin size={config.styles.dimensions.penguin} />
          </View>

          {/* App branding */}
          <View style={styles.brandingContainer}>
            <Text style={[
              styles.title,
              {
                fontSize: config.styles.fontSize.title,
                marginBottom: config.styles.spacing.component,
              }
            ]}>GetGoing</Text>
            <Text style={[
              styles.subtitle,
              {
                fontSize: config.styles.fontSize.subtitle,
                lineHeight: config.styles.fontSize.subtitle * ANIMATION_CONFIG.SUBTITLE_LINE_HEIGHT_MULTIPLIER,
              }
            ]}>
              Build habits. Crush goals.{'\n'}Stay motivated.
            </Text>
          </View>
        </View>

        {/* Get Started button - Optimally positioned */}
        <View style={[
          styles.buttonContainer,
          {
            minHeight: config.layout.buttonContainer.minHeight,
            marginBottom: config.layout.buttonContainer.marginBottom,
          }
        ]}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={[
              styles.getStartedButton,
              {
                width: config.styles.dimensions.button.width as DimensionValue,
                maxWidth: config.styles.dimensions.button.maxWidth,
                minHeight: config.styles.dimensions.button.minHeight,
              }
            ]}
            textStyle={[
              styles.buttonText,
              { fontSize: config.styles.fontSize.button }
            ]}
          />
          <Text style={[
            styles.trialNote,
            {
              fontSize: config.styles.fontSize.caption,
              marginTop: config.styles.spacing.component,
            }
          ]}>Free trial • No signup needed</Text>
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
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  penguinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  brandingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  getStartedButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  buttonText: {
    fontWeight: '600',
  },
  trialNote: {
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000, // Large value to ensure perfect circle regardless of size
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
  },
  bottomCircleColor: {
    backgroundColor: 'rgba(219, 39, 119, 0.05)',
  },
});