// app/index.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router'; 

export default function LoginScreen() {
  const [user, setUser] = useState('');

const handleLogin = () => {
    // Navegamos a la ruta "/mapa". 
    // Expo Router sabe que está dentro de (tabs) y cargará la barra.
    router.replace('/mapa');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <TextInput
        placeholder="Usuario"
        style={styles.input}
        value={user}
        onChangeText={setUser}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>INGRESAR AL MAPA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});