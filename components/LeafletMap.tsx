import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Image, Text, TouchableOpacity } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { marcadores } from '../puntos';


export default function LeafletMap() {
  const centerPosition: [number, number] = [-34.603722, -58.381592];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  useEffect(() => {
    // Configuración de iconos segura
    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    } catch (e) {
      console.warn("Error iconos:", e);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Importamos CSS desde la nube para evitar errores locales */}
      <style>
        {`@import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");`}
      </style>
      <div style={{ height: '100vh', width: '100%' }}>
        <MapContainer 
          center={centerPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marcadores.map((punto) => (
            <Marker key={punto.id} position={[punto.latitud, punto.longitud]}
              eventHandlers={{
                click: () => {
                  setSelectedMarker(punto);
                  setModalVisible(true);
                },
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <b>{punto.nombre}</b><br />
                  {punto.descripcion}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* Modal nativo React Native, visible solo si hay un marcador seleccionado */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMarker && (
              <>
                <Text style={styles.modalTitle}>{selectedMarker.nombre}</Text>
                <Image
                  source={{ uri: selectedMarker.imagen }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <Text style={styles.modalDesc}>{selectedMarker.descripcion}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalImage: {
    width: 250,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});