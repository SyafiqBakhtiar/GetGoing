import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Typography } from '@/src/utils/typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  onBackPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export function Header({ 
  title, 
  subtitle, 
  showBackButton = false, 
  rightAction,
  onBackPress,
  style
}: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={[Typography.h5, styles.title]}>{title}</Text>
          {subtitle && <Text style={[Typography.body2, styles.subtitle]}>{subtitle}</Text>}
        </View>
      </View>
      
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress} style={styles.rightAction}>
          <IconSymbol name={rightAction.icon} size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#000',
  },
  subtitle: {
    color: '#666',
    marginTop: 2,
  },
  rightAction: {
    padding: 4,
  },
});