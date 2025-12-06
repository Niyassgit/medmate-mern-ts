import { IConnectionRequestLogRepository } from "../../domain/connection/repositories/IConnectionRequestLogRepository";
import { prisma } from "../config/db";

export class ConnectionRequestLogRepository
  implements IConnectionRequestLogRepository
{
  async getTodayRequestCount(repId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const log = await prisma.connectionRequestLog.findFirst({
      where: {
        repId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    return log ? log.count : 0;
  }

  async incrementRequestCount(repId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.connectionRequestLog.upsert({
      where: {
        repId_date: {
          repId,
          date: today,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        repId,
        date: today,
        count: 1,
      },
    });
  }

  async decrementRequestCount(repId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.connectionRequestLog.findFirst({
      where: {
        repId,
        date: {
          gte: today,
        },
      },
    });

    if (log && log.count > 0) {
      await prisma.connectionRequestLog.update({
        where: {
          id: log.id,
        },
        data: {
          count: { decrement: 1 },
        },
      });
    }
  }

  async resetDailyCount(repId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.connectionRequestLog.deleteMany({
      where: {
        repId,
        date: { lt: today },
      },
    });
  }
}
