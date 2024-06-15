import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LimitHistory: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [month, setMonth] = useState('Janeiro');
  const [limit, setLimit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const loadToken = async () => {
      const jwtToken = await AsyncStorage.getItem('token');
      if (jwtToken) {
        setToken(jwtToken.trim());
      } else {
        Alert.alert('Erro', 'Token não encontrado. Por favor, faça login novamente.');
        navigation.navigate('Login');
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    fetchLimit();
  }, [month]);

  const fetchLimit = async () => {
    try {
      setLoading(true);
      const yearMonth = new Date().getFullYear() + '-' + formatMonth(month);
      const response = await fetch(`http://192.168.0.21:8080/api/limit?date=${yearMonth}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwZWRyb2dyYW5kbzZAZ21haWwuY29tIiwiaWF0IjoxNzE4NDc0MjU3LCJleHAiOjE3MTkwNzkwNTd9.fPl8-rbCnGdQ6QEy9Ot1oRtdHObDp3ysj3AqUqkI7jM"}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLimit(data);
      } else {
        const errorData = await response.json();
        console.error('Erro ao buscar limite:', errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível buscar o limite. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      Alert.alert('Erro', 'Não foi possível buscar o limite. Verifique sua conexão com a internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthName: string): string => {
    const months: { [key: string]: string } = {
      'Janeiro': '01',
      'Fevereiro': '02',
      'Março': '03',
      'Abril': '04',
      'Maio': '05',
      'Junho': '06',
      'Julho': '07',
      'Agosto': '08',
      'Setembro': '09',
      'Outubro': '10',
      'Novembro': '11',
      'Dezembro': '12',
    };
    return months[monthName] || '01';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultar Limite</Text>
      <Picker
        selectedValue={month}
        style={styles.picker}
        onValueChange={(itemValue: string) => setMonth(itemValue)}
      >
        <Picker.Item label="Consulte o mês" value={null} />
        <Picker.Item label="Janeiro" value="Janeiro" />
        <Picker.Item label="Fevereiro" value="Fevereiro" />
        <Picker.Item label="Março" value="Março" />
        <Picker.Item label="Abril" value="Abril" />
        <Picker.Item label="Maio" value="Maio" />
        <Picker.Item label="Junho" value="Junho" />
        <Picker.Item label="Julho" value="Julho" />
        <Picker.Item label="Agosto" value="Agosto" />
        <Picker.Item label="Setembro" value="Setembro" />
        <Picker.Item label="Outubro" value="Outubro" />
        <Picker.Item label="Novembro" value="Novembro" />
        <Picker.Item label="Dezembro" value="Dezembro" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : (
        <View style={styles.limitContainer}>
          {limit ? (
            <>
              <Text style={styles.limitText}>Limite para {month}:</Text>
              <Text style={styles.limitAmount}>R$ {limit.value.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.noLimitText}>Nenhum limite encontrado para {month}.</Text>
          )}
        </View>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#6366F1',
    borderRadius: 15,
  },
  limitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  limitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  limitAmount: {
    fontSize: 24,
    color: '#FF6347',
  },
  noLimitText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default LimitHistory;