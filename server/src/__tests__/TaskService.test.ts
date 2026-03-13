import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationError } from '../errors/ValidationError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const mockTask = {
  id: 'task-1',
  title: 'Test task',
  description: null,
  completed: false,
  city: null,
  weatherData: null,
  dueDate: null,
  tags: [],
  position: 0,
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock('../prisma.js', () => ({
  prisma: {
    task: {
      aggregate: vi.fn().mockResolvedValue({ _max: { position: null } }),
      create: vi.fn().mockResolvedValue(mockTask),
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(mockTask),
      update: vi.fn().mockResolvedValue(mockTask),
      updateManyAndReturn: vi.fn().mockResolvedValue([mockTask]),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      count: vi.fn().mockResolvedValue(0),
    },
    $transaction: vi.fn().mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        task: {
          aggregate: vi.fn().mockResolvedValue({ _max: { position: null } }),
          create: vi.fn().mockResolvedValue(mockTask),
        },
      }),
    ),
  },
}));

const mockWeatherService = {
  getWeather: vi.fn().mockResolvedValue(null),
};

describe('TaskService', () => {
  let service: import('../services/TaskService.js').TaskService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { TaskService } = await import('../services/TaskService.js');
    service = new TaskService(mockWeatherService as never);
  });

  describe('create()', () => {
    it('throws ValidationError when title is empty', async () => {
      await expect(service.create('user-1', { title: '' })).rejects.toThrow(ValidationError);
    });

    it('throws ValidationError when title is only whitespace', async () => {
      await expect(service.create('user-1', { title: '   ' })).rejects.toThrow(ValidationError);
    });

    it('throws ValidationError when title exceeds 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      await expect(service.create('user-1', { title: longTitle })).rejects.toThrow(ValidationError);
    });

    it('does not throw for a title of exactly 200 characters', async () => {
      const maxTitle = 'a'.repeat(200);
      await expect(service.create('user-1', { title: maxTitle })).resolves.toBeDefined();
    });
  });

  describe('findById()', () => {
    it('throws NotFoundError when no task is found for the given user', async () => {
      const { prisma } = await import('../prisma.js');
      vi.mocked(prisma.task.findFirst).mockResolvedValueOnce(null);

      await expect(service.findById('task-999', 'user-1')).rejects.toThrow(NotFoundError);
    });

    it('returns the task when it exists and belongs to the user', async () => {
      const result = await service.findById('task-1', 'user-1');
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll()', () => {
    it('always scopes the query to the given userId', async () => {
      const { prisma } = await import('../prisma.js');
      await service.findAll('user-42');

      const call = vi.mocked(prisma.task.findMany).mock.calls[0];
      expect(call?.[0]?.where).toMatchObject({ userId: 'user-42' });
    });

    it('applies search filter when provided', async () => {
      const { prisma } = await import('../prisma.js');
      await service.findAll('user-1', { search: 'london' });

      const call = vi.mocked(prisma.task.findMany).mock.calls[0];
      expect(call?.[0]?.where?.OR).toBeDefined();
    });

    it('applies tag filter when provided', async () => {
      const { prisma } = await import('../prisma.js');
      await service.findAll('user-1', { tag: 'high' });

      const call = vi.mocked(prisma.task.findMany).mock.calls[0];
      expect(call?.[0]?.where?.tags).toEqual({ has: 'high' });
    });
  });
});
