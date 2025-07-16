import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authenticateUserUseCase } from '../../di';

export default function LoginScreen() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await authenticateUserUseCase.execute(username, password);
      if (user) {
        setUser(user.username);
      } else {
        Alert.alert('Erro', 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao tentar logar.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/Utracking.png')} style={styles.logo} />
      <TextInput placeholder="Usuário" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  loginButton: {
    backgroundColor: '#0D47A1',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
