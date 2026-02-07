// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Pestaña 1: Coincide con el archivo mapa.tsx */}
      <Tabs.Screen
        name="mapa" 
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={28} color={color} />
          ),
        }}
      />

      {/* Pestaña 2: Coincide con el archivo buscar.tsx */}
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}