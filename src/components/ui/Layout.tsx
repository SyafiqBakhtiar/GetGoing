import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useBackgroundGradient } from '../../providers/ThemeProvider';

interface LayoutProps extends PropsWithChildren {
  backgroundColor?: string;
  backgroundType?: 'gradient' | 'solid';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  overlay?: boolean;
  overlayOpacity?: number;
}

export function Layout({ 
  children, 
  backgroundColor = '#f5f5f5',
  backgroundType = 'solid',
  edges = ['top', 'bottom', 'left', 'right'],
  overlay = false,
  overlayOpacity = 0.1,
}: LayoutProps) {
  const insets = useSafeAreaInsets();
  const backgroundGradient = useBackgroundGradient();

  const safeAreaStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={styles.container}>
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
            { backgroundColor },
          ]}
        />
      )}
      
      {overlay && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
              zIndex: 1,
            },
          ]}
        />
      )}
      
      <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
  },
});