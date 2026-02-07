import React, { useState } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, 
  Platform, TextInput, KeyboardAvoidingView, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { marcadores } from '../../puntos'; 

export default function DetalleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 1. Buscamos el baño inicial
  const dataInicial = marcadores.find(p => p.id.toString() === id);

  // 2. Usamos ESTADO para poder modificar los comentarios en vivo
  // Si no usamos estado, la pantalla no se "refresca" al agregar uno nuevo.
  const [punto, setPunto] = useState(dataInicial);
  const [nuevoComentario, setNuevoComentario] = useState("");

  if (!punto) {
    return (
      <View style={styles.center}>
        <Text>Baño no encontrado :(</Text>
      </View>
    );
  }

  // Función para agregar el comentario
  const agregarComentario = () => {
    if (nuevoComentario.trim() === "") return;

    // Creamos un nuevo objeto con el comentario agregado
    const comentariosActualizados = [...(punto.comentarios || []), nuevoComentario];
    
    // Actualizamos el estado de la pantalla
    setPunto({ ...punto, comentarios: comentariosActualizados });
    
    // Limpiamos el input y avisamos (opcional)
    setNuevoComentario("");
    Alert.alert("¡Gracias!", "Tu comentario ha sido agregado.");
  };

  const renderEstrellas = (puntuacion: number) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      let name = "star";
      if (i > puntuacion) name = (i - 0.5 <= puntuacion) ? "star-half" : "star-outline";
      estrellas.push(<Ionicons key={i} name={name as any} size={18} color="#FFD700" style={{ marginRight: 2 }} />);
    }
    return <View style={{ flexDirection: 'row', marginVertical: 5 }}>{estrellas}</View>;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* HEADER IMAGEN */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: punto.imagen }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* INFO */}
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{punto.nombre}</Text>
              <View style={styles.ratingBox}>
                  <Ionicons name="star" size={14} color="#fff" />
                  <Text style={styles.ratingText}>{punto.puntuacion}</Text>
              </View>
            </View>

            {renderEstrellas(punto.puntuacion || 0)}

            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#007AFF" />
              <Text style={styles.address}>Ubicación aproximada</Text>
            </View>

            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{punto.descripcion}</Text>

            <View style={styles.divider} />

            {/* SECCIÓN COMENTARIOS */}
            <Text style={styles.sectionTitle}>
               Comentarios ({punto.comentarios ? punto.comentarios.length : 0})
            </Text>

            {/* Lista de Comentarios */}
            {punto.comentarios && punto.comentarios.map((c: string, index: number) => (
              <View key={index} style={styles.commentBox}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>U</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.commentUser}>Usuario Anónimo</Text>
                    <Text style={styles.commentText}>{c}</Text>
                </View>
              </View>
            ))}

            {/* INPUT NUEVO COMENTARIO */}
            <View style={styles.inputArea}>
              <Text style={styles.inputLabel}>Deja tu opinión:</Text>
              <View style={styles.inputRow}>
                <TextInput 
                  style={styles.input}
                  placeholder="¿Qué tal estaba el baño?"
                  value={nuevoComentario}
                  onChangeText={setNuevoComentario}
                  multiline
                />
                <TouchableOpacity style={styles.btnSend} onPress={agregarComentario}>
                   <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* FOOTER FIJO */}
<View style={styles.footer}>
          <TouchableOpacity 
            style={styles.btnAction} 
            onPress={() => {
                // Navegamos a la pestaña del mapa pasando las coordenadas
                router.push({
                    pathname: "/(tabs)/mapa",
                    params: { 
                        latitud: punto.latitud, 
                        longitud: punto.longitud,
                        // Enviamos un ID para forzar la actualización si ya estás en el mapa
                        focusId: punto.id 
                    }
                } as any); // "as any" para evitar errores de typescript rápido
            }}
          >
              <Ionicons name="map" size={24} color="white" style={{marginRight: 8}} />
              <Text style={styles.btnText}>Ver en Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { position: 'relative', height: 300 },
  image: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute', top: 50, left: 20,
    backgroundColor: 'white', borderRadius: 20, width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
  },
  infoContainer: { 
    flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -30, padding: 25, paddingTop: 30 
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 10 },
  ratingBox: { 
    backgroundColor: '#007AFF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center' 
  },
  ratingText: { color: 'white', fontWeight: 'bold', marginLeft: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  address: { color: '#666', marginLeft: 8, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: '#222' },
  description: { fontSize: 15, lineHeight: 24, color: '#555' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  
  // Estilos Comentarios
  commentBox: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontWeight: 'bold', color: '#666' },
  commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  commentText: { color: '#444', fontSize: 14 },

  // Estilos Input Comentario
  inputArea: { marginTop: 10, marginBottom: 20 },
  inputLabel: { fontWeight: 'bold', color: '#666', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { 
    flex: 1, backgroundColor: '#f0f2f5', borderRadius: 20, paddingHorizontal: 15, 
    paddingVertical: 10, fontSize: 15, marginRight: 10, minHeight: 45 
  },
  btnSend: { 
    backgroundColor: '#007AFF', width: 45, height: 45, borderRadius: 25, 
    justifyContent: 'center', alignItems: 'center', elevation: 2 
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20
  },
  btnAction: {
    backgroundColor: '#007AFF', borderRadius: 15, height: 50,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});