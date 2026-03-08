import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API = "https://app-map-back.onrender.com";

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error de login");
        return;
      }

      await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));

      router.replace("/mapa");
    } catch {
      setError("Error de red");
    }
  };

  const handleRegister = async () => {
    setError("");

    try {
      const response = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al registrarse");
        return;
      }

      await AsyncStorage.setItem("usuario", JSON.stringify(data));

      router.replace("/mapa");
    } catch {
      setError("Error de red");
    }
  };

  const handleGuest = () => {
    router.replace("/mapa");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {modoRegistro ? "Crear cuenta" : "Bienvenido"}
      </Text>

      {modoRegistro && (
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#888"
        />
      )}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={modoRegistro ? handleRegister : handleLogin}
      >
        <Text style={styles.buttonText}>
          {modoRegistro ? "REGISTRARSE" : "INGRESAR AL MAPA"}
        </Text>
      </TouchableOpacity>

      {/* ENTRAR COMO INVITADO */}
      <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
        <Text style={styles.guestText}>Entrar como invitado</Text>
      </TouchableOpacity>

      {/* CAMBIAR MODO LOGIN / REGISTRO */}
      <TouchableOpacity
        onPress={() => {
          setModoRegistro(!modoRegistro);
          setError("");
        }}
      >
        <Text style={styles.switchText}>
          {modoRegistro
            ? "¿Ya tienes cuenta? Iniciar sesión"
            : "Crear una cuenta"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 20,
    color: "#000",
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 6,
    width: "80%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  guestButton: {
    marginTop: 15,
  },

  guestText: {
    color: "#007AFF",
    fontSize: 16,
  },

  switchText: {
    marginTop: 20,
    color: "#007AFF",
  },
});
