import { TextStyle } from 'react-native';
import { THEME } from '@/src/constants';
import { getResponsiveFontSize } from './responsive';

export type TypographyVariant = keyof typeof THEME.typography;

/**
 * Get typography styles for a specific variant with responsive scaling
 */
export function getTypographyStyle(variant: TypographyVariant): TextStyle {
  const baseStyle = THEME.typography[variant];
  
  return {
    ...baseStyle,
    fontSize: getResponsiveFontSize(baseStyle.fontSize),
  };
}

/**
 * Create responsive typography styles with optional overrides
 */
export function createTypographyStyle(
  variant: TypographyVariant,
  overrides?: Partial<TextStyle>
): TextStyle {
  const baseStyle = getTypographyStyle(variant);
  
  return {
    ...baseStyle,
    ...overrides,
  };
}

/**
 * Get typography styles for multiple variants (useful for conditional styling)
 */
export function getTypographyStyles<T extends TypographyVariant>(
  variants: T[]
): Record<T, TextStyle> {
  return variants.reduce((acc, variant) => {
    acc[variant] = getTypographyStyle(variant);
    return acc;
  }, {} as Record<T, TextStyle>);
}

/**
 * Typography utility class for easy access to all styles
 */
export class Typography {
  // Original typography variants (maintained for backward compatibility)
  static display = getTypographyStyle('display');
  static h1 = getTypographyStyle('h1');
  static h2 = getTypographyStyle('h2');
  static h3 = getTypographyStyle('h3');
  static h4 = getTypographyStyle('h4');
  static h5 = getTypographyStyle('h5');
  static h6 = getTypographyStyle('h6');
  static body1 = getTypographyStyle('body1');
  static body2 = getTypographyStyle('body2');
  static subtitle1 = getTypographyStyle('subtitle1');
  static subtitle2 = getTypographyStyle('subtitle2');
  static caption = getTypographyStyle('caption');
  static overline = getTypographyStyle('overline');
  static button = getTypographyStyle('button');
  static link = getTypographyStyle('link');

  // Semantic Typography Variants
  // Screenshot-style (Bold, Strong) - for branding impact and strong identity
  static appName = getTypographyStyle('appName');
  static primaryHeading = getTypographyStyle('primaryHeading');
  static ctaButton = getTypographyStyle('ctaButton');
  static achievement = getTypographyStyle('achievement');
  static navigationHeader = getTypographyStyle('navigationHeader');
  static heroSection = getTypographyStyle('heroSection');

  // Forest-style (Light/Regular) - for readability and calm tone
  static tagline = getTypographyStyle('tagline');
  static bodyText = getTypographyStyle('bodyText');
  static secondaryHeading = getTypographyStyle('secondaryHeading');
  static formLabel = getTypographyStyle('formLabel');
  static quote = getTypographyStyle('quote');
  static helpText = getTypographyStyle('helpText');
  static timestamp = getTypographyStyle('timestamp');

  /**
   * Get a specific typography style
   */
  static get(variant: TypographyVariant): TextStyle {
    return getTypographyStyle(variant);
  }

  /**
   * Create a custom style based on a variant with overrides
   */
  static create(variant: TypographyVariant, overrides?: Partial<TextStyle>): TextStyle {
    return createTypographyStyle(variant, overrides);
  }
}

