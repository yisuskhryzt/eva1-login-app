import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Task, TaskFormData } from '../types/Task';
import { deletePhoto, loadTasks, savePhoto, saveTasks } from '../utils/storage';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  createTask: (taskData: TaskFormData, userId: string) => Promise<void>;
  updateTask: (taskId: string, taskData: TaskFormData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  getUserTasks: (userId: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar tareas al iniciar la app
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  const loadTasksFromStorage = async () => {
    try {
      setIsLoading(true);
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crear una nueva tarea
   */
  const createTask = async (taskData: TaskFormData, userId: string): Promise<void> => {
    try {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Guardar la foto en el sistema de archivos
      const savedPhotoUri = await savePhoto(taskData.photoUri, taskId);

      const newTask: Task = {
        id: taskId,
        title: taskData.title,
        photoUri: savedPhotoUri,
        location: taskData.location,
        completed: false,
        userId,
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  /**
   * Eliminar una tarea
   */
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      const taskToDelete = tasks.find((t) => t.id === taskId);
      
      if (taskToDelete) {
        // Eliminar la foto del sistema de archivos
        await deletePhoto(taskToDelete.photoUri);
      }

      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  /**
   * Actualizar una tarea existente
   */
  const updateTask = async (taskId: string, taskData: TaskFormData): Promise<void> => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === taskId);
      
      if (!taskToUpdate) {
        throw new Error('Tarea no encontrada');
      }

      let updatedPhotoUri = taskData.photoUri;

      // Si la foto cambió, guardar la nueva y eliminar la antigua
      if (taskData.photoUri !== taskToUpdate.photoUri) {
        // Eliminar la foto antigua
        await deletePhoto(taskToUpdate.photoUri);
        // Guardar la nueva foto
        updatedPhotoUri = await savePhoto(taskData.photoUri, taskId);
      }

      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: taskData.title,
              photoUri: updatedPhotoUri,
              location: taskData.location,
            }
          : task
      );

      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  /**
   * Marcar/desmarcar tarea como completada
   */
  const toggleTaskComplete = async (taskId: string): Promise<void> => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  };

  /**
   * Obtener tareas de un usuario específico
   */
  const getUserTasks = (userId: string): Task[] => {
    return tasks.filter((task) => task.userId === userId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        getUserTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider');
  }
  return context;
};
