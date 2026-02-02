import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, Image, Dimensions, Platform, 
  TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView 
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; // Iconos para las estrellas y botón
import { marcadores as datosIniciales } from '../puntos'; // Renombramos al importar

export default function MapaView() {
  // 1. Convertimos los datos importados en ESTADO para poder modificarlos (agregar comentarios)
  const [listaPuntos, setListaPuntos] = useState(datosIniciales);
  
  // Estado para saber qué punto tocó el usuario (guardamos el ID, no el objeto entero para buscarlo siempre actualizado)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Estado para el texto del nuevo comentario
  const [nuevoComentario, setNuevoComentario] = useState("");

  // Buscamos el punto seleccionado en la lista actualizada
  const selectedPunto = listaPuntos.find(p => p.id === selectedId);

  const initialRegion = {
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Función para renderizar estrellas
  const renderEstrellas = (puntuacion: number) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      let name = "star";
      if (i > puntuacion) {
        // Si la puntuación es 4.5, la 5ta estrella es "half" o "outline"
        name = (i - 0.5 <= puntuacion) ? "star-half" : "star-outline";
      }
      estrellas.push(
        <Ionicons key={i} name={name as any} size={16} color="#FFD700" style={{ marginRight: 2 }} />
      );
    }
    return <View style={{ flexDirection: 'row', marginVertical: 5 }}>{estrellas}</View>;
  };

  // Función para agregar comentario
  const handleEnviarComentario = () => {
    if (nuevoComentario.trim() === "" || !selectedPunto) return;

    // Creamos una nueva lista actualizando solo el punto modificado
    const nuevaLista = listaPuntos.map(p => {
      if (p.id === selectedId) {
        return { ...p, comentarios: [...(p.comentarios || []), nuevoComentario] };
      }
      return p;
    });

    setListaPuntos(nuevaLista); // Actualizamos el estado general
    setNuevoComentario(""); // Limpiamos el input
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={initialRegion}
        mapType={Platform.OS === 'android' ? "none" : "standard"}
        onPress={() => {
          setSelectedId(null); // Cerrar al tocar el mapa
          setNuevoComentario("");
        }}
      >
        {Platform.OS === 'android' && (
<UrlTile 
  // SERVIDOR DE GOOGLE MAPS (Versión Web)
  // lyrs=m significa "Mapa Estándar" (Calles y parques)
  // x, y, z son las coordenadas del mapa
  urlTemplate="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
  tileSize={256}
  maximumZ={19}
  flipY={false}
  zIndex={-1}
  shouldReplaceMapContent={true} 
/>
        )}

        {listaPuntos.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{ latitude: punto.latitud, longitude: punto.longitud }}
            onPress={() => setSelectedId(punto.id)}
          >
            {/* Marcador personalizado simple (chincheta roja) */}
            <Ionicons name="location" size={40} color="#FF3B30" />
          </Marker>
        ))}
      </MapView>

      {/* --- TARJETA FLOTANTE --- */}
      {selectedPunto && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.cardWrapper}
        >
          <View style={styles.card}>
            {/* Botón cerrar flotante en la esquina */}
            <TouchableOpacity 
              style={styles.closeBtnAbsolute} 
              onPress={() => setSelectedId(null)}
            >
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>

            <ScrollView style={styles.scrollContent} nestedScrollEnabled={true}>
              {/* Título y Estrellas */}
              <Text style={styles.cardTitle}>{selectedPunto.nombre}</Text>
              {renderEstrellas(selectedPunto.puntuacion || 0)}

              {/* Imagen */}
              {selectedPunto.imagen ? (
                <Image source={{ uri: selectedPunto.imagen }} style={styles.cardImage} resizeMode="cover"/>
              ) : null}

              {/* Descripción */}
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.cardDesc}>{selectedPunto.descripcion}</Text>

              <View style={styles.divider} />

              {/* Sección Comentarios */}
              <Text style={styles.sectionTitle}>
                Comentarios ({selectedPunto.comentarios ? selectedPunto.comentarios.length : 0})
              </Text>
              
              {/* Lista de comentarios existentes */}
              <View style={styles.commentsList}>
                {selectedPunto.comentarios && selectedPunto.comentarios.map((c, index) => (
                  <View key={index} style={styles.commentItem}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color="#666" style={{marginTop: 2}} />
                    <Text style={styles.commentText}>{c}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Input fijo abajo para escribir */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu opinión..."
                value={nuevoComentario}
                onChangeText={setNuevoComentario}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleEnviarComentario}>
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  
  // Wrapper para manejar el teclado
  cardWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    maxHeight: '60%', // La tarjeta no ocupará más del 60% de la pantalla
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    flex: 1, // Para que el ScrollView funcione bien dentro
  },
  scrollContent: {
    marginBottom: 10, // Espacio para el input
  },
  closeBtnAbsolute: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 99,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 30, // Espacio para que no choque con la X
  },
  cardImage: {
    width: '100%',
    height: 150,
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
  // Comentarios
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
  // Input Area
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
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});