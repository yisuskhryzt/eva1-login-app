import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { Task, Location as TaskLocation } from '../types/Task';

interface EditTaskModalProps {
  visible: boolean;
  task: Task;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, task, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [photoUri, setPhotoUri] = useState(task.photoUri);
  const [location, setLocation] = useState<TaskLocation>(task.location);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { updateTask } = useTasks();
  const { colors } = useThemeColor();

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a la cámara para tomar fotos de las tareas.'
      );
      return false;
    }
    return true;
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a la ubicación para asociarla con la tarea.'
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleGetLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    try {
      setIsGettingLocation(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Intentar obtener la dirección (geocoding inverso)
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        const address = addresses[0];
        const formattedAddress = address
          ? `${address.street || ''} ${address.city || ''}, ${address.region || ''}`.trim()
          : undefined;

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: formattedAddress,
        });
      } catch {
        // Si falla el geocoding, solo guardar coordenadas
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para la tarea');
      return;
    }

    try {
      setIsLoading(true);
      await updateTask(task.id, {
        title: title.trim(),
        photoUri,
        location,
      });

      Alert.alert('Éxito', 'Tarea actualizada correctamente');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Restaurar valores originales si se cancela
    setTitle(task.title);
    setPhotoUri(task.photoUri);
    setLocation(task.location);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Tarea</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.closeButton, { color: colors.primary }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Título</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="¿Qué necesitas hacer?"
              placeholderTextColor={colors.hint}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Foto</Text>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleTakePhoto}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>📷 Retomar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
                onPress={handlePickImage}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>🖼️ Galería</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Ubicación</Text>
            <View style={[styles.locationCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.locationText, { color: colors.text }]}>
                📍{' '}
                {location.address ||
                  `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
              </Text>
              <TouchableOpacity onPress={handleGetLocation} disabled={isGettingLocation}>
                <Text style={[styles.retakeText, { color: colors.primary }]}>
                  {isGettingLocation ? 'Obteniendo...' : 'Actualizar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: colors.primary }]}
            onPress={handleUpdateTask}
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationCard: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  updateButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
