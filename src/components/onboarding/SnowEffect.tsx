import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Animated, Dimensions, StyleSheet, AppState, AppStateStatus, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SnowflakeProps {
  index: number;
  character: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  initialX: number;
  initialY: number;
  shouldAnimate: boolean;
}

const Snowflake = React.memo(function Snowflake({ 
  index, 
  character, 
  size, 
  opacity, 
  duration, 
  delay, 
  initialX, 
  initialY, 
  shouldAnimate 
}: SnowflakeProps) {
  const translateY = useRef(new Animated.Value(initialY)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      animationRef.current?.stop();
      return;
    }

    // Pre-calculate random drift to avoid render-time calculations
    const horizontalDrift = (Math.random() - 0.5) * 30; // -15 to 15 range
    const shouldRotate = index % 2 === 0;

    // Set initial position
    translateY.setValue(initialY);
    translateX.setValue(0);
    rotate.setValue(0);

    const animations = [
      Animated.loop(
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        { resetBeforeIteration: true }
      ),
      Animated.loop(
        Animated.timing(translateX, {
          toValue: horizontalDrift,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        { resetBeforeIteration: true }
      ),
    ];

    if (shouldRotate) {
      animations.push(
        Animated.loop(
          Animated.timing(rotate, {
            toValue: 360,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          { resetBeforeIteration: true }
        )
      );
    }

    // Start with delay
    const timer = setTimeout(() => {
      if (shouldAnimate) {
        animationRef.current = Animated.parallel(animations);
        animationRef.current.start();
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      animationRef.current?.stop();
    };
  }, [translateY, translateX, rotate, duration, delay, shouldAnimate, initialY]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Text
      style={[
        styles.snowflake,
        {
          left: initialX,
          fontSize: size,
          opacity: opacity,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    >
      {character}
    </Animated.Text>
  );
});

interface WindParticleProps {
  index: number;
  duration: number;
  delay: number;
  initialY: number;
  shouldAnimate: boolean;
}

const WindParticle = React.memo(function WindParticle({ 
  index, 
  duration, 
  delay, 
  initialY, 
  shouldAnimate 
}: WindParticleProps) {
  const translateX = useRef(new Animated.Value(-10)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      animationRef.current?.stop();
      return;
    }

    // Set initial position
    translateX.setValue(-10);
    translateY.setValue(initialY);
    opacity.setValue(0);

    // Create wind blowing animation with smooth looping
    const windAnimation = Animated.loop(
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: width + 20,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: initialY - 20, // Slight vertical drift
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration * 0.1,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration * 0.8,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.1,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      { resetBeforeIteration: true }
    );

    // Start with delay
    const timer = setTimeout(() => {
      if (shouldAnimate) {
        animationRef.current = windAnimation;
        animationRef.current.start();
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      animationRef.current?.stop();
    };
  }, [translateX, translateY, opacity, duration, delay, shouldAnimate, initialY]);

  return (
    <Animated.View
      style={[
        styles.windParticle,
        {
          top: initialY,
          opacity: opacity,
          transform: [
            { translateX },
            { translateY },
          ],
        },
      ]}
    />
  );
});

interface SnowEffectProps {
  intensity?: 'light' | 'medium' | 'heavy';
  multiplier?: number;
}

export function SnowEffect({ intensity = 'medium', multiplier = 1.0 }: SnowEffectProps) {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  
  // Handle app state changes for performance optimization
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const shouldAnimate = appState === 'active';

  const getMultiLayerConfig = () => {
    const applyMultiplier = (count: number) => Math.round(count * multiplier);
    
    switch (intensity) {
      case 'light':
        return {
          layers: [
            { count: applyMultiplier(8), character: '❄', sizes: [18, 22], opacities: [0.6, 0.7], durations: [15000, 18750] },
            { count: applyMultiplier(5), character: '❅', sizes: [16, 18], opacities: [0.5, 0.6], durations: [18750, 26250] },
            { count: applyMultiplier(3), character: '❆', sizes: [14, 16], opacities: [0.4, 0.5], durations: [22500, 30000] },
          ],
          windParticles: { count: applyMultiplier(3), duration: 6000 },
        };
      case 'heavy':
        return {
          layers: [
            { count: applyMultiplier(18), character: '❄', sizes: [24, 28, 32], opacities: [0.8, 0.9], durations: [15000, 18750] },
            { count: applyMultiplier(12), character: '❅', sizes: [20, 24, 28], opacities: [0.7, 0.8], durations: [18750, 26250] },
            { count: applyMultiplier(6), character: '❆', sizes: [16, 20, 24], opacities: [0.6, 0.7], durations: [22500, 30000] },
          ],
          windParticles: { count: applyMultiplier(6), duration: 4500 },
        };
      default: // medium - optimized for performance
        return {
          layers: [
            { count: applyMultiplier(15), character: '❄', sizes: [22, 26, 30], opacities: [0.9], durations: [15000, 18750] },
            { count: applyMultiplier(10), character: '❅', sizes: [18, 22, 26], opacities: [0.8], durations: [18750, 26250] },
            { count: applyMultiplier(5), character: '❆', sizes: [16, 18, 20], opacities: [0.7], durations: [22500, 30000] },
          ],
          windParticles: { count: applyMultiplier(4), duration: 6000 },
        };
    }
  };

  const config = getMultiLayerConfig();

  // Pre-calculate positions using easing-based distribution for better performance
  const snowflakePositions = useMemo(() => {
    let globalIndex = 0;
    const totalSnowflakes = config.layers.reduce((sum, layer) => sum + layer.count, 0);
    
    return config.layers.flatMap((layer) => 
      Array.from({ length: layer.count }, (_, index) => {
        const normalizedIndex = globalIndex / Math.max(totalSnowflakes - 1, 1); // 0 to 1
        globalIndex++;
        
        // Use easing functions for natural distribution
        const shouldStartInScreen = globalIndex % 2 === 0; // Alternating pattern
        const initialY = shouldStartInScreen 
          ? Easing.out(Easing.quad)(normalizedIndex) * (height / 4) // Top 25% using easing curve
          : -10; // Traditional start position above screen
        
        return {
          x: (globalIndex * 73) % width, // Prime number distribution for even spread
          initialY: initialY,
          size: layer.sizes[Math.floor(Easing.linear(normalizedIndex) * layer.sizes.length) % layer.sizes.length],
          opacity: layer.opacities[Math.floor(Easing.linear(normalizedIndex) * layer.opacities.length) % layer.opacities.length],
          duration: layer.durations[Math.floor(Easing.linear(normalizedIndex) * layer.durations.length) % layer.durations.length],
          delay: Easing.in(Easing.cubic)(normalizedIndex) * 1000, // Progressive 0-1s delays
        };
      })
    );
  }, [config, height, width]);

  const windParticlePositions = useMemo(() => {
    return Array.from({ length: config.windParticles.count }, (_, index) => {
      const normalizedIndex = index / Math.max(config.windParticles.count - 1, 1);
      return {
        y: Easing.inOut(Easing.quad)(normalizedIndex) * height, // Distributed across height
        delay: Easing.out(Easing.cubic)(normalizedIndex) * 2000, // Staggered 0-2s delays
      };
    });
  }, [config, height]);

  const allSnowflakes = config.layers.flatMap((layer, layerIndex) => 
    Array.from({ length: layer.count }, (_, index) => {
      const globalIndex = config.layers.slice(0, layerIndex).reduce((sum, l) => sum + l.count, 0) + index;
      const pos = snowflakePositions[globalIndex];

      return (
        <Snowflake
          key={`${layerIndex}-${index}`}
          index={index}
          character={layer.character}
          size={pos.size}
          opacity={pos.opacity}
          duration={pos.duration}
          delay={pos.delay}
          initialX={pos.x}
          initialY={pos.initialY}
          shouldAnimate={shouldAnimate}
        />
      );
    })
  );

  const windParticles = Array.from({ length: config.windParticles.count }, (_, index) => (
    <WindParticle
      key={`wind-${index}`}
      index={index}
      duration={config.windParticles.duration}
      delay={windParticlePositions[index].delay}
      initialY={windParticlePositions[index].y}
      shouldAnimate={shouldAnimate}
    />
  ));

  return (
    <View style={styles.container} pointerEvents="none">
      {allSnowflakes}
      {windParticles}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  snowflake: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    fontWeight: 'bold',
  },
  windParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
});