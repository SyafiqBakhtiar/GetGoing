import { Dimensions } from 'react-native';
import { detectPerformanceTier, PerformanceTier } from './performanceTiers';

const { width, height } = Dimensions.get('window');

export type DeviceType = 'phone' | 'tablet' | 'desktop';

export interface ResponsiveConfig {
  deviceType: DeviceType;
  isSmallPhone: boolean;
  isLargeScreen: boolean;
  performanceTier: PerformanceTier;
}

export function getDeviceType(): DeviceType {
  if (width < 768) {
    return 'phone';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export function getResponsiveConfig(): ResponsiveConfig {
  const deviceType = getDeviceType();
  const performanceTier = detectPerformanceTier();
  
  return {
    deviceType,
    isSmallPhone: width < 380,
    isLargeScreen: width >= 768,
    performanceTier,
  };
}

export function getResponsiveFontSize(
  baseSize: number,
  config?: ResponsiveConfig
): number {
  const { deviceType, isSmallPhone } = config || getResponsiveConfig();
  
  let scaleFactor: number;
  
  switch (deviceType) {
    case 'phone':
      scaleFactor = isSmallPhone ? 0.85 : 1;
      break;
    case 'tablet':
      scaleFactor = 1.3;
      break;
    case 'desktop':
      scaleFactor = 1.5;
      break;
  }
  
  const scaled = baseSize * scaleFactor;
  
  // Apply constraints based on screen width
  const minSize = Math.max(baseSize * 0.7, 12);
  const maxSize = Math.min(width * 0.15, baseSize * 2);
  
  return Math.max(minSize, Math.min(scaled, maxSize));
}

export function getResponsiveSpacing(
  baseSpacing: number,
  config?: ResponsiveConfig
): number {
  const { deviceType, isSmallPhone } = config || getResponsiveConfig();
  
  switch (deviceType) {
    case 'phone':
      return isSmallPhone ? baseSpacing * 0.8 : baseSpacing;
    case 'tablet':
      return baseSpacing * 1.4;
    case 'desktop':
      return baseSpacing * 1.6;
  }
}

export function getResponsiveSize(
  baseSize: number,
  config?: ResponsiveConfig
): number {
  const { deviceType, isSmallPhone } = config || getResponsiveConfig();
  
  switch (deviceType) {
    case 'phone':
      return isSmallPhone ? baseSize * 0.9 : baseSize;
    case 'tablet':
      return baseSize * 1.2;
    case 'desktop':
      return baseSize * 1.4;
  }
}

export function getContainerConstraints(config?: ResponsiveConfig): {
  maxWidth?: number;
  paddingHorizontal: number;
} {
  const { deviceType, isSmallPhone } = config || getResponsiveConfig();
  
  switch (deviceType) {
    case 'phone':
      return {
        paddingHorizontal: isSmallPhone ? 16 : 20,
      };
    case 'tablet':
      return {
        maxWidth: 600,
        paddingHorizontal: 40,
      };
    case 'desktop':
      return {
        maxWidth: 800,
        paddingHorizontal: 60,
      };
  }
}

export function getSafeAreaSpacing(
  baseSpacing: number,
  insets: { top: number; bottom: number; left: number; right: number },
  config?: ResponsiveConfig
): {
  paddingTop: number;
  paddingBottom: number;
  paddingHorizontal: number;
} {
  const responsiveSpacing = getResponsiveSpacing(baseSpacing, config);
  const { paddingHorizontal } = getContainerConstraints(config);
  
  return {
    paddingTop: Math.max(insets.top + responsiveSpacing, 40),
    paddingBottom: Math.max(insets.bottom + responsiveSpacing, 20),
    paddingHorizontal,
  };
}

export function getConstrainedWidth(
  elementWidth: number,
  config?: ResponsiveConfig
): number {
  const { maxWidth } = getContainerConstraints(config);
  
  if (maxWidth) {
    return Math.min(elementWidth, maxWidth);
  }
  
  // For phones, ensure element doesn't exceed screen width with padding
  const safeWidth = width - 40; // Account for horizontal padding
  return Math.min(elementWidth, safeWidth);
}

export function getButtonDimensions(config?: ResponsiveConfig): {
  width: string | number;
  maxWidth: number;
  minHeight: number;
} {
  const { deviceType } = config || getResponsiveConfig();
  
  switch (deviceType) {
    case 'phone':
      return {
        width: '88%',
        maxWidth: 340,
        minHeight: 50,
      };
    case 'tablet':
      return {
        width: 420,
        maxWidth: 480,
        minHeight: 54,
      };
    case 'desktop':
      return {
        width: 480,
        maxWidth: 520,
        minHeight: 58,
      };
  }
}

export function getThumbZoneSpacing(
  insets: { top: number; bottom: number; left: number; right: number },
  config?: ResponsiveConfig
): {
  buttonContainerHeight: number;
  bottomOffset: number;
} {
  const { deviceType, isSmallPhone } = config || getResponsiveConfig();
  
  // Optimal thumb zone: 60-80px from bottom edge
  const baseBottomOffset = deviceType === 'phone' 
    ? (isSmallPhone ? 50 : 60)
    : 80;
  
  const bottomOffset = Math.max(baseBottomOffset, insets.bottom + 20);
  
  // Container height includes button + trial note + spacing
  const containerHeight = deviceType === 'phone'
    ? (isSmallPhone ? 90 : 100)
    : 120;
  
  return {
    buttonContainerHeight: containerHeight,
    bottomOffset,
  };
}