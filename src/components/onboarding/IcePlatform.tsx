import React, { useRef, useEffect, useMemo } from 'react';
import { 
  View, 
  Animated, 
  StyleSheet, 
  Dimensions,
  Easing,
  AppState,
  AppStateStatus 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PerformanceConfig } from '../../utils/performanceTiers';

const { width } = Dimensions.get('window');

interface IcePlatformProps {
  performanceConfig: PerformanceConfig;
  shouldAnimate: boolean;
  size?: number;
  penguinSize?: number;
}

interface IceSparkleProps {
  index: number;
  delay: number;
  initialLeft: string;
  initialTop: string;
  shouldAnimate: boolean;
}

const IceSparkle = React.memo(function IceSparkle({ 
  index, 
  delay, 
  initialLeft, 
  initialTop, 
  shouldAnimate 
}: IceSparkleProps) {
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (!shouldAnimate) {
      animationsRef.current.forEach(animation => animation.stop());
      animationsRef.current = [];
      return;
    }

    const animateSparkle = () => {
      const sparkleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

      const scaleLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

      animationsRef.current = [sparkleLoop, scaleLoop];
      
      Animated.parallel([sparkleLoop, scaleLoop]).start();
    };

    const timer = setTimeout(() => {
      if (shouldAnimate) {
        animateSparkle();
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      animationsRef.current.forEach(animation => animation.stop());
    };
  }, [sparkleAnim, scaleAnim, delay, shouldAnimate]);

  return (
    <Animated.Text
      style={[
        styles.iceSparkle,
        {
          left: initialLeft as any,
          top: initialTop as any,
          opacity: sparkleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.8],
          }),
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      ✦
    </Animated.Text>
  );
});

export const IcePlatform = React.memo(function IcePlatform({ 
  performanceConfig, 
  shouldAnimate, 
  size = 260,
  penguinSize = 160
}: IcePlatformProps) {
  const iceFloatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pre-calculate sparkle positions around the platform edge
  const sparklePositions = useMemo(() => {
    return Array.from({ length: performanceConfig.sparkleCount }, (_, i) => {
      const angle = (i / performanceConfig.sparkleCount) * Math.PI * 2;
      const radius = size * 0.4; // Position sparkles around the edge
      const centerX = size / 2;
      const centerY = size / 2;
      
      return {
        left: `${((centerX + Math.cos(angle) * radius) / size) * 100}%`,
        top: `${((centerY + Math.sin(angle) * radius) / size) * 100}%`,
        delay: performanceConfig.staggerAnimations ? i * 600 : Math.random() * 3000,
      };
    });
  }, [performanceConfig, size]);

  useEffect(() => {
    if (!shouldAnimate || !performanceConfig.enableComplexAnimations) {
      return;
    }

    // Gentle floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iceFloatAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(iceFloatAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle breathing pulse
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();
    pulseAnimation.start();

    return () => {
      floatAnimation.stop();
      pulseAnimation.stop();
    };
  }, [shouldAnimate, performanceConfig.enableComplexAnimations, iceFloatAnim, pulseAnim]);

  const platformSize = Math.min(size, width * 0.6);
  
  // Calculate positioning for precise penguin feet contact
  // Penguin feet are at cy="221.5" out of 261 total SVG height (84.8% from top)
  // Platform should be positioned so penguin feet rest exactly on the surface
  const penguinFeetPercentage = 221.5 / 261; // 0.848
  const penguinFeetOffset = penguinSize * penguinFeetPercentage;
  // Position platform so its top surface aligns with penguin feet
  const platformOffset = penguinFeetOffset - (platformSize * 0.45 * 0.2); // 20% of platform height for surface contact

  return (
    <Animated.View
      style={[
        styles.icePlatformContainer,
        {
          width: platformSize,
          height: platformSize * 0.45, // Enhanced perspective - more elliptical
          bottom: -platformOffset, // Dynamic positioning based on penguin size
          marginLeft: -platformSize / 2, // Center horizontally
          transform: [
            { 
              translateY: performanceConfig.enableComplexAnimations 
                ? iceFloatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2],
                  })
                : 0
            },
            { 
              scale: performanceConfig.enableComplexAnimations ? pulseAnim : 1
            },
          ],
        },
      ]}
    >
      {/* Main ice platform with radial gradient */}
      <LinearGradient
        colors={
          performanceConfig.enableComplexAnimations
            ? [
                'rgba(224, 242, 254, 0.98)', // Brighter light blue center
                'rgba(186, 230, 253, 0.95)', // Light-medium blue
                'rgba(125, 211, 252, 0.9)',  // Medium blue
                'rgba(56, 189, 248, 0.85)',  // Medium-dark blue
                'rgba(14, 165, 233, 0.8)',   // Darker blue edge
                'rgba(2, 132, 199, 0.75)',   // Dark blue rim
                'rgba(1, 97, 154, 0.6)',     // Deep blue outer edge
              ]
            : [
                'rgba(224, 242, 254, 0.95)',
                'rgba(125, 211, 252, 0.85)',
                'rgba(14, 165, 233, 0.75)',
                'rgba(2, 132, 199, 0.6)',
              ]
        }
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={[styles.icePlatform, { borderRadius: platformSize / 2 }]}
      />

      {/* Edge glow effect */}
      {performanceConfig.enableComplexAnimations && (
        <View 
          style={[
            styles.edgeGlow, 
            { 
              width: platformSize + 8,
              height: (platformSize * 0.45) + 8,
              borderRadius: (platformSize + 8) / 2,
              marginLeft: -4,
              marginTop: -4,
            }
          ]} 
        />
      )}

      {/* Enhanced glossy surface reflection overlay */}
      {performanceConfig.enableComplexAnimations && (
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.5)', // Brighter reflection
            'rgba(255, 255, 255, 0.3)',
            'rgba(186, 230, 253, 0.2)', // Subtle blue tint
            'transparent',
            'transparent',
          ]}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.8, y: 0.9 }}
          style={[styles.reflection, { borderRadius: platformSize / 2 }]}
        />
      )}

      {/* Surface texture details */}
      {performanceConfig.enableComplexAnimations && (
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.1)',
            'transparent',
            'rgba(125, 211, 252, 0.1)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.surfaceTexture, { borderRadius: platformSize / 2 }]}
        />
      )}

      {/* Inner rim highlight */}
      <View 
        style={[
          styles.innerRim, 
          { 
            borderRadius: platformSize / 2 - 4,
            width: platformSize - 8,
            height: (platformSize * 0.45) - 8, // Match new elliptical ratio
          }
        ]} 
      />

      {/* Penguin shadow/reflection on ice surface */}
      <View style={[styles.penguinShadow, { 
        width: penguinSize * 0.6,
        height: penguinSize * 0.3,
        borderRadius: (penguinSize * 0.6) / 2,
        marginLeft: -(penguinSize * 0.6) / 2, // Dynamic centering
      }]} />

      {/* Ice sparkles positioned around the edge */}
      {sparklePositions.map((pos, i) => (
        <IceSparkle
          key={`platform-sparkle-${i}`}
          index={i}
          delay={pos.delay}
          initialLeft={pos.left}
          initialTop={pos.top}
          shouldAnimate={shouldAnimate}
        />
      ))}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  icePlatformContainer: {
    position: 'absolute',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icePlatform: {
    width: '100%',
    height: '100%',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  reflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  surfaceTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  innerRim: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iceSparkle: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textShadowColor: 'rgba(125, 211, 252, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  penguinShadow: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    backgroundColor: 'rgba(30, 27, 75, 0.2)', // Dark blue shadow
    opacity: 0.6,
  },
  edgeGlow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(125, 211, 252, 0.3)', // Subtle blue glow
    shadowColor: '#7DD3FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});