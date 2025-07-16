import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Typography } from '@/src/utils/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useBackgroundGradient } from '../../providers/ThemeProvider';

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
  backgroundType?: 'gradient' | 'solid';
  retryButtonStyle?: ViewStyle | ViewStyle[];
}

export function ErrorScreen({ message, onRetry, backgroundType = 'solid', retryButtonStyle }: ErrorScreenProps) {
  const backgroundGradient = useBackgroundGradient();
  
  return (
    <View style={styles.wrapper}>
      {backgroundType === 'gradient' ? (
        <LinearGradient
          colors={backgroundGradient.colors as any}
          start={backgroundGradient.start}
          end={backgroundGradient.end}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: '#f5f5f5' },
          ]}
        />
      )}
      
      <View style={styles.container}>
        <IconSymbol name="exclamationmark.triangle" size={48} color="#FF3B30" />
        <Text style={[Typography.body1, styles.message]}>{message}</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={[styles.retryButton, retryButtonStyle]}>
            <Text style={[Typography.button, styles.retryButtonText]}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 2,
  },
  message: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
  },
});