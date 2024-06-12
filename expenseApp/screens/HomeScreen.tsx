// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen: React.FC = () => {
  const [scenario, setScenario] = React.useState<'saved' | 'notSaved' | 'noExpenses'>('noExpenses');

  const renderScenario = () => {
    switch (scenario) {
      case 'saved':
        return <Text style={styles.scenarioText}>Congratulations! You've saved money this month!</Text>;
      case 'notSaved':
        return <Text style={styles.scenarioText}>Unfortunately, you didn't save money this month.</Text>;
      case 'noExpenses':
      default:
        return <Text style={styles.scenarioText}>You have no expenses recorded yet.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {renderScenario()}
      <View style={styles.buttonContainer}>
        <Button title="Saved Money" onPress={() => setScenario('saved')} />
        <Button title="Not Saved Money" onPress={() => setScenario('notSaved')} />
        <Button title="No Expenses" onPress={() => setScenario('noExpenses')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA', // Azul muito claro
  },
  scenarioText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});

export default HomeScreen;