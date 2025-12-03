import { ISubscriptionHistoryRepository } from "../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { BaseRepository } from "../database/BaseRepository";
import { ISubscriptionHistory } from "../../domain/subscription/entities/ISubscriptionHistory";
import { Prisma, SubscriptionHistory } from "@prisma/client";
import { SubscriptionHistoryMapper } from "../mappers/SubscriptionHistoryMapper";
import { prisma } from "../config/db";

export class SubscriptionHistoryRepository
  extends BaseRepository<
    ISubscriptionHistory,
    SubscriptionHistory,
    Prisma.SubscriptionHistoryCreateInput,
    "subscriptionHistory"
  >
  implements ISubscriptionHistoryRepository
{
  constructor() {
    super(prisma.subscriptionHistory, (sub) =>
      SubscriptionHistoryMapper.toDomain(sub)
    );
  }

  async createHistory(
    data: Omit<ISubscriptionHistory, "id">
  ): Promise<ISubscriptionHistory> {
    const mappedData = SubscriptionHistoryMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async findHistoriesByRepId(
    repId: string
  ): Promise<ISubscriptionHistory[] | null> {
    const result = await prisma.subscriptionHistory.findMany({
      where: { repId },
      orderBy: { createdAt: 'desc' }
    });
    if (!result) return null;
    return result.map(SubscriptionHistoryMapper.toDomain);
  }

  async findAllPlans(): Promise<ISubscriptionHistory[]> {
    return this.findAll();
  }
  
  async findHistoryById(SubHisId: string): Promise<ISubscriptionHistory | null> {
    const result = await this.findById(SubHisId);
    if(!result) return null;
    return SubscriptionHistoryMapper.toDomain(result);
  }

  async getRevenueByTier(startDate?: Date, endDate?: Date): Promise<{ tierName: string; revenue: number }[]> {
    const whereClause: any = {
      status: 'paid'
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = startDate;
      }
      if (endDate) {
        whereClause.createdAt.lte = endDate;
      }
    }

    const subscriptions = await prisma.subscriptionHistory.findMany({
      where: whereClause,
      include: {
        plan: {
          select: {
            name: true
          }
        }
      }
    });

    const revenueByPlan: { [key: string]: number } = {};

    subscriptions.forEach((sub) => {
      const tierName = sub.plan?.name || 'Unknown';
      revenueByPlan[tierName] = (revenueByPlan[tierName] || 0) + sub.amount;
    });

    return Object.entries(revenueByPlan).map(([tierName, revenue]) => ({
      tierName,
      revenue
    })).sort((a, b) => b.revenue - a.revenue); 
  }

  async getRecentSubscriptions(limit: number): Promise<{ userId: string; name: string; tier: string; amount: number; date: Date; status: string }[]> {
    const subscriptions = await prisma.subscriptionHistory.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        plan: {
          select: {
            name: true
          }
        },
        rep: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return subscriptions.map(sub => ({
      userId: sub.repId,
      name: sub.rep?.name || 'Unknown',
      tier: sub.plan?.name || 'Unknown',
      amount: sub.amount,
      date: sub.createdAt,
      status: sub.status
    }));
  }
}

