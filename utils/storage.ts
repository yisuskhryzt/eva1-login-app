import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { Task } from '../types/Task';

const TASKS_STORAGE_KEY = '@eva1_tasks';

/**
 * Guarda las tareas en AsyncStorage
 */
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

/**
 * Carga las tareas desde AsyncStorage
 */
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

/**
 * Guarda una foto en el sistema de archivos local
 * @param uri URI de la foto original
 * @param taskId ID de la tarea asociada
 * @returns URI de la foto guardada
 */
export const savePhoto = async (uri: string, taskId: string): Promise<string> => {
  try {
    // Crear directorio para fotos de tareas si no existe
    const directory = new Directory(Paths.document, 'task_photos');
    
    if (!directory.exists) {
      directory.create();
    }

    // Guardar la foto con el ID de la tarea como nombre
    const fileExtension = uri.split('.').pop() || 'jpg';
    const sourceFile = new File(uri);
    const destFile = new File(directory, `${taskId}.${fileExtension}`);
    
    // Copiar el archivo
    await sourceFile.copy(destFile);

    return destFile.uri;
  } catch (error) {
    console.error('Error saving photo:', error);
    throw error;
  }
};

/**
 * Elimina una foto del sistema de archivos
 * @param uri URI de la foto a eliminar
 */
export const deletePhoto = async (uri: string): Promise<void> => {
  try {
    const file = new File(uri);
    if (file.exists) {
      await file.delete();
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    // No lanzamos el error para que la eliminación de la tarea continúe
  }
};

/**
 * Limpia las tareas de AsyncStorage (útil para desarrollo/testing)
 */
export const clearTasks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw error;
  }
};
