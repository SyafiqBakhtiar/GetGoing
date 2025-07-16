import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Pattern, Polygon, Rect, Stop } from 'react-native-svg';
import { THEME } from '../../constants';

const { width, height } = Dimensions.get('window');

interface PremiumPatternProps {
  intensity?: 'subtle' | 'medium' | 'prominent';
  animate?: boolean;
}

export function PremiumPattern({ intensity = 'subtle', animate = true }: PremiumPatternProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    const fadeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    const slideAnimation = Animated.loop(
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    );

    fadeAnimation.start();
    slideAnimation.start();

    return () => {
      fadeAnimation.stop();
      slideAnimation.stop();
    };
  }, [animate, fadeAnim, slideAnim]);

  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'subtle': return 0.08;
      case 'medium': return 0.12;
      case 'prominent': return 0.18;
      default: return 0.08;
    }
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const patternOpacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, { opacity: getIntensityOpacity() }]}>
      {/* Grid Pattern */}
      <Animated.View style={[
        styles.gridPattern,
        {
          opacity: patternOpacity,
          transform: [{ translateX }],
        },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <Pattern
              id="gridPattern"
              patternUnits="userSpaceOnUse"
              width="40"
              height="40"
            >
              <Line
                x1="0"
                y1="0"
                x2="0"
                y2="40"
                stroke={THEME.backgrounds.premiumElements.vectors.subtle}
                strokeWidth="0.5"
              />
              <Line
                x1="0"
                y1="0"
                x2="40"
                y2="0"
                stroke={THEME.backgrounds.premiumElements.vectors.subtle}
                strokeWidth="0.5"
              />
            </Pattern>
            <LinearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.vectors.primary} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.vectors.subtle} stopOpacity="0.03" />
            </LinearGradient>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="url(#gridPattern)"
            opacity="0.6"
          />
        </Svg>
      </Animated.View>

      {/* Diagonal Lines Pattern */}
      <Animated.View style={[
        styles.diagonalPattern,
        {
          opacity: patternOpacity,
          transform: [{ translateX: translateX }],
        },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <Pattern
              id="diagonalPattern"
              patternUnits="userSpaceOnUse"
              width="60"
              height="60"
              patternTransform="rotate(45)"
            >
              <Line
                x1="0"
                y1="0"
                x2="0"
                y2="60"
                stroke={THEME.backgrounds.premiumElements.vectors.accent}
                strokeWidth="0.3"
                strokeOpacity="0.4"
              />
            </Pattern>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="url(#diagonalPattern)"
            opacity="0.4"
          />
        </Svg>
      </Animated.View>

      {/* Dot Pattern */}
      <Animated.View style={[
        styles.dotPattern,
        {
          opacity: patternOpacity,
          transform: [{ translateX: translateX }],
        },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <Pattern
              id="dotPattern"
              patternUnits="userSpaceOnUse"
              width="30"
              height="30"
            >
              <Circle
                cx="15"
                cy="15"
                r="1"
                fill={THEME.backgrounds.premiumElements.vectors.secondary}
                opacity="0.5"
              />
            </Pattern>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="url(#dotPattern)"
            opacity="0.3"
          />
        </Svg>
      </Animated.View>

      {/* Hexagon Pattern */}
      <Animated.View style={[
        styles.hexagonPattern,
        {
          opacity: patternOpacity,
          transform: [{ translateX: translateX }],
        },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <Pattern
              id="hexPattern"
              patternUnits="userSpaceOnUse"
              width="80"
              height="80"
            >
              <Polygon
                points="40,10 60,25 60,55 40,70 20,55 20,25"
                fill="none"
                stroke={THEME.backgrounds.premiumElements.vectors.primary}
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
            </Pattern>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="url(#hexPattern)"
            opacity="0.2"
          />
        </Svg>
      </Animated.View>

      {/* Radial Pattern */}
      <View style={styles.radialPattern}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.vectors.primary} stopOpacity="0.05" />
              <Stop offset="50%" stopColor={THEME.backgrounds.premiumElements.vectors.secondary} stopOpacity="0.02" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.vectors.accent} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>
          <Circle
            cx={width / 2}
            cy={height / 2}
            r={Math.max(width, height) * 0.6}
            fill="url(#radialGradient)"
          />
        </Svg>
      </View>
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
    zIndex: 0,
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  diagonalPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dotPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hexagonPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});