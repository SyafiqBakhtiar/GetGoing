import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { getTypographyStyle, type TypographyVariant } from '@/src/utils/typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant: TypographyVariant;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  variant,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const typographyStyle = getTypographyStyle(variant);
  
  return (
    <Text
      style={[
        { color },
        typographyStyle,
        style,
      ]}
      {...rest}
    />
  );
}

