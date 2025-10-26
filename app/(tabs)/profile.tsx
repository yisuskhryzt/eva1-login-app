import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function ProfileScreen() {
  const { email, logout } = useAuth();
  const router = useRouter();
  const { colors, isDark } = useThemeColor();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
      
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: colors.avatar }]}>
          <Text style={styles.avatarText}>
            {email.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.label, { color: colors.hint }]}>Email:</Text>
          <Text style={[styles.email, { color: colors.text }]}>{email}</Text>
        </View>

        <View style={styles.themeInfo}>
          <Text style={[styles.themeText, { color: colors.textSecondary }]}>
            {isDark ? '🌙 Tema Oscuro' : '☀️ Tema Claro'}
          </Text>
          <Text style={[styles.themeSubtext, { color: colors.hint }]}>
            Detectado automáticamente del sistema
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.logoutButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.logoutBorder,
          }
        ]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    width: '100%',
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  themeSubtext: {
    fontSize: 12,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});