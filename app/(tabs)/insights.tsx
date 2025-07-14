import { View, Text, StyleSheet } from 'react-native';
import { Layout } from '@/src/components/ui/Layout';
import { Header } from '@/src/components/ui/Header';

export default function InsightsScreen() {
  return (
    <Layout>
      <Header 
        title="Insights"
        subtitle="Progress visualization and AI feedback"
      />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Your Progress</Text>
        <Text style={styles.subtitle}>Insights and analytics coming soon</Text>
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