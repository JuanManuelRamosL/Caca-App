import React from 'react';
import { View, StyleSheet } from 'react-native';
// Nota los dos puntos ../../ para salir de (tabs) y de app
import MapaView from '../../components/MapaView'; 

export default function MapaScreen() {
  return (
    <View style={styles.container}>
      <MapaView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});