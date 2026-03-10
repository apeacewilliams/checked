import { TaskService, type CreateTaskInput, type UpdateTaskInput } from '../../services/TaskService.js';
import { requireAuth } from '../requireAuth.js';
import type { AppContext } from '../../types.js';

const taskService = new TaskService();

export default {
  Query: {
    tasks: async (_: unknown, args: { search?: string; tag?: string }, context: AppContext) => {
      const user = requireAuth(context);
      return taskService.findAll(user.id, {
        search: args.search,
        tag: args.tag,
      });
    },

    task: async (_: unknown, args: { id: string }, context: AppContext) => {
      const user = requireAuth(context);
      return taskService.findById(args.id, user.id);
    },
  },

  Mutation: {
    createTask: async (_: unknown, args: { input: CreateTaskInput }, context: AppContext) => {
      const user = requireAuth(context);
      return taskService.create(user.id, args.input);
    },

    updateTask: async (
      _: unknown,
      args: { id: string; input: UpdateTaskInput },
      context: AppContext,
    ) => {
      const user = requireAuth(context);
      return taskService.update(args.id, user.id, args.input);
    },

    deleteTask: async (_: unknown, args: { id: string }, context: AppContext) => {
      const user = requireAuth(context);
      return taskService.delete(args.id, user.id);
    },

    reorderTasks: async (_: unknown, args: { orderedIds: string[] }, context: AppContext) => {
      const user = requireAuth(context);
      return taskService.reorder(user.id, args.orderedIds);
    },
  },

  Task: {
    weather: (task: { weatherData?: unknown }) => {
      return task.weatherData ?? null;
    },
  },
};
