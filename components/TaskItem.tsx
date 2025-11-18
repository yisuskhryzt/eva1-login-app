import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { Task } from '../types/Task';
import { EditTaskModal } from './EditTaskModal';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { deleteTask, toggleTaskComplete } = useTasks();
  const { colors } = useThemeColor();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async () => {
    try {
      await toggleTaskComplete(task.id);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    setDetailModalVisible(false);
    // Pequeño delay para que se cierre el modal de detalles primero
    setTimeout(() => {
      setEditModalVisible(true);
    }, 300);
  };

  const handleEditComplete = () => {
    setEditModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.card }]}
        onPress={() => setDetailModalVisible(true)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: task.photoUri }} style={styles.image} />
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                task.completed && styles.completedText,
              ]}
            >
              {task.title}
            </Text>
            <TouchableOpacity
              onPress={handleToggleComplete}
              style={[
                styles.checkbox,
                { borderColor: colors.border },
                task.completed && { backgroundColor: colors.primary },
              ]}
            >
              {task.completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.locationContainer}>
            <Text style={[styles.locationIcon, { color: colors.textSecondary }]}>📍</Text>
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>
              {task.location.address || 
                `${task.location.latitude.toFixed(4)}, ${task.location.longitude.toFixed(4)}`}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.dateText, { color: colors.hint }]}>
              {formatDate(task.createdAt)}
            </Text>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={[styles.deleteText, { color: colors.error }]}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <TaskDetailModal
        visible={detailModalVisible}
        task={task}
        onClose={() => setDetailModalVisible(false)}
        onEdit={handleEdit}
      />

      <EditTaskModal
        visible={editModalVisible}
        task={task}
        onClose={handleEditComplete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
