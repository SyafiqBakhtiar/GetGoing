import { Dimensions, Platform } from 'react-native';

export type PerformanceTier = 'low' | 'medium' | 'high';

interface DeviceSpec {
  width: number;
  height: number;
  pixelRatio: number;
  platform: string;
}

export function detectPerformanceTier(): PerformanceTier {
  const { width, height } = Dimensions.get('window');
  const { scale } = Dimensions.get('window');
  
  const deviceSpec: DeviceSpec = {
    width,
    height,
    pixelRatio: scale,
    platform: Platform.OS,
  };

  // Calculate total pixels
  const totalPixels = width * height * deviceSpec.pixelRatio;
  
  // Performance tier based on device capabilities
  if (deviceSpec.platform === 'ios') {
    // iOS device detection based on screen resolution and pixel density
    if (totalPixels > 2500000 && deviceSpec.pixelRatio >= 3) {
      return 'high'; // iPhone 12 Pro and newer, iPad Pro
    } else if (totalPixels > 1500000 && deviceSpec.pixelRatio >= 2) {
      return 'medium'; // iPhone 8 and newer, standard iPads
    } else {
      return 'low'; // Older devices
    }
  } else {
    // Android device detection
    if (totalPixels > 2500000 && deviceSpec.pixelRatio >= 3) {
      return 'high'; // High-end Android devices
    } else if (totalPixels > 1200000 && deviceSpec.pixelRatio >= 2) {
      return 'medium'; // Mid-range devices
    } else {
      return 'low'; // Budget devices
    }
  }
}

export interface PerformanceConfig {
  snowIntensity: 'light' | 'medium' | 'heavy';
  sparkleCount: number;
  enableComplexAnimations: boolean;
  staggerAnimations: boolean;
  snowflakeMultiplier: number;
}

export function getPerformanceConfig(tier: PerformanceTier): PerformanceConfig {
  switch (tier) {
    case 'high':
      return {
        snowIntensity: 'medium', // Still reduced from original 'heavy'
        sparkleCount: 6,
        enableComplexAnimations: true,
        staggerAnimations: false,
        snowflakeMultiplier: 2.0, // 100% more snowflakes for high-end devices
      };
    case 'medium':
      return {
        snowIntensity: 'light',
        sparkleCount: 4,
        enableComplexAnimations: true,
        staggerAnimations: true,
        snowflakeMultiplier: 1.4, // 40% more snowflakes for mid-range devices
      };
    case 'low':
      return {
        snowIntensity: 'light',
        sparkleCount: 2,
        enableComplexAnimations: false,
        staggerAnimations: true,
        snowflakeMultiplier: 1.0, // No increase for low-end devices
      };
  }
}