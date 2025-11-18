import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Task } from '../types/Task';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit?: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ visible, task, onClose, onEdit }) => {
  const { colors } = useThemeColor();

  if (!task) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Detalle de Tarea</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Image source={{ uri: task.photoUri }} style={styles.image} />

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Título</Text>
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                  task.completed && styles.completedText,
                ]}
              >
                {task.title}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Estado</Text>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: task.completed
                        ? colors.primary + '20'
                        : colors.errorBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: task.completed ? colors.primary : colors.error,
                      },
                    ]}
                  >
                    {task.completed ? '✓ Completada' : '○ Pendiente'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Ubicación</Text>
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <View style={{ flex: 1 }}>
                  {task.location.address ? (
                    <>
                      <Text style={[styles.locationAddress, { color: colors.text }]}>
                        {task.location.address}
                      </Text>
                      <Text style={[styles.locationCoords, { color: colors.hint }]}>
                        {task.location.latitude.toFixed(6)}, {task.location.longitude.toFixed(6)}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.locationAddress, { color: colors.text }]}>
                      {task.location.latitude.toFixed(6)}, {task.location.longitude.toFixed(6)}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Creada</Text>
              <Text style={[styles.dateText, { color: colors.text }]}>
                {formatDate(task.createdAt)}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Usuario</Text>
              <Text style={[styles.userText, { color: colors.text }]}>{task.userId}</Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary }]}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>✏️ Editar Tarea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationAddress: {
    fontSize: 16,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  userText: {
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  editButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
