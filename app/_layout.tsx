import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { 
            backgroundColor: colorScheme === 'dark' ? '#000' : '#f5f5f5' 
          }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}