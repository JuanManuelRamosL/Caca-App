// import React, { useState } from 'react';
// import { 
//   StyleSheet, View, Text, Image, Dimensions, Platform, 
//   TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView 
// } from 'react-native';
// // IMPORTE PROVIDER_GOOGLE AQUÍ
// import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
// import { Ionicons } from '@expo/vector-icons'; 
// import { marcadores as datosIniciales } from '../puntos'; 

// export default function MapaView() {
//   const [listaPuntos, setListaPuntos] = useState(datosIniciales);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [nuevoComentario, setNuevoComentario] = useState("");

//   const selectedPunto = listaPuntos.find(p => p.id === selectedId);

//   const initialRegion = {
//     latitude: -34.603722,
//     longitude: -58.381592,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   };

//   const renderEstrellas = (puntuacion: number) => {
//     const estrellas = [];
//     for (let i = 1; i <= 5; i++) {
//       let name = "star";
//       if (i > puntuacion) name = (i - 0.5 <= puntuacion) ? "star-half" : "star-outline";
//       estrellas.push(<Ionicons key={i} name={name as any} size={16} color="#FFD700" style={{ marginRight: 2 }} />);
//     }
//     return <View style={{ flexDirection: 'row', marginVertical: 5 }}>{estrellas}</View>;
//   };

//   const handleEnviarComentario = () => {
//     if (nuevoComentario.trim() === "" || !selectedPunto) return;
//     const nuevaLista = listaPuntos.map(p => {
//       if (p.id === selectedId) return { ...p, comentarios: [...(p.comentarios || []), nuevoComentario] };
//       return p;
//     });
//     setListaPuntos(nuevaLista);
//     setNuevoComentario("");
//   };

//   return (
//     <View style={styles.container}>
//       <MapView 
//         style={styles.map} 
//         initialRegion={initialRegion}
//         // CAMBIO 1: Forzar proveedor Google (vital en Android Release)
//         provider={PROVIDER_GOOGLE} 
//         // CAMBIO 2: mapType "none" para usar tus tiles, o "standard" si quieres el de Google
//         mapType={Platform.OS === 'android' ? "none" : "standard"}
//         // Esto cierra el modal al tocar el fondo
//         onPress={(e) => {
//           // Protección extra: si el evento viene de un marcador, no hacemos nada
//           if (e.nativeEvent.action !== 'marker-press') {
//              setSelectedId(null);
//              setNuevoComentario("");
//           }
//         }}
//       >
//         {Platform.OS === 'android' && (
//             <UrlTile 
//             urlTemplate="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
//             tileSize={256}
//             maximumZ={19}
//             flipY={false}
//             zIndex={-1}
//             />
//         )}

//         {listaPuntos.map((punto) => (
//           <Marker
//             key={punto.id}
//             coordinate={{ latitude: punto.latitud, longitude: punto.longitud }}
//             // CAMBIO 3: DETENER LA PROPAGACIÓN
//             // Esto evita que el click atraviese el marcador y toque el mapa
//             onPress={(e) => {
//               e.stopPropagation(); 
//               setSelectedId(punto.id);
//             }}
//           >
//             <Ionicons name="location" size={40} color="#FF3B30" />
//           </Marker>
//         ))}
//       </MapView>

//       {/* --- TARJETA FLOTANTE --- */}
//       {selectedPunto && (
//         <KeyboardAvoidingView 
//             behavior={Platform.OS === "ios" ? "padding" : "height"} 
//             style={styles.cardWrapper}
//             // Importante: pointerEvents "box-none" permite tocar el mapa si la tarjeta no cubre todo
//             pointerEvents="box-none" 
//         >
//           <View style={styles.card}>
//             <TouchableOpacity style={styles.closeBtnAbsolute} onPress={() => setSelectedId(null)}>
//               <Ionicons name="close-circle" size={30} color="#ccc" />
//             </TouchableOpacity>

//             <ScrollView style={styles.scrollContent} nestedScrollEnabled={true}>
//               <Text style={styles.cardTitle}>{selectedPunto.nombre}</Text>
//               {renderEstrellas(selectedPunto.puntuacion || 0)}
//               {selectedPunto.imagen ? <Image source={{ uri: selectedPunto.imagen }} style={styles.cardImage} resizeMode="cover"/> : null}
//               <Text style={styles.sectionTitle}>Descripción</Text>
//               <Text style={styles.cardDesc}>{selectedPunto.descripcion}</Text>
//               <View style={styles.divider} />
//               <Text style={styles.sectionTitle}>Comentarios ({selectedPunto.comentarios ? selectedPunto.comentarios.length : 0})</Text>
//               <View style={styles.commentsList}>
//                 {selectedPunto.comentarios && selectedPunto.comentarios.map((c, index) => (
//                   <View key={index} style={styles.commentItem}>
//                     <Ionicons name="chatbubble-ellipses-outline" size={14} color="#666" style={{marginTop: 2}} />
//                     <Text style={styles.commentText}>{c}</Text>
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>

//             <View style={styles.inputContainer}>
//               <TextInput style={styles.input} placeholder="Escribe tu opinión..." value={nuevoComentario} onChangeText={setNuevoComentario} />
//               <TouchableOpacity style={styles.sendButton} onPress={handleEnviarComentario}>
//                 <Ionicons name="send" size={20} color="white" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
//   cardWrapper: { 
//     position: 'absolute', 
//     bottom: 20, 
//     left: 15, 
//     right: 15, 
//     maxHeight: '60%',
//     zIndex: 9999, // Asegura que esté encima
//     elevation: 10 // Sombra en Android
//   },
//   card: { backgroundColor: 'white', borderRadius: 20, padding: 15, paddingTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10, flex: 1 },
//   scrollContent: { marginBottom: 10 },
//   closeBtnAbsolute: { position: 'absolute', top: 10, right: 10, zIndex: 99 },
//   cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 30 },
//   cardImage: { width: '100%', height: 150, borderRadius: 12, marginVertical: 10, backgroundColor: '#eee' },
//   sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#007AFF' },
//   cardDesc: { fontSize: 14, color: '#555', lineHeight: 20 },
//   divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
//   commentsList: { marginBottom: 10 },
//   commentItem: { flexDirection: 'row', marginBottom: 8, gap: 8 },
//   commentText: { fontSize: 13, color: '#444', flex: 1 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
//   input: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, borderWidth: 1, borderColor: '#ddd', marginRight: 10 },
//   sendButton: { backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
// });


import React, { useState, useEffect, useRef } from 'react'; // <--- 1. IMPORTAR useEffect y useRef
import { 
  StyleSheet, View, Text, Image, Dimensions, Platform, 
  TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView 
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; 
import { marcadores as datosIniciales } from '../puntos'; 
import { useLocalSearchParams } from 'expo-router'; // <--- 2. IMPORTAR useLocalSearchParams

export default function MapaView() {
  const [listaPuntos, setListaPuntos] = useState(datosIniciales);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  
  // 3. RECUPERAR PARÁMETROS DE LA URL (Vienen como strings)
  const { latitud, longitud, focusId } = useLocalSearchParams();
  
  // 4. CREAR REFERENCIA AL MAPA
  const mapRef = useRef<MapView>(null);

  const selectedPunto = listaPuntos.find(p => p.id === selectedId);

  const initialRegion = {
    latitude: -34.603722,
    longitude: -58.381592,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // 5. EFECTO: CUANDO LLEGAN COORDENADAS DESDE EL DETALLE
  useEffect(() => {
    if (latitud && longitud && mapRef.current) {
        // Convertimos a número porque los params vienen como texto
        const lat = parseFloat(latitud as string);
        const long = parseFloat(longitud as string);

        // Animamos el mapa a la nueva posición con un ZOOM CERCANO (delta pequeño)
        mapRef.current.animateToRegion({
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.005, // Zoom bien cerca
            longitudeDelta: 0.005,
        }, 1000); // 1000ms de duración de animación

        // Opcional: Abrir la tarjeta automáticamente
        if (focusId) {
            setSelectedId(Number(focusId));
        }
    }
  }, [latitud, longitud, focusId]); // Se ejecuta cada vez que cambian estos valores


  const renderEstrellas = (puntuacion: number) => {
    /* ... (tu código de estrellas sigue igual) ... */
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      let name = "star";
      if (i > puntuacion) name = (i - 0.5 <= puntuacion) ? "star-half" : "star-outline";
      estrellas.push(<Ionicons key={i} name={name as any} size={16} color="#FFD700" style={{ marginRight: 2 }} />);
    }
    return <View style={{ flexDirection: 'row', marginVertical: 5 }}>{estrellas}</View>;
  };

  /* ... (tu función handleEnviarComentario sigue igual) ... */
  const handleEnviarComentario = () => {
    if (nuevoComentario.trim() === "" || !selectedPunto) return;
    const nuevaLista = listaPuntos.map(p => {
      if (p.id === selectedId) return { ...p, comentarios: [...(p.comentarios || []), nuevoComentario] };
      return p;
    });
    setListaPuntos(nuevaLista);
    setNuevoComentario("");
  };

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef} // <--- 6. VINCULAR LA REFERENCIA AQUÍ
        style={styles.map} 
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE} 
        mapType={Platform.OS === 'android' ? "none" : "standard"}
        onPress={(e) => {
          if (e.nativeEvent.action !== 'marker-press') {
             setSelectedId(null);
             setNuevoComentario("");
          }
        }}
      >
        {Platform.OS === 'android' && (
            <UrlTile 
            urlTemplate="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            tileSize={256}
            maximumZ={19}
            flipY={false}
            zIndex={-1}
            />
        )}

        {listaPuntos.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{ latitude: punto.latitud, longitude: punto.longitud }}
            onPress={(e) => {
              e.stopPropagation(); 
              setSelectedId(punto.id);
            }}
          >
            <Ionicons name="location" size={40} color="#FF3B30" />
          </Marker>
        ))}
      </MapView>

      {/* ... (Todo el resto de tu código de la tarjeta sigue igual) ... */}
      {selectedPunto && (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.cardWrapper}
            pointerEvents="box-none" 
        >
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeBtnAbsolute} onPress={() => setSelectedId(null)}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>

            <ScrollView style={styles.scrollContent} nestedScrollEnabled={true}>
              <Text style={styles.cardTitle}>{selectedPunto.nombre}</Text>
              {renderEstrellas(selectedPunto.puntuacion || 0)}
              {selectedPunto.imagen ? <Image source={{ uri: selectedPunto.imagen }} style={styles.cardImage} resizeMode="cover"/> : null}
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.cardDesc}>{selectedPunto.descripcion}</Text>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Comentarios ({selectedPunto.comentarios ? selectedPunto.comentarios.length : 0})</Text>
              <View style={styles.commentsList}>
                {selectedPunto.comentarios && selectedPunto.comentarios.map((c, index) => (
                  <View key={index} style={styles.commentItem}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color="#666" style={{marginTop: 2}} />
                    <Text style={styles.commentText}>{c}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Escribe tu opinión..." value={nuevoComentario} onChangeText={setNuevoComentario} />
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
    /* ... Tus estilos siguen igual ... */
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  cardWrapper: { 
    position: 'absolute', 
    bottom: 20, 
    left: 15, 
    right: 15, 
    maxHeight: '60%',
    zIndex: 9999, 
    elevation: 10 
  },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 15, paddingTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10, flex: 1 },
  scrollContent: { marginBottom: 10 },
  closeBtnAbsolute: { position: 'absolute', top: 10, right: 10, zIndex: 99 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 30 },
  cardImage: { width: '100%', height: 150, borderRadius: 12, marginVertical: 10, backgroundColor: '#eee' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#007AFF' },
  cardDesc: { fontSize: 14, color: '#555', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  commentsList: { marginBottom: 10 },
  commentItem: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  commentText: { fontSize: 13, color: '#444', flex: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  input: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14, borderWidth: 1, borderColor: '#ddd', marginRight: 10 },
  sendButton: { backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});