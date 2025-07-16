import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { THEME } from '../../constants';

const { width, height } = Dimensions.get('window');

interface DepthOverlayProps {
  intensity?: 'subtle' | 'medium' | 'prominent';
  animate?: boolean;
}

export function DepthOverlay({ intensity = 'medium', animate = true }: DepthOverlayProps) {
  const depthAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    const depthAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(depthAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(depthAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    const shadowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    );

    depthAnimation.start();
    glowAnimation.start();
    shadowAnimation.start();

    return () => {
      depthAnimation.stop();
      glowAnimation.stop();
      shadowAnimation.stop();
    };
  }, [animate, depthAnim, glowAnim, shadowAnim]);

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'subtle': return 0.6;
      case 'medium': return 1.0;
      case 'prominent': return 1.4;
      default: return 1.0;
    }
  };

  const intensityMultiplier = getIntensityMultiplier();

  const depthOpacity = depthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3 * intensityMultiplier, 0.7 * intensityMultiplier],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1 * intensityMultiplier, 0.3 * intensityMultiplier],
  });

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05 * intensityMultiplier, 0.15 * intensityMultiplier],
  });

  return (
    <View style={styles.container}>
      {/* Base Depth Layer */}
      <Animated.View style={[
        styles.baseDepthLayer,
        { opacity: depthOpacity },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="baseDepthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer1} stopOpacity="0.8" />
              <Stop offset="50%" stopColor={THEME.backgrounds.premiumElements.depths.layer2} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.4" />
            </LinearGradient>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="url(#baseDepthGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Top Shadow Layer */}
      <Animated.View style={[
        styles.topShadowLayer,
        { opacity: shadowOpacity },
      ]}>
        <Svg width={width} height={height * 0.5} viewBox={`0 0 ${width} ${height * 0.5}`}>
          <Defs>
            <LinearGradient id="topShadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect
            width={width}
            height={height * 0.5}
            fill="url(#topShadowGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Bottom Shadow Layer */}
      <Animated.View style={[
        styles.bottomShadowLayer,
        { opacity: shadowOpacity },
      ]}>
        <Svg width={width} height={height * 0.5} viewBox={`0 0 ${width} ${height * 0.5}`}>
          <Defs>
            <LinearGradient id="bottomShadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.8" />
            </LinearGradient>
          </Defs>
          <Rect
            width={width}
            height={height * 0.5}
            fill="url(#bottomShadowGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Central Glow Effect */}
      <Animated.View style={[
        styles.centralGlowLayer,
        { opacity: glowOpacity },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <RadialGradient id="centralGlowGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.goldGlow} stopOpacity="0.6" />
              <Stop offset="50%" stopColor={THEME.backgrounds.premiumElements.depths.goldGlow} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.goldGlow} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width * 0.6}
            ry={height * 0.4}
            fill="url(#centralGlowGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Highlight Layer */}
      <Animated.View style={[
        styles.highlightLayer,
        { opacity: depthOpacity },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.highlight} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.highlight} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect
            width={width * 0.3}
            height={height * 0.4}
            x={0}
            y={0}
            fill="url(#highlightGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Corner Shadows */}
      <Animated.View style={[
        styles.cornerShadows,
        { opacity: shadowOpacity },
      ]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <RadialGradient id="topLeftShadow" cx="0%" cy="0%" r="30%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="topRightShadow" cx="100%" cy="0%" r="30%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bottomLeftShadow" cx="0%" cy="100%" r="30%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bottomRightShadow" cx="100%" cy="100%" r="30%">
              <Stop offset="0%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width={width * 0.3} height={height * 0.3} x={0} y={0} fill="url(#topLeftShadow)" />
          <Rect width={width * 0.3} height={height * 0.3} x={width * 0.7} y={0} fill="url(#topRightShadow)" />
          <Rect width={width * 0.3} height={height * 0.3} x={0} y={height * 0.7} fill="url(#bottomLeftShadow)" />
          <Rect width={width * 0.3} height={height * 0.3} x={width * 0.7} y={height * 0.7} fill="url(#bottomRightShadow)" />
        </Svg>
      </Animated.View>

      {/* Subtle Vignette Effect */}
      <View style={styles.vignetteLayer}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <RadialGradient id="vignetteGradient" cx="50%" cy="50%" r="70%">
              <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
              <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
              <Stop offset="100%" stopColor={THEME.backgrounds.premiumElements.depths.layer3} stopOpacity="0.2" />
            </RadialGradient>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="url(#vignetteGradient)"
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
    zIndex: 1,
  },
  baseDepthLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topShadowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomShadowLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  centralGlowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  highlightLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cornerShadows: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  vignetteLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});