export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Task {
  id: string;
  title: string;
  photoUri: string;
  location: Location;
  completed: boolean;
  userId: string; // Email del usuario que creó la tarea
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  photoUri: string;
  location: Location;
}
