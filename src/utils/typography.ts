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

