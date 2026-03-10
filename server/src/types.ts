import type { PrismaClient, User } from './generated/prisma/client.js';

export interface AppContext {
  prisma: PrismaClient;
  user: User | null;
}
