import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserStats {
  static async getUserStats(userId) {
    const stats = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        stats: true,
        id: true,
      },
    });
    return stats;
  }
}
