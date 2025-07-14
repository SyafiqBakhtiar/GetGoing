import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Layout } from '@/src/components/ui/Layout';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { RootStackParamList } from '@/src/navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const handleOpenOnboarding = () => {
    navigation.navigate('Welcome');
  };

  return (
    <Layout>
      <Header 
        title="Today's Focus"
        subtitle="Your productivity dashboard"
      />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to GetGoing!</Text>
        <Text style={styles.subtitle}>Ready to build lasting habits?</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="View Onboarding"
            onPress={handleOpenOnboarding}
            variant="secondary"
            size="medium"
          />
        </View>
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
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});