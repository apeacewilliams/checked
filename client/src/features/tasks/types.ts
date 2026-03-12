export interface Weather {
  tempC: number;
  tempF: number;
  condition: string;
  icon: string;
  humidity: number | null;
  windKph: number | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  city: string | null;
  weather: Weather | null;
  dueDate: string | null;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  dueDate?: string | null;
  tags?: string[];
}

export interface GetTasksData {
  tasks: Task[];
}

export interface TaskFilters {
  search?: string;
  tag?: string;
}

export interface CreateTaskData {
  createTask: Task;
}

export interface UpdateTaskData {
  updateTask: Task;
}

export interface DeleteTaskData {
  deleteTask: boolean;
}

export interface ReorderTasksData {
  reorderTasks: Task[];
}
