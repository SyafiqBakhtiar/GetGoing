import { View, Text, StyleSheet } from 'react-native';
import { Layout } from '@/src/components/ui/Layout';
import { Header } from '@/src/components/ui/Header';

export default function HomeScreen() {
  return (
    <Layout>
      <Header 
        title="Today's Focus"
        subtitle="Your productivity dashboard"
      />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to GetGoing!</Text>
        <Text style={styles.subtitle}>Ready to build lasting habits?</Text>
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