import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, AppState, AppStateStatus, Easing } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop
} from 'react-native-svg';
import { detectPerformanceTier } from '../../utils/performanceTiers';
import { getResponsiveConfig, getResponsiveViewBox } from '../../utils/responsive';

// Create animated versions of SVG components
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedPenguinProps {
  size?: number;
  useDynamicViewBox?: boolean; // Optional prop to disable dynamic viewBox
  useStaticViewBox?: boolean; // Force static viewBox (overrides useDynamicViewBox)
  debug?: boolean; // Optional prop to enable debug logging
}

export function AnimatedPenguin({ size = 160, useDynamicViewBox = true, useStaticViewBox = false, debug = false }: AnimatedPenguinProps) {
  const waddleAnim = useRef(new Animated.Value(0)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;
  const wingLeftAnim = useRef(new Animated.Value(0)).current;
  const wingRightAnim = useRef(new Animated.Value(0)).current;
  const footLeftAnim = useRef(new Animated.Value(0)).current;
  const footRightAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  // Ice floor sparkle animations
  const sparkle1Anim = useRef(new Animated.Value(0)).current;
  const sparkle2Anim = useRef(new Animated.Value(0)).current;
  const sparkle3Anim = useRef(new Animated.Value(0)).current;
  
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  // Responsive configuration for landscape optimization
  const responsiveConfig = useMemo(() => getResponsiveConfig(), []);
  const isLandscape = responsiveConfig.isLandscape;
  
  // Auto-detect mobile and default to static viewBox for ALL mobile phones
  const shouldUseStaticViewBox = useMemo(() => {
    if (useStaticViewBox) return true;
    
    // Auto-enable static viewBox for ALL mobile phones (simplified logic)
    const isMobilePhone = responsiveConfig.deviceType === 'phone';
    
    return isMobilePhone;
  }, [useStaticViewBox, responsiveConfig]);
  
  // Performance tier detection for adaptive sparkle count
  const performanceTier = useMemo(() => detectPerformanceTier(), []);
  const sparkleCount = useMemo(() => {
    switch (performanceTier) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }, [performanceTier]);
  
  // Landscape-specific size adjustments
  const adjustedSize = useMemo(() => {
    if (isLandscape) {
      return size * 0.8; // Reduce size in landscape for better fit
    }
    return size;
  }, [size, isLandscape]);
  
  // Ice floor scaling for landscape
  const iceFloorScale = useMemo(() => {
    if (isLandscape) {
      return { width: 1.6, height: 1.0 }; // Wider but same height in landscape
    }
    return { width: 1.8, height: 1.2 }; // Original proportions
  }, [isLandscape]);
  
  // Dynamic viewBox calculations with caching and fallback
  const iceFloorViewBox = useMemo(() => {
    if (shouldUseStaticViewBox || !useDynamicViewBox) {
      if (__DEV__ && debug) {
        console.log('AnimatedPenguin: Using static viewBox for ice floor', {
          shouldUseStaticViewBox,
          useDynamicViewBox,
          deviceType: responsiveConfig.deviceType,
          aspectRatio: responsiveConfig.aspectRatio
        });
      }
      return '0 0 500 320'; // Force static viewBox or fallback
    }
    
    try {
      return getResponsiveViewBox('0 0 500 320', responsiveConfig, debug);
    } catch (error) {
      if (__DEV__) {
        console.error('AnimatedPenguin: Error calculating ice floor viewBox, using fallback:', error);
      }
      return '0 0 500 320'; // Fallback to static viewBox on error
    }
  }, [responsiveConfig, useDynamicViewBox, shouldUseStaticViewBox, debug]);
  
  const penguinViewBox = useMemo(() => {
    if (shouldUseStaticViewBox || !useDynamicViewBox) {
      if (__DEV__ && debug) {
        console.log('AnimatedPenguin: Using static viewBox for penguin', {
          shouldUseStaticViewBox,
          useDynamicViewBox,
          deviceType: responsiveConfig.deviceType,
          aspectRatio: responsiveConfig.aspectRatio
        });
      }
      return '0 0 272 261'; // Force static viewBox or fallback
    }
    
    try {
      return getResponsiveViewBox('0 0 272 261', responsiveConfig, debug);
    } catch (error) {
      if (__DEV__) {
        console.error('AnimatedPenguin: Error calculating penguin viewBox, using fallback:', error);
      }
      return '0 0 272 261'; // Fallback to static viewBox on error
    }
  }, [responsiveConfig, useDynamicViewBox, shouldUseStaticViewBox, debug]);

  // Handle app state changes for performance optimization
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Animation control based on app focus
  useEffect(() => {
    const shouldAnimate = appState === 'active';

    if (shouldAnimate) {
      // Start all animations when app is active
      const waddleAnimation = Animated.loop(
        Animated.timing(waddleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const bobAnimation = Animated.loop(
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const wingLeftAnimation = Animated.loop(
        Animated.timing(wingLeftAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const wingRightAnimation = Animated.loop(
        Animated.timing(wingRightAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const footLeftAnimation = Animated.loop(
        Animated.timing(footLeftAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const footRightAnimation = Animated.loop(
        Animated.timing(footRightAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const shimmerAnimation = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      // Ice floor sparkle animations with staggered timing
      const sparkle1Animation = Animated.loop(
        Animated.timing(sparkle1Anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const sparkle2Animation = Animated.loop(
        Animated.timing(sparkle2Anim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      const sparkle3Animation = Animated.loop(
        Animated.timing(sparkle3Anim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      );

      // Store animations for cleanup (adaptive sparkle count)
      const baseAnimations = [
        waddleAnimation,
        bobAnimation,
        wingLeftAnimation,
        wingRightAnimation,
        footLeftAnimation,
        footRightAnimation,
        shimmerAnimation,
      ];
      
      const sparkleAnimations = [];
      if (sparkleCount >= 1) sparkleAnimations.push(sparkle1Animation);
      if (sparkleCount >= 2) sparkleAnimations.push(sparkle2Animation);
      if (sparkleCount >= 3) sparkleAnimations.push(sparkle3Animation);
      
      animationsRef.current = [...baseAnimations, ...sparkleAnimations];

      // Start all animations
      waddleAnimation.start();
      bobAnimation.start();
      wingLeftAnimation.start();
      wingRightAnimation.start();
      footLeftAnimation.start();
      footRightAnimation.start();
      shimmerAnimation.start();
      
      // Start sparkle animations with staggered delays (adaptive)
      if (sparkleCount >= 1) {
        const timeout1 = setTimeout(() => sparkle1Animation.start(), 0);
        timeoutsRef.current.push(timeout1);
      }
      if (sparkleCount >= 2) {
        const timeout2 = setTimeout(() => sparkle2Animation.start(), 600);
        timeoutsRef.current.push(timeout2);
      }
      if (sparkleCount >= 3) {
        const timeout3 = setTimeout(() => sparkle3Animation.start(), 1200);
        timeoutsRef.current.push(timeout3);
      }
    } else {
      // Stop all animations when app goes to background
      animationsRef.current.forEach(animation => animation.stop());
      animationsRef.current = [];
      
      // Clear all timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    }

    return () => {
      // Cleanup on unmount
      animationsRef.current.forEach(animation => animation.stop());
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [appState, waddleAnim, bobAnim, wingLeftAnim, wingRightAnim, footLeftAnim, footRightAnim, shimmerAnim, sparkle1Anim, sparkle2Anim, sparkle3Anim, sparkleCount]);

  const waddleTranslateX = waddleAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -2, 0, 2, 0],
  });

  const waddleRotate = waddleAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '-1deg', '0deg', '1deg', '0deg'],
  });

  const bobTranslateY = bobAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -2, 0],
  });

  // Wing animation interpolations - match web keyframes
  const wingLeftRotate = wingLeftAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-135deg', '-145deg', '-135deg'],
  });

  const wingLeftScaleY = wingLeftAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  const wingRightRotate = wingRightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['135deg', '145deg', '135deg'],
  });

  const wingRightScaleY = wingRightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  // Foot animation interpolations - match web alternating pattern
  const footLeftTranslateY = footLeftAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 1],
    outputRange: [0, -3, 0, 0],
  });

  const footLeftScaleX = footLeftAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 1],
    outputRange: [1, 1.2, 1, 1],
  });

  const footRightTranslateY = footRightAnim.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [0, 0, -3, 0],
  });

  const footRightScaleX = footRightAnim.interpolate({
    inputRange: [0, 0.5, 0.75, 1],
    outputRange: [1, 1, 1.2, 1],
  });


  // Sparkle opacity interpolations
  const sparkle1Opacity = sparkle1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkle2Opacity = sparkle2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  const sparkle3Opacity = sparkle3Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.9, 0],
  });

  return (
    <>
     {/* Static ice floor - not animated */}
     <Svg
     width={adjustedSize * iceFloorScale.width}
     height={adjustedSize * iceFloorScale.height}
     viewBox={iceFloorViewBox}
     style={{
       position: 'absolute',
       zIndex: -1,
     }}
   >
     <Defs>
          {/* Glass-like ice floor gradient */}
          <RadialGradient id="staticIceFloorGradient" cx="50%" cy="30%" r="90%">
            <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <Stop offset="20%" stopColor="rgba(240, 248, 255, 0.8)" />
            <Stop offset="40%" stopColor="rgba(219, 234, 254, 0.6)" />
            <Stop offset="60%" stopColor="rgba(147, 197, 253, 0.4)" />
            <Stop offset="80%" stopColor="rgba(59, 130, 246, 0.2)" />
            <Stop offset="100%" stopColor="rgba(29, 78, 216, 0.1)" />
          </RadialGradient>
          
          {/* Glass reflection gradient */}
          <LinearGradient id="glassReflectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.0)" />
            <Stop offset="30%" stopColor="rgba(255, 255, 255, 0.7)" />
            <Stop offset="70%" stopColor="rgba(255, 255, 255, 0.7)" />
            <Stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
          </LinearGradient>
          
          
          {/* Ice texture pattern */}
          <LinearGradient id="iceTextureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
            <Stop offset="100%" stopColor="rgba(186, 230, 253, 0.2)" />
          </LinearGradient>
        </Defs>

        {/* Main glass ice floor */}
        <Ellipse
          cx="250"
          cy="260"
          rx="150"
          ry="30"
          fill="url(#staticIceFloorGradient)"     
        />
        
        {/* Glass reflection highlight */}
        <Ellipse
          cx="250"
          cy="252"
          rx="120"
          ry="12"
          fill="url(#glassReflectionGradient)"
          opacity="0.8"
        />
        
        {/* Secondary reflection */}
        <Ellipse
          cx="250"
          cy="268"
          rx="80"
          ry="8"
          fill="url(#glassReflectionGradient)"
          opacity="0.4"
        />
        
        {/* Crystalline edge highlights */}
        <Ellipse
          cx="250"
          cy="260"
          rx="150"
          ry="30"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
        />
        
        
        {/* Enhanced ice floor sparkles with glow (responsive positioning) */}
        {sparkleCount >= 1 && (
          <G>
            {/* Sparkle 1 glow */}
            <AnimatedCircle
              cx="76%"
              cy="77.6%"
              r="8"
              fill="rgba(255, 255, 255, 0.2)"
              opacity={sparkle1Opacity}
            />
            {/* Sparkle 1 core */}
            <AnimatedCircle
              cx="76%"
              cy="77.6%"
              r="5"
              fill="#FFFFFF"
              opacity={sparkle1Opacity}
            />
          </G>
        )}
        {sparkleCount >= 2 && (
          <G>
            {/* Sparkle 2 glow */}
            <AnimatedCircle
              cx="78%"
              cy="83.8%"
              r="7"
              fill="rgba(255, 255, 255, 0.15)"
              opacity={sparkle2Opacity}
            />
            {/* Sparkle 2 core */}
            <AnimatedCircle
              cx="78%"
              cy="83.8%"
              r="4"
              fill="#FFFFFF"
              opacity={sparkle2Opacity}
            />
          </G>
        )}
        {sparkleCount >= 3 && (
          <G>
            {/* Sparkle 3 glow */}
            <AnimatedCircle
              cx="77%"
              cy="86.9%"
              r="10"
              fill="rgba(255, 255, 255, 0.25)"
              opacity={sparkle3Opacity}
            />
            {/* Sparkle 3 core */}
            <AnimatedCircle
              cx="77%"
              cy="86.9%"
              r="6"
              fill="#FFFFFF"
              opacity={sparkle3Opacity}
            />
          </G>
        )}
      </Svg>

    {/* Animated penguin */}
    <Animated.View
      style={{
        transform: [
          { translateX: waddleTranslateX },
          { rotate: waddleRotate },
          { translateY: bobTranslateY },
        ],
      }}
    >
      <Svg
        width={adjustedSize}
        height={adjustedSize * 0.97} // Maintain aspect ratio from original (155/160)
        viewBox={penguinViewBox}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        <Defs>
          {/* Body gradient */}
          <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0.6" stopColor="#312E81" />
            <Stop offset="1" stopColor="#0F172A" />
          </LinearGradient>
          
          {/* Head gradient */}
          <LinearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0.6" stopColor="#312E81" />
            <Stop offset="1" stopColor="#0F172A" />
          </LinearGradient>
          
          {/* Beak gradient */}
          <LinearGradient id="beakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0.6" stopColor="#FB923C" />
            <Stop offset="1" stopColor="#EA580C" />
          </LinearGradient>
          
          {/* Beak highlight */}
          <RadialGradient id="beakHighlight" cx="0%" cy="0%" r="100%">
            <Stop offset="0%" stopColor="#FFFAA0" />
            <Stop offset="100%" stopColor="#FCB276" />
          </RadialGradient>
        </Defs>

        {/* Body background */}
        <Ellipse 
          cx="131.5" 
          cy="158.5" 
          rx="61.5" 
          ry="56.5" 
          fill="url(#bodyGradient)" 
          stroke="white" 
          strokeOpacity="0.1" 
        />

        {/* White penguin body */}
        <Circle cx="131.5" cy="158.5" r="49.5" fill="white" />

        {/* Left wing - Animated */}
        <AnimatedG
          transform={[{ translateX: 209.5 }, { translateY: 168.023 }]}
        >
          <AnimatedEllipse
            cx="0"
            cy="0"
            rx="28.6216"
            ry="11.6835"
            fill="#3730A3"
            transform={[
              { rotate: wingLeftRotate },
              { scaleY: wingLeftScaleY },
            ]}
          />
        </AnimatedG>

        {/* Right wing - Animated */}
        <AnimatedG
          transform={[{ translateX: 53.5 }, { translateY: 168.5 }]}
        >
          <AnimatedEllipse
            cx="0"
            cy="0"
            rx="28.6216"
            ry="11.6835"
            fill="#3730A3"
            transform={[
              { rotate: wingRightRotate },
              { scaleY: wingRightScaleY },
            ]}
          />
        </AnimatedG>

        {/* Head background */}
        <Ellipse 
          cx="132.5" 
          cy="101.5" 
          rx="84.5" 
          ry="85.5" 
          fill="url(#headGradient)" 
          stroke="white" 
          strokeOpacity="0.1" 
        />

        {/* Beak */}
        <Path
          d="M150 125C150 127.101 149.573 129.182 148.744 131.123C147.915 133.064 146.699 134.828 145.167 136.314C143.635 137.799 141.816 138.978 139.814 139.782C137.812 140.586 135.667 141 133.5 141C131.333 141 129.188 140.586 127.186 139.782C125.184 138.978 123.365 137.799 121.833 136.314C120.301 134.828 119.085 133.064 118.256 131.123C117.427 129.182 117 127.101 117 125L133.5 125H150Z"
          fill="url(#beakGradient)"
        />

        {/* Feet - Animated */}
        <AnimatedG
          transform={[{ translateX: 107.5 }, { translateY: 221.5 }]}
        >
          <AnimatedEllipse
            cx="0"
            cy="0"
            rx="17.5"
            ry="7.5"
            fill="#FB923C"
            transform={[
              { translateY: footLeftTranslateY },
              { scaleX: footLeftScaleX },
            ]}
          />
        </AnimatedG>
        
        <AnimatedG
          transform={[{ translateX: 157.5 }, { translateY: 221.5 }]}
        >
          <AnimatedEllipse
            cx="0"
            cy="0"
            rx="17.5"
            ry="7.5"
            fill="#FB923C"
            transform={[
              { translateY: footRightTranslateY },
              { scaleX: footRightScaleX },
            ]}
          />
        </AnimatedG>

        {/* Eyes */}
        <Ellipse cx="95" cy="90" rx="30" ry="35" fill="white" />
        <Ellipse cx="100.5" cy="90.5" rx="22.5" ry="27.5" fill="black" />
        <Ellipse cx="170" cy="90" rx="30" ry="35" fill="white" />
        <Ellipse cx="166.5" cy="89.5" rx="22.5" ry="27.5" fill="black" />
        <Circle cx="158.5" cy="77.5" r="7.5" fill="white" />
        <Circle cx="91.5" cy="77.5" r="7.5" fill="white" />

        {/* Beak highlight */}
        <Path
          d="M150.734 128.048C150.011 124.062 147.847 120.457 144.631 117.882C141.416 115.308 137.361 113.932 133.195 114.003C129.028 114.073 125.025 115.586 121.904 118.268C118.783 120.95 116.75 124.626 116.17 128.634L133.5 131L150.734 128.048Z"
          fill="url(#beakHighlight)"
        />
      </Svg>
    </Animated.View>
    </>
  );
}