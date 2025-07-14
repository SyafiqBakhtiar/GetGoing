import { View, Text, StyleSheet } from 'react-native';
import { Layout } from '@/src/components/ui/Layout';
import { Header } from '@/src/components/ui/Header';

export default function JourneyScreen() {
  return (
    <Layout>
      <Header 
        title="Journey"
        subtitle="Goals, habits, and tasks management"
      />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Manage Your Journey</Text>
        <Text style={styles.subtitle}>Goals, habits, and tasks all in one place</Text>
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