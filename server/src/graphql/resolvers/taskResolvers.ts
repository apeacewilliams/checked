import { TaskService } from '../../services/TaskService.js';

const taskService = new TaskService();

// TODO: Replace hardcoded userId with context.user.id in Phase 2
const TEMP_USER_ID = 'temp-user-id';

export default {
  Query: {
    tasks: async (_: unknown, args: { search?: string; tag?: string }) => {
      return taskService.findAll(TEMP_USER_ID, {
        search: args.search,
        tag: args.tag,
      });
    },

    task: async (_: unknown, args: { id: string }) => {
      return taskService.findById(args.id, TEMP_USER_ID);
    },
  },

  Mutation: {
    createTask: async (
      _: unknown,
      args: { input: { title: string; description?: string; dueDate?: string; tags?: string[] } },
    ) => {
      return taskService.create(TEMP_USER_ID, args.input);
    },

    updateTask: async (
      _: unknown,
      args: {
        id: string;
        input: {
          title?: string;
          description?: string;
          completed?: boolean;
          dueDate?: string;
          tags?: string[];
        };
      },
    ) => {
      return taskService.update(args.id, TEMP_USER_ID, args.input);
    },

    deleteTask: async (_: unknown, args: { id: string }) => {
      return taskService.delete(args.id, TEMP_USER_ID);
    },

    reorderTasks: async (_: unknown, args: { orderedIds: string[] }) => {
      return taskService.reorder(TEMP_USER_ID, args.orderedIds);
    },
  },

  Task: {
    weather: (task: { weatherData?: unknown }) => {
      return task.weatherData ?? null;
    },
  },
};
