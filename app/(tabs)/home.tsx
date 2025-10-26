import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function HomeScreen() {
  const { email } = useAuth();
  const { colors, isDark } = useThemeColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Text style={[styles.welcomeTitle, { color: colors.text }]}>
        ¡Bienvenido a la guarida del lobo! 🎉
      </Text>
      <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
        Iniciaste sesión exitosamente. ¡Muy bien!
      </Text>
      
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Esta es la pantalla principal de la aplicación, es simple pero, se vienen cositas...
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          Usuario activo: {email}
        </Text>
        <Text style={[styles.infoText, { color: colors.textSecondary, marginTop: 16 }]}>
          💡 Modo: {isDark ? 'Oscuro 🌙' : 'Claro ☀️'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
});