import { View, Text, StyleSheet } from 'react-native';
import { Layout } from '@/src/components/ui/Layout';
import { Header } from '@/src/components/ui/Header';

export default function MoreScreen() {
  return (
    <Layout>
      <Header 
        title="More"
        subtitle="Notes, settings, and additional tools"
      />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>More Features</Text>
        <Text style={styles.subtitle}>Settings, notes, and additional tools</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});