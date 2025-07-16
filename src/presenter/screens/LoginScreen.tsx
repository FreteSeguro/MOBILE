import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../../App';

export default function LoginScreen() {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`http://192.168.1.90:3000/users?username=${username}&password=${password}`);
      const users = await res.json();
      if (users.length > 0) {
        setUser(users[0].username);
      } else {
        Alert.alert('Erro', 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao tentar logar.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Usuário" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
