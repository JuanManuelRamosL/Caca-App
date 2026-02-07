import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, Image, StyleSheet, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// AJUSTA ESTA RUTA según donde tengas tu archivo de puntos. 
// Como estamos en (tabs), subimos dos niveles: ../../
import { marcadores } from '../../puntos'; 

export default function BuscarScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  
  // --- LÓGICA DE PAGINADO Y FILTRO ---
  const [dataFiltrada, setDataFiltrada] = useState(marcadores); // Todos los resultados posibles
  const [dataVisible, setDataVisible] = useState<any[]>([]);    // Solo los que se ven
  const [pagina, setPagina] = useState(1);
  const elementosPorPagina = 5; // Cargamos de 5 en 5
  const [cargando, setCargando] = useState(false);

  // 1. Efecto para filtrar cuando escribes
  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const filtrados = marcadores.filter(item => 
      item.nombre.toLowerCase().includes(texto) || 
      (item.descripcion && item.descripcion.toLowerCase().includes(texto))
    );
    setDataFiltrada(filtrados);
    setPagina(1); 
    // Al filtrar, reseteamos y mostramos la primera página de los nuevos resultados
    setDataVisible(filtrados.slice(0, elementosPorPagina)); 
  }, [busqueda]);

  // 2. Función para cargar más (Infinite Scroll)
  const cargarMas = () => {
    if (dataVisible.length >= dataFiltrada.length) return; // Ya mostramos todo

    setCargando(true);
    // Simulamos un pequeño delay para que se sienta natural
    setTimeout(() => {
      const siguientePagina = pagina + 1;
      const nuevosElementos = dataFiltrada.slice(0, siguientePagina * elementosPorPagina);
      setDataVisible(nuevosElementos);
      setPagina(siguientePagina);
      setCargando(false);
    }, 1000);
  };

  // 3. Diseño de la Card (Reutilizando estilo visual)
  const renderItem = ({ item }: { item: any }) => (
<TouchableOpacity 
  style={styles.card} 
  activeOpacity={0.7}
  onPress={() => {
    // AGREGAMOS "as any" AL FINAL DEL STRING
    router.push(`/detalle/${item.id}` as any);
  }}
>
      <Image source={{ uri: item.imagen }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#FFD700" />
            <Text style={styles.ratingText}>{item.puntuacion}</Text>
          </View>
        </View>
        
        {/* Simulación de localidad (si no la tienes en el array) */}
        <View style={styles.row}>
            <Ionicons name="location-outline" size={12} color="#666" />
            <Text style={styles.cardAddress}>Buenos Aires, Centro</Text>
        </View>

        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.descripcion}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.headerTitle}>Explorar Baños</Text>
        
        {/* INPUT DE BÚSQUEDA */}
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={{marginRight: 10}} />
            <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, zona..."
            value={busqueda}
            onChangeText={setBusqueda}
            placeholderTextColor="#999"
            />
            {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
                <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
            )}
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={dataVisible}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={cargarMas}     // Detecta el final
        onEndReachedThreshold={0.5}  // Qué tan cerca del final (50%)
        ListFooterComponent={
          cargando ? <ActivityIndicator size="small" color="#007AFF" style={{ margin: 20 }} /> : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={50} color="#ddd" />
            <Text style={styles.emptyText}>No encontramos resultados.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  topContainer: { backgroundColor: '#fff', padding: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#333', marginBottom: 15, marginTop: Platform.OS === 'android' ? 30 : 0 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5',
    borderRadius: 12, paddingHorizontal: 15, height: 45,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  listContent: { padding: 20 },
  
  // CARD STYLES
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 15,
    padding: 10, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  cardImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#eee' },
  cardInfo: { flex: 1, marginLeft: 12, marginRight: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 10, fontWeight: 'bold', color: '#FBC02D', marginLeft: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardAddress: { fontSize: 12, color: '#666', marginLeft: 4 },
  cardDesc: { fontSize: 12, color: '#888', lineHeight: 16 },
  
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16 },
});