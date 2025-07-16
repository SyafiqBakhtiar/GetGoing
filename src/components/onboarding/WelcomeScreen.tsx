import { Ionicons } from '@expo/vector-icons';
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
import { useBackgroundGradient, useTheme } from '../../providers/ThemeProvider';
import type {
  ResponsiveConfiguration,
  ResponsiveStyles,
  ScreenDimensions,
  WelcomeScreenLayout,
} from '../../types';
import { detectPerformanceTier, getPerformanceConfig } from '../../utils/performanceTiers';
import {
  getButtonDimensions,
  getLandscapeLayoutConfig,
  getResponsiveConfig,
  getResponsiveFontSize,
  getResponsiveSize,
  getResponsiveSpacing,
  getSafeAreaSpacing,
  getThumbZoneSpacing,
} from '../../utils/responsive';
import { Typography } from '../../utils/typography';
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
    isLandscape: responsiveConfig.isLandscape,
    aspectRatio: responsiveConfig.aspectRatio,
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
  const landscapeConfig = getLandscapeLayoutConfig(responsiveConfig);
  
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
    landscape: landscapeConfig,
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
  const penguinAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const backgroundGradient = useBackgroundGradient();

  const { setTheme } = useTheme(); 
  const handleThemeChange = () => {
    setTheme('energetic'); // Changes to green theme 
  };
  
  // Get comprehensive responsive configuration
  const config = useMemo(() => {
    if (responsiveConfig) return responsiveConfig;
    
    // Create configuration with actual safe area insets
    const responsiveConfigLocal = getResponsiveConfig();
    const safeAreaSpacing = getSafeAreaSpacing(20, insets, responsiveConfigLocal);
    const baseConfig = createResponsiveConfiguration();
    
    const finalConfig = {
      ...baseConfig,
      layout: {
        ...baseConfig.layout,
        safeArea: safeAreaSpacing,
      },
    };
    
    
    return finalConfig;
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

  // Enhanced Trust Signal Component
  const TrustSignal = ({ spacing }: { spacing: number }) => (
    <View style={[styles.trustSignalContainer, { marginTop: spacing }]}>
      <View style={styles.premiumTrustBadge}>
        <View style={styles.trustIconContainer}>
          <Ionicons name="shield-checkmark" size={18} color="rgba(255, 255, 255, 0.95)" />
        </View>
        <Text style={[Typography.helpText, styles.trustText]}>
          Your data stays private & secure
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    // Enhanced entrance animation with staggered spring physics
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered animations for premium feel
    Animated.stagger(150, [
      Animated.spring(penguinAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(textAnim, {
        toValue: 1,
        tension: 70,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // Empty dependency array - animation should only run once on mount

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={backgroundGradient.colors as any}
        start={backgroundGradient.start}
        end={backgroundGradient.end}
        style={StyleSheet.absoluteFillObject}
      />
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
            flexDirection: config.layout.landscape?.useHorizontalLayout ? 'row' : 'column',
          },
        ]}
      >
        {config.layout.landscape?.useHorizontalLayout ? (
          // Landscape horizontal layout
          <>
            {/* Penguin Column */}
            <Animated.View style={[
              styles.penguinColumn,
              {
                width: config.layout.landscape.penguinColumnWidth as DimensionValue,
                marginRight: config.layout.landscape.horizontalSpacing,
                opacity: penguinAnim,
                transform: [
                  {
                    scale: penguinAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                  {
                    translateY: penguinAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }
            ]}>
              <View style={[
                styles.penguinContainer,
                styles.penguinContainerLandscape,
              ]}>
                <AnimatedPenguin 
                  size={config.styles.dimensions.penguin} 
                  useStaticViewBox={config.dimensions.deviceType === 'phone'}
                />
              </View>
            </Animated.View>

            {/* Content Column */}
            <View style={[
              styles.contentColumn,
              {
                width: config.layout.landscape.contentColumnWidth as DimensionValue,
                flex: 1,
              }
            ]}>
              {/* App branding */}
              <Animated.View style={[
                styles.brandingContainer, 
                styles.brandingContainerLandscape,
                {
                  opacity: textAnim,
                  transform: [
                    {
                      translateY: textAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }
              ]}>
                <View>
                  <Text style={[
                    Typography.appName,
                    styles.title,
                    {
                      marginBottom: config.styles.spacing.component,
                    }
                  ]}>GetGoing</Text>
                  <Text style={[
                    Typography.tagline,
                    styles.subtitle,
                  ]}>
                    Small Steps. Big Wins.
                  </Text>
                </View>
              </Animated.View>

              {/* Get Started button */}
              <Animated.View style={[
                styles.buttonContainer,
                styles.buttonContainerLandscape,
                {
                  minHeight: config.layout.buttonContainer.minHeight,
                  marginBottom: config.layout.buttonContainer.marginBottom,
                  opacity: buttonAnim,
                  transform: [
                    {
                      translateY: buttonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                    {
                      scale: buttonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                }
              ]}>
                <Button
                  title="Let's Begin"
                  onPress={handleGetStarted}
                  variant="primary"
                  size="large"
                  style={[
                    styles.getStartedButton,
                    {
                      width: config.styles.dimensions.button.width as DimensionValue,
                      minHeight: config.styles.dimensions.button.minHeight,
                    }
                  ]}
                  textStyle={[
                    styles.buttonText,
                    { fontSize: config.styles.fontSize.button }
                  ]}
                />
                <TrustSignal spacing={config.styles.spacing.component} />
              </Animated.View>
            </View>
          </>
        ) : (
          // Portrait vertical layout
          <>
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
              <Animated.View style={[
                styles.penguinContainer,
                { 
                  marginBottom: config.styles.spacing.component * SPACING_MULTIPLIERS.PENGUIN_BOTTOM_MARGIN,
                  opacity: penguinAnim,
                  transform: [
                    {
                      scale: penguinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                    {
                      translateY: penguinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                }
              ]}>
                <AnimatedPenguin 
                  size={config.styles.dimensions.penguin} 
                  useStaticViewBox={config.dimensions.deviceType === 'phone'}
                />
              </Animated.View>

              {/* App branding */}
              <Animated.View style={[
                styles.brandingContainer,
                {
                  opacity: textAnim,
                  transform: [
                    {
                      translateY: textAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }
              ]}>
                <View>
                  <Text style={[
                    Typography.appName,
                    styles.title,
                    {
                      marginBottom: config.styles.spacing.component,
                    }
                  ]}>GetGoing</Text>
                  <Text style={[
                    Typography.tagline,
                    styles.subtitle,
                  ]}>
                  Small Steps. Big Wins.
                  </Text>
                </View>
              </Animated.View>
            </View>

            {/* Get Started button - Optimally positioned */}
            <Animated.View style={[
              styles.buttonContainer,
              {
                minHeight: config.layout.buttonContainer.minHeight,
                marginBottom: config.layout.buttonContainer.marginBottom,
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                  {
                    scale: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }
            ]}>
              <Button
                title="Let's Begin"
                onPress={handleGetStarted}
                variant="primary"
                size="large"
                style={[
                  styles.getStartedButton,
                  {
                    width: config.styles.dimensions.button.width as DimensionValue,
                    minHeight: config.styles.dimensions.button.minHeight,
                  }
                ]}
                textStyle={[
                  styles.buttonText,
                  { fontSize: config.styles.fontSize.button }
                ]}
              />
              <TrustSignal spacing={config.styles.spacing.component} />
            </Animated.View>
          </>
        )}
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
    zIndex: 2,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  penguinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  brandingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  getStartedButton: {
    // Clean button without shadows
  },
  buttonText: {
    fontWeight: '600',
  },
  trialNote: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  // Landscape-specific styles
  penguinColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  penguinContainerLandscape: {
    marginBottom: 0,
  },
  brandingContainerLandscape: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonContainerLandscape: {
    justifyContent: 'flex-end',
  },
  // Trust Signal Styles
  trustSignalContainer: {
    alignItems: 'center',
    gap: 8,
  },
  premiumTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  trustIconContainer: {
    marginRight: 8,
    padding: 2,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
});