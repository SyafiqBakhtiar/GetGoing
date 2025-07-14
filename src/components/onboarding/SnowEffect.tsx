import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Animated, Dimensions, StyleSheet, AppState, AppStateStatus } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SnowflakeProps {
  index: number;
  character: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  initialX: number;
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
  shouldAnimate 
}: SnowflakeProps) {
  const translateY = useRef(new Animated.Value(-10)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      animationRef.current?.stop();
      return;
    }

    const animateSnowflake = () => {
      // Reset position
      translateY.setValue(-10);
      translateX.setValue(0);
      rotate.setValue(0);

      // Create falling animation with wind effect
      animationRef.current = Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: Math.random() * 40 - 20, // Slight horizontal drift
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 360,
          duration: duration,
          useNativeDriver: true,
        }),
      ]);

      animationRef.current.start(({ finished }) => {
        if (finished && shouldAnimate) {
          // Restart animation only if still should animate
          animateSnowflake();
        }
      });
    };

    // Start with delay
    const timer = setTimeout(() => {
      if (shouldAnimate) {
        animateSnowflake();
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      animationRef.current?.stop();
    };
  }, [translateY, translateX, rotate, duration, delay, shouldAnimate]);

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

    const animateWindParticle = () => {
      // Reset position
      translateX.setValue(-10);
      translateY.setValue(initialY);
      opacity.setValue(0);

      // Create wind blowing animation
      animationRef.current = Animated.parallel([
        Animated.timing(translateX, {
          toValue: width + 20,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: initialY - 20, // Slight vertical drift
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration * 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration * 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.1,
            useNativeDriver: true,
          }),
        ]),
      ]);

      animationRef.current.start(({ finished }) => {
        if (finished && shouldAnimate) {
          // Restart animation only if still should animate
          animateWindParticle();
        }
      });
    };

    // Start with delay
    const timer = setTimeout(() => {
      if (shouldAnimate) {
        animateWindParticle();
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
}

export function SnowEffect({ intensity = 'medium' }: SnowEffectProps) {
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
    switch (intensity) {
      case 'light':
        return {
          layers: [
            { count: 8, character: '❄', sizes: [8, 10], opacities: [0.3, 0.4], durations: [15000, 18000] },
            { count: 6, character: '❅', sizes: [6, 8], opacities: [0.2, 0.3], durations: [18000, 22000] },
            { count: 4, character: '❆', sizes: [4, 6], opacities: [0.1, 0.2], durations: [20000, 25000] },
          ],
          windParticles: { count: 3, duration: 4000 },
        };
      case 'heavy':
        return {
          layers: [
            { count: 20, character: '❄', sizes: [12, 16, 20], opacities: [0.7, 0.8], durations: [8000, 10000, 12000] },
            { count: 15, character: '❅', sizes: [8, 12, 16], opacities: [0.5, 0.6], durations: [12000, 15000, 18000] },
            { count: 10, character: '❆', sizes: [6, 8, 10], opacities: [0.3, 0.4], durations: [18000, 22000, 26000] },
          ],
          windParticles: { count: 8, duration: 3000 },
        };
      default: // medium - optimized for performance
        return {
          layers: [
            { count: 15, character: '❄', sizes: [12, 16, 20], opacities: [0.8], durations: [8000, 10000, 12000] },
            { count: 10, character: '❅', sizes: [8, 12, 14], opacities: [0.6], durations: [12000, 15000, 18000] },
            { count: 8, character: '❆', sizes: [6, 8, 10], opacities: [0.4], durations: [18000, 22000, 26000] },
          ],
          windParticles: { count: 5, duration: 4000 },
        };
    }
  };

  const config = getMultiLayerConfig();

  // Pre-calculate positions to avoid render-time Math.random() calls
  const snowflakePositions = useMemo(() => {
    return config.layers.flatMap((layer) => 
      Array.from({ length: layer.count }, () => ({
        x: Math.random() * width,
        size: layer.sizes[Math.floor(Math.random() * layer.sizes.length)],
        opacity: layer.opacities[Math.floor(Math.random() * layer.opacities.length)],
        duration: layer.durations[Math.floor(Math.random() * layer.durations.length)],
        delay: Math.random() * 5000, // Stagger start times
      }))
    );
  }, [config]);

  const windParticlePositions = useMemo(() => {
    return Array.from({ length: config.windParticles.count }, () => ({
      y: Math.random() * height,
      delay: Math.random() * 2000,
    }));
  }, [config]);

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
    color: 'rgba(255, 255, 255, 0.8)',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  windParticle: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
});