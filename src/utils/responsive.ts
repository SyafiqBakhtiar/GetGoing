import { Dimensions } from 'react-native';
import { detectPerformanceTier, PerformanceTier } from './performanceTiers';
import type { ViewBoxDimensions, ViewBoxAdjustments, ViewBoxConfig } from '../types';

const { width, height } = Dimensions.get('window');

export type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'largeDesktop';

export interface ResponsiveConfig {
  deviceType: DeviceType;
  isSmallPhone: boolean;
  isLargeScreen: boolean;
  isLandscape: boolean;
  aspectRatio: number;
  performanceTier: PerformanceTier;
}

export function getDeviceType(): DeviceType {
  if (width < 768) {
    return 'phone';
  } else if (width < 1024) {
    return 'tablet';
  } else if (width < 1280) {
    return 'laptop';
  } else if (width < 1536) {
    return 'desktop';
  } else {
    return 'largeDesktop';
  }
}

export function getResponsiveConfig(): ResponsiveConfig {
  const deviceType = getDeviceType();
  const performanceTier = detectPerformanceTier();
  const aspectRatio = width / height;
  const isLandscape = width > height;
  
  return {
    deviceType,
    isSmallPhone: width < 375,
    isLargeScreen: width >= 768,
    isLandscape,
    aspectRatio,
    performanceTier,
  };
}

export function getResponsiveFontSize(
  baseSize: number,
  config?: ResponsiveConfig
): number {
  const { deviceType, isSmallPhone, isLandscape } = config || getResponsiveConfig();
  
  let scaleFactor: number;
  
  switch (deviceType) {
    case 'phone':
      scaleFactor = isSmallPhone ? 0.85 : 1;
      // Reduce font size slightly in landscape for better fit
      if (isLandscape) scaleFactor *= 0.9;
      break;
    case 'tablet':
      scaleFactor = 1.2;
      break;
    case 'laptop':
      scaleFactor = 1.3;
      break;
    case 'desktop':
      scaleFactor = 1.5;
      break;
    case 'largeDesktop':
      scaleFactor = 1.7;
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
  const { deviceType, isSmallPhone, isLandscape } = config || getResponsiveConfig();
  
  let spacing: number;
  
  switch (deviceType) {
    case 'phone':
      spacing = isSmallPhone ? baseSpacing * 0.8 : baseSpacing;
      break;
    case 'tablet':
      spacing = baseSpacing * 1.2;
      break;
    case 'laptop':
      spacing = baseSpacing * 1.4;
      break;
    case 'desktop':
      spacing = baseSpacing * 1.6;
      break;
    case 'largeDesktop':
      spacing = baseSpacing * 1.8;
      break;
  }
  
  // Reduce vertical spacing in landscape mode
  if (isLandscape) {
    spacing *= 0.7;
  }
  
  return spacing;
}

export function getResponsiveSize(
  baseSize: number,
  config?: ResponsiveConfig
): number {
  const { deviceType, isSmallPhone, isLandscape } = config || getResponsiveConfig();
  
  let size: number;
  
  switch (deviceType) {
    case 'phone':
      size = isSmallPhone ? baseSize * 0.9 : baseSize;
      break;
    case 'tablet':
      size = baseSize * 1.1;
      break;
    case 'laptop':
      size = baseSize * 1.2;
      break;
    case 'desktop':
      size = baseSize * 1.4;
      break;
    case 'largeDesktop':
      size = baseSize * 1.6;
      break;
  }
  
  // Reduce size in landscape mode to fit shorter height
  if (isLandscape) {
    size *= 0.8;
  }
  
  return size;
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
    case 'laptop':
      return {
        maxWidth: 800,
        paddingHorizontal: 50,
      };
    case 'desktop':
      return {
        maxWidth: 1000,
        paddingHorizontal: 60,
      };
    case 'largeDesktop':
      return {
        maxWidth: 1200,
        paddingHorizontal: 80,
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
        width: '70%',
        maxWidth: 280,
        minHeight: 50,
      };
    case 'tablet':
      return {
        width: 420,
        maxWidth: 480,
        minHeight: 54,
      };
    case 'laptop':
      return {
        width: 480,
        maxWidth: 520,
        minHeight: 56,
      };
    case 'desktop':
      return {
        width: 520,
        maxWidth: 580,
        minHeight: 58,
      };
    case 'largeDesktop':
      return {
        width: 580,
        maxWidth: 640,
        minHeight: 60,
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
  let baseBottomOffset: number;
  switch (deviceType) {
    case 'phone':
      baseBottomOffset = isSmallPhone ? 50 : 60;
      break;
    case 'tablet':
    case 'laptop':
      baseBottomOffset = 80;
      break;
    case 'desktop':
    case 'largeDesktop':
      baseBottomOffset = 100;
      break;
  }
  
  const bottomOffset = Math.max(baseBottomOffset, insets.bottom + 20);
  
  // Container height includes button + trial note + spacing
  let containerHeight: number;
  switch (deviceType) {
    case 'phone':
      containerHeight = isSmallPhone ? 90 : 100;
      break;
    case 'tablet':
      containerHeight = 120;
      break;
    case 'laptop':
      containerHeight = 130;
      break;
    case 'desktop':
    case 'largeDesktop':
      containerHeight = 140;
      break;
  }
  
  return {
    buttonContainerHeight: containerHeight,
    bottomOffset,
  };
}

export function getLandscapeLayoutConfig(config?: ResponsiveConfig): {
  useHorizontalLayout: boolean;
  penguinColumnWidth: string;
  contentColumnWidth: string;
  horizontalSpacing: number;
} {
  const { isLandscape, deviceType, aspectRatio } = config || getResponsiveConfig();
  
  // Use horizontal layout for landscape orientation
  const useHorizontalLayout = isLandscape;
  
  if (!useHorizontalLayout) {
    return {
      useHorizontalLayout: false,
      penguinColumnWidth: '100%',
      contentColumnWidth: '100%',
      horizontalSpacing: 0,
    };
  }
  
  // Configure horizontal layout based on device type
  let penguinColumnWidth = '50%';
  let contentColumnWidth = '50%';
  let horizontalSpacing = 20;
  
  switch (deviceType) {
    case 'phone':
      penguinColumnWidth = '45%';
      contentColumnWidth = '55%';
      horizontalSpacing = 15;
      break;
    case 'tablet':
      penguinColumnWidth = '40%';
      contentColumnWidth = '60%';
      horizontalSpacing = 30;
      break;
    case 'laptop':
      penguinColumnWidth = '35%';
      contentColumnWidth = '65%';
      horizontalSpacing = 35;
      break;
    case 'desktop':
      penguinColumnWidth = '30%';
      contentColumnWidth = '70%';
      horizontalSpacing = 40;
      break;
    case 'largeDesktop':
      penguinColumnWidth = '25%';
      contentColumnWidth = '75%';
      horizontalSpacing = 50;
      break;
  }
  
  // Adjust for ultra-wide screens (aspect ratio > 3/2 = 1.5)
  if (aspectRatio > 1.5) {
    penguinColumnWidth = '30%';
    contentColumnWidth = '70%';
    horizontalSpacing = Math.min(horizontalSpacing * 1.5, 60);
  }
  
  return {
    useHorizontalLayout,
    penguinColumnWidth,
    contentColumnWidth,
    horizontalSpacing,
  };
}

// Dynamic ViewBox utility functions
export function parseViewBox(viewBoxString: string): ViewBoxDimensions {
  const values = viewBoxString.split(' ').map(Number);
  return {
    x: values[0] || 0,
    y: values[1] || 0,
    width: values[2] || 0,
    height: values[3] || 0,
  };
}

export function formatViewBox(dimensions: ViewBoxDimensions): string {
  return `${dimensions.x} ${dimensions.y} ${dimensions.width} ${dimensions.height}`;
}

export function calculateDynamicViewBox(
  baseViewBox: ViewBoxDimensions,
  aspectRatio: number,
  deviceType: DeviceType
): ViewBoxDimensions {
  // Apply device-specific scaling only (aspect ratio adjustments handled separately)
  const deviceScaling = getDeviceViewBoxScaling(deviceType);
  
  return {
    x: baseViewBox.x,
    y: baseViewBox.y,
    width: baseViewBox.width * deviceScaling.width,
    height: baseViewBox.height * deviceScaling.height,
  };
}

export function getViewBoxForExtremeRatios(
  aspectRatio: number,
  baseViewBox: ViewBoxDimensions
): ViewBoxDimensions {
  const config = getViewBoxConfig(baseViewBox);
  
  if (aspectRatio > config.aspectRatioThresholds.ultraWide) {
    // Ultra-wide: maintain height, contract width for larger elements
    const widthContraction = config.aspectRatioThresholds.normal / aspectRatio;
    return {
      ...baseViewBox,
      width: baseViewBox.width * widthContraction,
    };
  } else if (aspectRatio < config.aspectRatioThresholds.tall) {
    // Tall: maintain width, contract height for larger elements
    const heightContraction = aspectRatio / config.aspectRatioThresholds.normal;
    return {
      ...baseViewBox,
      height: baseViewBox.height * heightContraction,
    };
  }
  
  return baseViewBox;
}

export function ensureConsistentProportions(
  viewBox: ViewBoxDimensions,
  targetAspectRatio: number
): ViewBoxDimensions {
  const currentAspectRatio = viewBox.width / viewBox.height;
  
  if (Math.abs(currentAspectRatio - targetAspectRatio) < 0.01) {
    return viewBox; // Already consistent
  }
  
  if (currentAspectRatio > targetAspectRatio) {
    // ViewBox is too wide, adjust height
    return {
      ...viewBox,
      height: viewBox.width / targetAspectRatio,
    };
  } else {
    // ViewBox is too tall, adjust width
    return {
      ...viewBox,
      width: viewBox.height * targetAspectRatio,
    };
  }
}

function getViewBoxConfig(baseViewBox: ViewBoxDimensions): ViewBoxConfig {
  return {
    baseViewBox,
    aspectRatioThresholds: {
      ultraWide: 1.5,  // Ultra wide: aspect ratio > 3/2
      wide: 1.3,
      normal: 1.0,
      tall: 0.67,      // Ultra tall: aspect ratio < 2/3 (≈0.67)
    },
    adjustments: {
      ultraWide: {
        widthMultiplier: 1.4,
        heightMultiplier: 1.0,
      },
      tall: {
        widthMultiplier: 1.0,
        heightMultiplier: 1.25,
      },
    },
  };
}

function getDeviceViewBoxScaling(deviceType: DeviceType): { width: number; height: number } {
  // Reverse scaling logic: smaller viewBox = larger elements
  switch (deviceType) {
    case 'phone':
      return { width: 1.0, height: 1.0 };
    case 'tablet':
      return { width: 0.95, height: 0.95 }; // Smaller viewBox for slightly larger elements
    case 'laptop':
      return { width: 0.9, height: 0.9 }; // Smaller viewBox for larger elements
    case 'desktop':
      return { width: 0.85, height: 0.85 }; // Even smaller viewBox for larger elements
    case 'largeDesktop':
      return { width: 0.8, height: 0.8 }; // Smallest viewBox for largest elements
    default:
      return { width: 1.0, height: 1.0 };
  }
}

export function getResponsiveViewBox(
  baseViewBoxString: string,
  config?: ResponsiveConfig,
  debug?: boolean
): string {
  const responsiveConfig = config || getResponsiveConfig();
  const baseViewBox = parseViewBox(baseViewBoxString);
  
  // First: Handle extreme aspect ratios
  const aspectRatioAdjustedViewBox = getViewBoxForExtremeRatios(
    responsiveConfig.aspectRatio,
    baseViewBox
  );
  
  // Then: Apply device-specific scaling
  const finalViewBox = calculateDynamicViewBox(
    aspectRatioAdjustedViewBox,
    responsiveConfig.aspectRatio,
    responsiveConfig.deviceType
  );
  
  // Debug logging (only in development and when debug is enabled)
  if (__DEV__ && debug) {
    console.log('ViewBox Debug:', {
      original: baseViewBoxString,
      parsed: baseViewBox,
      aspectRatio: responsiveConfig.aspectRatio,
      deviceType: responsiveConfig.deviceType,
      isLandscape: responsiveConfig.isLandscape,
      afterAspectRatio: aspectRatioAdjustedViewBox,
      final: finalViewBox,
      formatted: formatViewBox(finalViewBox),
      sizeChange: {
        widthChange: ((finalViewBox.width - baseViewBox.width) / baseViewBox.width * 100).toFixed(1) + '%',
        heightChange: ((finalViewBox.height - baseViewBox.height) / baseViewBox.height * 100).toFixed(1) + '%'
      }
    });
  }
  
  return formatViewBox(finalViewBox);
}