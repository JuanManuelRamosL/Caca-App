import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function MapaView() {
  // Estado para guardar el componente del mapa una vez cargado
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // useEffect SOLO corre en el navegador (Cliente), nunca en el servidor.
    const loadMap = async () => {
      try {
        // Importamos el archivo dinámicamente
        const leafletModule = await import('./LeafletMap');
        // Guardamos el componente default en el estado
        setMapComponent(() => leafletModule.default);
      } catch (error) {
        console.error("Error cargando el mapa web:", error);
      }
    };

    loadMap();
  }, []);

  // Mientras no haya cargado el mapa, mostramos un loader
  if (!MapComponent) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Cargando Mapa Web...</Text>
      </View>
    );
  }

  // Una vez cargado, lo renderizamos
  return (
    <View style={styles.container}>
      <MapComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});