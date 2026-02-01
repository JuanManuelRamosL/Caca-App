import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform } from 'react-native';
// Importamos componentes Nativos
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps';
import { marcadores } from '../puntos'; 

export default function MapaView() {
  const initialRegion = {
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        // En Android desactivamos Google Maps base para usar OpenStreetMap gratis
        mapType={Platform.OS === 'android' ? "none" : "standard"}
      >
        {/* Capa de OpenStreetMap para Android */}
        {Platform.OS === 'android' && (
          <UrlTile 
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
        )}

        {marcadores.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{ latitude: punto.latitud, longitude: punto.longitud }}
            title={punto.nombre}
          >
            <Callout style={styles.callout}>
              <View style={styles.calloutView}>
                <Text style={styles.calloutTitle}>{punto.nombre}</Text>
                {punto.imagen ? (
                  <Image source={{ uri: punto.imagen }} style={styles.calloutImage} resizeMode="cover"/>
                ) : null}
                <Text style={styles.calloutDesc}>{punto.descripcion}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  callout: { width: 200 },
  calloutView: { alignItems: 'center', padding: 5 },
  calloutTitle: { fontWeight: 'bold', marginBottom: 5, color: 'black' },
  calloutImage: { width: 180, height: 100, borderRadius: 5, marginBottom: 5 },
  calloutDesc: { fontSize: 12, textAlign: 'center', color: 'gray' }
});