import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Typography } from '@/src/utils/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useBackgroundGradient } from '../../providers/ThemeProvider';

interface LoadingScreenProps {
  message?: string;
  backgroundType?: 'gradient' | 'solid';
}

export function LoadingScreen({ message = 'Loading...', backgroundType = 'solid' }: LoadingScreenProps) {
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[Typography.body1, styles.message]}>{message}</Text>
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
    zIndex: 2,
  },
  message: {
    marginTop: 16,
    color: '#666',
  },
});