// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme'; // Esto déjalo si ya estaba, si da error bórralo.
import 'react-native-reanimated';

export default function RootLayout() {
  // Detectamos si el celular está en modo oscuro o claro
  const colorScheme = useColorScheme(); 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Definimos nuestras dos pantallas */}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="mapa" options={{ title: 'Mapa de Puntos' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}