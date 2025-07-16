import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography } from '@/src/utils/typography';
import { useTheme } from '../../providers/ThemeProvider';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  hapticFeedback = true,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
  ];

  const titleStyle = [
    Typography.button,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const handlePress = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const renderButtonContent = () => {
    return (
      <View style={buttonStyle}>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' ? theme.colors.primary : '#FFFFFF'} 
            size="small" 
          />
        ) : (
          <Text style={titleStyle}>{title}</Text>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.touchableContainer, style]}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  button: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#7C3AED',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  // Text variants
  primaryText: {
    color: '#7C3AED',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#FFFFFF',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 44,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  
  // Disabled states
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    opacity: 0.5,
  },
});