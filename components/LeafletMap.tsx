import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, TextInput, 
  StyleSheet, ScrollView, Platform 
} from 'react-native';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Ionicons } from '@expo/vector-icons';
import { marcadores as datosIniciales } from '../puntos';

// Componente auxiliar para detectar clics en el mapa y cerrar la tarjeta
function MapEvents({ closeCard }: { closeCard: () => void }) {
  useMapEvents({
    click: () => closeCard(),
  });
  return null;
}

export default function LeafletMap() {
  const centerPosition: [number, number] = [-34.603722, -58.381592];

  // Estado local para manejar comentarios y selección
  const [listaPuntos, setListaPuntos] = useState(datosIniciales);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const selectedPunto = listaPuntos.find(p => p.id === selectedId);

  // Arreglo de iconos de Leaflet (para que no salgan invisibles)
  useEffect(() => {
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

  // Función para renderizar estrellas
  const renderEstrellas = (puntuacion: number) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      let name = "star";
      if (i > puntuacion) {
        name = (i - 0.5 <= puntuacion) ? "star-half" : "star-outline";
      }
      estrellas.push(
        <Ionicons key={i} name={name as any} size={16} color="#FFD700" style={{ marginRight: 2 }} />
      );
    }
    return <View style={{ flexDirection: 'row', marginVertical: 5 }}>{estrellas}</View>;
  };

  // Función para enviar comentario
  const handleEnviarComentario = () => {
    if (nuevoComentario.trim() === "" || !selectedPunto) return;

    const nuevaLista = listaPuntos.map(p => {
      if (p.id === selectedId) {
        return { ...p, comentarios: [...(p.comentarios || []), nuevoComentario] };
      }
      return p;
    });

    setListaPuntos(nuevaLista);
    setNuevoComentario("");
  };

  return (
    <View style={styles.container}>
      {/* CSS de Leaflet */}
      <style>
        {`@import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");`}
      </style>

      {/* --- MAPA DE FONDO --- */}
      <div style={{ height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <MapContainer 
          center={centerPosition} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Ocultamos el zoom por defecto para que se vea más limpio
        >
          {/* TileLayer estilo Google Maps */}
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />
          
          {/* Manejador de clics en el mapa vacío */}
          <MapEvents closeCard={() => setSelectedId(null)} />

          {listaPuntos.map((punto) => (
            <Marker 
              key={punto.id} 
              position={[punto.latitud, punto.longitud]}
              eventHandlers={{
                click: () => {
                  setSelectedId(punto.id);
                  setNuevoComentario("");
                },
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* --- TARJETA FLOTANTE (OVERLAY) --- */}
      {/* Usamos View de React Native con posición absoluta para que flote sobre el div del mapa */}
      {selectedPunto && (
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            {/* Botón cerrar */}
            <TouchableOpacity 
              style={styles.closeBtnAbsolute} 
              onPress={() => setSelectedId(null)}
            >
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>

            <ScrollView style={styles.scrollContent}>
              <Text style={styles.cardTitle}>{selectedPunto.nombre}</Text>
              {renderEstrellas(selectedPunto.puntuacion || 0)}

              {selectedPunto.imagen ? (
                <Image 
                  source={{ uri: selectedPunto.imagen }} 
                  style={styles.cardImage} 
                  resizeMode="cover"
                />
              ) : null}

              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.cardDesc}>{selectedPunto.descripcion}</Text>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>
                Comentarios ({selectedPunto.comentarios ? selectedPunto.comentarios.length : 0})
              </Text>
              
              <View style={styles.commentsList}>
                {selectedPunto.comentarios && selectedPunto.comentarios.map((c, index) => (
                  <View key={index} style={styles.commentItem}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color="#666" style={{marginTop: 2}} />
                    <Text style={styles.commentText}>{c}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Input fijo abajo */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu opinión..."
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
                // En web el teclado no empuja la vista igual que en móvil, así que esto está bien
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleEnviarComentario}>
                <Ionicons name="send" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative', // Importante para posicionar hijos absolutos
  },
  // Wrapper flota sobre el mapa
  cardWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20, // Márgenes laterales para que no toque los bordes en PC
    right: 20,
    maxWidth: 500, // En PC que no se estire infinito, que tenga un ancho máximo
    alignSelf: 'center', // Centrado en pantallas grandes
    maxHeight: '60%', 
    zIndex: 9999, // Para estar encima del mapa Leaflet
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    paddingTop: 20,
    // Sombras compatibles con Web y Native
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContent: {
    marginBottom: 10,
    paddingRight: 10, // Un poco de aire para la barra de scroll
  },
  closeBtnAbsolute: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 99,
    cursor: 'pointer', // Cursor de manito en web
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 30,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginVertical: 10,
    backgroundColor: '#eee',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#007AFF',
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  commentsList: {
    marginBottom: 10,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  commentText: {
    fontSize: 13,
    color: '#444',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    // outlineStyle: 'none', // Quita el borde azul feo de Chrome al escribir
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  }
});