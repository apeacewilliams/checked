import {
  TaskService,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '../../services/TaskService.js';
import { WeatherService } from '../../services/WeatherService.js';
import { InMemoryWeatherCache } from '../../services/WeatherCache.js';
import { DynamoWeatherCache } from '../../services/DynamoWeatherCache.js';
import { config } from '../../config/index.js';
import { requireAuth } from '../requireAuth.js';
import type { AppContext } from '../../types.js';

const cache = config.awsRegion
  ? new DynamoWeatherCache(config.dynamoTableName, config.awsRegion)
  : new InMemoryWeatherCache();
const weatherService = new WeatherService(cache);
const taskService = new TaskService(weatherService);

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

  },

  Task: {
    weather: (task: { weatherData?: unknown }) => {
      return task.weatherData ?? null;
    },
    dueDate: (task: { dueDate?: Date | null }) => {
      return task.dueDate ? task.dueDate.toISOString() : null;
    },
    createdAt: (task: { createdAt: Date }) => task.createdAt.toISOString(),
    updatedAt: (task: { updatedAt: Date }) => task.updatedAt.toISOString(),
  },
};
