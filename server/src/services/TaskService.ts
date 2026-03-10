import type { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../prisma.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

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

export class TaskService {
  async create(userId: string, input: CreateTaskInput) {
    const title = input.title.trim();

    if (!title) {
      throw new ValidationError('Title is required');
    }

    if (title.length > 200) {
      throw new ValidationError('Title must be 200 characters or less');
    }

    if (input.description && input.description.length > 2000) {
      throw new ValidationError('Description must be 2000 characters or less');
    }

    return prisma.$transaction(async (tx) => {
      const maxPosition = await tx.task.aggregate({
        where: { userId },
        _max: { position: true },
      });

      const position = (maxPosition._max.position ?? -1) + 1;

      return tx.task.create({
        data: {
          title,
          description: input.description ?? null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          tags: input.tags ?? [],
          position,
          userId,
        },
      });
    });
  }

  async findAll(userId: string, filters?: { search?: string; tag?: string }) {
    const where: Prisma.TaskWhereInput = { userId };

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.tag) {
      where.tags = { has: filters.tag };
    }

    return prisma.task.findMany({
      where,
      orderBy: { position: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundError('Task', id);
    }

    return task;
  }

  async update(id: string, userId: string, input: UpdateTaskInput) {
    let trimmedTitle: string | undefined;

    if (input.title !== undefined) {
      trimmedTitle = input.title.trim();

      if (!trimmedTitle) {
        throw new ValidationError('Title is required');
      }

      if (trimmedTitle.length > 200) {
        throw new ValidationError('Title must be 200 characters or less');
      }
    }

    if (input.description !== undefined && input.description && input.description.length > 2000) {
      throw new ValidationError('Description must be 2000 characters or less');
    }

    const updated = await prisma.task.updateManyAndReturn({
      where: { id, userId },
      data: {
        ...(trimmedTitle !== undefined && { title: trimmedTitle }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.completed !== undefined && { completed: input.completed }),
        ...(input.dueDate !== undefined && {
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        }),
        ...(input.tags !== undefined && { tags: input.tags }),
      },
    });

    if (updated.length === 0) {
      throw new NotFoundError('Task', id);
    }

    return updated[0]!;
  }

  async delete(id: string, userId: string) {
    const { count } = await prisma.task.deleteMany({
      where: { id, userId },
    });

    if (count === 0) {
      throw new NotFoundError('Task', id);
    }

    return true;
  }

  async reorder(userId: string, orderedIds: string[]) {
    const count = await prisma.task.count({
      where: { id: { in: orderedIds }, userId },
    });

    if (count !== orderedIds.length) {
      throw new ValidationError('One or more task IDs are invalid or do not belong to you');
    }

    return prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.task.update({
          where: { id },
          data: { position: index },
        })
      )
    );
  }
}
