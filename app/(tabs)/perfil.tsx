import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Usuario = {
  nombre: string;
  email: string;
};

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const data = await AsyncStorage.getItem("usuario");

    if (data) {
      setUsuario(JSON.parse(data));
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("usuario");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {usuario ? (
        <>
          <Text style={styles.text}>Nombre: {usuario.nombre}</Text>
          <Text style={styles.text}>Email: {usuario.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>Estás navegando como invitado</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={cerrarSesion}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 👈 ESTO FALTABA
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000", // 👈 texto negro
  },

  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000", // 👈 texto negro
  },

  button: {
    marginTop: 20,
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
