import { prisma } from '../prisma.js';

export class AuthService {
  async findOrCreateUser(firebaseUid: string, email: string, displayName: string) {
    return prisma.user.upsert({
      where: { firebaseUid },
      update: { email, displayName },
      create: { firebaseUid, email, displayName },
    });
  }
}
