import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme'; // Si tienes este hook, déjalo
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pantalla Login */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* CORRECCIÓN AQUÍ: */}
        {/* En lugar de 'mapa', llamamos al GRUPO '(tabs)' que contiene el mapa y la búsqueda */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}