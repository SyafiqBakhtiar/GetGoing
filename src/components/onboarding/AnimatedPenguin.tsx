import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, AppStateStatus, Easing } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  G
} from 'react-native-svg';

// Create animated versions of SVG components
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

interface AnimatedPenguinProps {
  size?: number;
}

export function AnimatedPenguin({ size = 160 }: AnimatedPenguinProps) {
  const waddleAnim = useRef(new Animated.Value(0)).current;
  const bobAnim = useRef(new Animated.Value(0)).current;
  const wingLeftAnim = useRef(new Animated.Value(0)).current;
  const wingRightAnim = useRef(new Animated.Value(0)).current;
  const footLeftAnim = useRef(new Animated.Value(0)).current;
  const footRightAnim = useRef(new Animated.Value(0)).current;
  
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

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
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      const bobAnimation = Animated.loop(
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      const wingLeftAnimation = Animated.loop(
        Animated.timing(wingLeftAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      const wingRightAnimation = Animated.loop(
        Animated.timing(wingRightAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      const footLeftAnimation = Animated.loop(
        Animated.timing(footLeftAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      const footRightAnimation = Animated.loop(
        Animated.timing(footRightAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      );

      // Store animations for cleanup
      animationsRef.current = [
        waddleAnimation,
        bobAnimation,
        wingLeftAnimation,
        wingRightAnimation,
        footLeftAnimation,
        footRightAnimation,
      ];

      // Start all animations
      waddleAnimation.start();
      bobAnimation.start();
      wingLeftAnimation.start();
      wingRightAnimation.start();
      footLeftAnimation.start();
      footRightAnimation.start();
    } else {
      // Stop all animations when app goes to background
      animationsRef.current.forEach(animation => animation.stop());
      animationsRef.current = [];
    }

    return () => {
      // Cleanup on unmount
      animationsRef.current.forEach(animation => animation.stop());
    };
  }, [appState, waddleAnim, bobAnim, wingLeftAnim, wingRightAnim, footLeftAnim, footRightAnim]);

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

  return (
    <>
     {/* Static ice floor - not animated */}
     <Svg
     width={size * 1.8}
     height={size * 1.2}
     viewBox="0 0 500 320"
     style={{
       position: 'absolute',
       zIndex: -1,
     }}
   >
     <Defs>
          {/* Ice floor gradient - converted from CSS radial-gradient */}
          <RadialGradient id="staticIceFloorGradient" cx="50%" cy="50%" r="100%">
            <Stop offset="0%" stopColor="rgba(240, 249, 255, 0.95)" />
            <Stop offset="20%" stopColor="rgba(219, 234, 254, 0.85)" />
            <Stop offset="40%" stopColor="rgba(147, 197, 253, 0.75)" />
            <Stop offset="60%" stopColor="rgba(59, 130, 246, 0.6)" />
            <Stop offset="75%" stopColor="rgba(29, 78, 216, 0.4)" />
            <Stop offset="90%" stopColor="rgba(30, 58, 138, 0.2)" />
            <Stop offset="100%" stopColor="transparent" />
          </RadialGradient>
        </Defs>
          {/* Ice floor - larger fixed size */}
          <Ellipse
          cx="250"
          cy="260"
          rx="220"
          ry="30"
          fill="url(#staticIceFloorGradient)"
        />
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
        width={size}
        height={size * 0.97} // Maintain aspect ratio from original (155/160)
        viewBox="0 0 272 261"
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
          transform={`translate(209.5, 168.023)`}
          origin="0,0"
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
          transform={`translate(53.5, 168.5)`}
          origin="0,0"
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
          transform={`translate(107.5, 221.5)`}
          origin="0,0"
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
          transform={`translate(157.5, 221.5)`}
          origin="0,0"
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