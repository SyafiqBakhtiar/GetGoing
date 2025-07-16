import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { THEME } from '../../constants';

const { width, height } = Dimensions.get('window');

interface VectorLayerProps {
  intensity?: 'light' | 'medium' | 'full';
  animate?: boolean;
}

export function VectorLayer({ intensity = 'medium', animate = true }: VectorLayerProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) return;

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();
    rotateAnimation.start();
    scaleAnimation.start();

    return () => {
      floatAnimation.stop();
      rotateAnimation.stop();
      scaleAnimation.stop();
    };
  }, [animate, floatAnim, rotateAnim, scaleAnim]);

  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'light': return 0.3;
      case 'medium': return 0.5;
      case 'full': return 0.7;
      default: return 0.5;
    }
  };

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { opacity: getIntensityOpacity() }]}>
      {/* Top Right Geometric Shape */}
      <Animated.View style={[
        styles.topRightShape,
        {
          transform: [
            { translateY: floatY },
            { rotate: rotation },
            { scale: scaleAnim },
          ],
        },
      ]}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.vectors.primary} stopOpacity="0.8" />
              <Stop offset="50%" stopColor={THEME.backgrounds.premiumElements.vectors.secondary} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.vectors.accent} stopOpacity="0.4" />
            </LinearGradient>
          </Defs>
          <Polygon
            points="100,20 170,80 130,160 70,160 30,80"
            fill="url(#goldGradient)"
            stroke={THEME.backgrounds.premiumElements.vectors.secondary}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </Svg>
      </Animated.View>

      {/* Bottom Left Circles */}
      <Animated.View style={[
        styles.bottomLeftShape,
        {
          transform: [
            { translateY: floatY },
            { scale: scaleAnim },
          ],
        },
      ]}>
        <Svg width={150} height={150} viewBox="0 0 150 150">
          <Defs>
            <LinearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.vectors.accent} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.vectors.subtle} stopOpacity="0.2" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="75"
            cy="75"
            r="60"
            fill="url(#circleGradient)"
            stroke={THEME.backgrounds.premiumElements.vectors.primary}
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <Circle
            cx="75"
            cy="75"
            r="35"
            fill="none"
            stroke={THEME.backgrounds.premiumElements.vectors.secondary}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </Svg>
      </Animated.View>

      {/* Center Background Accent */}
      <Animated.View style={[
        styles.centerAccent,
        {
          transform: [
            { rotate: rotation },
            { scale: scaleAnim },
          ],
        },
      ]}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          <Defs>
            <LinearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.vectors.subtle} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.vectors.primary} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          <Polygon
            points="150,50 250,150 150,250 50,150"
            fill="url(#centerGradient)"
            stroke={THEME.backgrounds.premiumElements.vectors.accent}
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        </Svg>
      </Animated.View>

      {/* Top Left Small Accents */}
      <Animated.View style={[
        styles.topLeftAccents,
        {
          transform: [
            { translateY: floatY },
            { scale: scaleAnim },
          ],
        },
      ]}>
        <Svg width={80} height={80} viewBox="0 0 80 80">
          <Circle
            cx="40"
            cy="40"
            r="20"
            fill={THEME.backgrounds.premiumElements.vectors.subtle}
            stroke={THEME.backgrounds.premiumElements.vectors.accent}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <Circle
            cx="40"
            cy="40"
            r="8"
            fill={THEME.backgrounds.premiumElements.vectors.primary}
            fillOpacity="0.6"
          />
        </Svg>
      </Animated.View>

      {/* Bottom Right Triangular Pattern */}
      <Animated.View style={[
        styles.bottomRightPattern,
        {
          transform: [
            { translateY: floatY },
            { rotate: rotation },
            { scale: scaleAnim },
          ],
        },
      ]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.vectors.secondary} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.vectors.subtle} stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          <Polygon
            points="60,20 100,80 20,80"
            fill="url(#triangleGradient)"
            stroke={THEME.backgrounds.premiumElements.vectors.primary}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </Svg>
      </Animated.View>
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
  topRightShape: {
    position: 'absolute',
    top: height * 0.1,
    right: -width * 0.1,
  },
  bottomLeftShape: {
    position: 'absolute',
    bottom: height * 0.15,
    left: -width * 0.05,
  },
  centerAccent: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.2,
  },
  topLeftAccents: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
  },
  bottomRightPattern: {
    position: 'absolute',
    bottom: height * 0.25,
    right: width * 0.1,
  },
});