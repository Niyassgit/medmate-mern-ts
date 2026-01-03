import { ISubscriptionHistoryRepository } from "../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { BaseRepository } from "../database/BaseRepository";
import { ISubscriptionHistory } from "../../domain/subscription/entities/ISubscriptionHistory";
import { Prisma, SubscriptionHistory } from "@prisma/client";
import { SubscriptionHistoryMapper } from "../mappers/SubscriptionHistoryMapper";
import { prisma } from "../config/db";
import { IRecentsubscription } from "../../domain/subscription/entities/IRecentSubscription";
import { SubscribedListResponse } from "../../application/superAdmin/dto/SubscribedListDTO";

export class SubscriptionHistoryRepository
  extends BaseRepository<
    ISubscriptionHistory,
    SubscriptionHistory,
    Prisma.SubscriptionHistoryCreateInput,
    "subscriptionHistory"
  >
  implements ISubscriptionHistoryRepository {
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
      orderBy: { createdAt: "desc" },
    });
    if (!result) return null;
    return result.map((sub)=>SubscriptionHistoryMapper.toDomain(sub));
  }

  async findAllPlans(): Promise<ISubscriptionHistory[]> {
    return this.findAll();
  }

  async findHistoryById(
    SubHisId: string
  ): Promise<ISubscriptionHistory | null> {
    const result = await this.findById(SubHisId);
    if (!result) return null;
    return SubscriptionHistoryMapper.toDomain(result);
  }

  async getRevenueByTier(
    startDate?: Date,
    endDate?: Date
  ): Promise<{ tierName: string; revenue: number }[]> {
    const whereClause: Prisma.SubscriptionHistoryWhereInput = {
      status: "paid",
    };

    if (startDate || endDate) {
      const createdAtFilter: Prisma.DateTimeFilter = {};
      if (startDate) {
        createdAtFilter.gte = startDate;
      }
      if (endDate) {
        createdAtFilter.lte = endDate;
      }
      whereClause.createdAt = createdAtFilter;
    }

    const subscriptions = await prisma.subscriptionHistory.findMany({
      where: whereClause,
      include: {
        plan: {
          select: {
            name: true,
          },
        },
      },
    });

    const revenueByPlan: { [key: string]: number } = {};

    subscriptions.forEach((sub) => {
      const tierName = sub.plan?.name || "Unknown";
      revenueByPlan[tierName] = (revenueByPlan[tierName] || 0) + sub.amount;
    });

    return Object.entries(revenueByPlan)
      .map(([tierName, revenue]) => ({
        tierName,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getRecentSubscriptions(limit: number): Promise<IRecentsubscription[]> {
    const subscriptions = await prisma.subscriptionHistory.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: {
          select: {
            name: true,
          },
        },
        rep: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return subscriptions.map((sub) =>
      SubscriptionHistoryMapper.recentSubToDomain(sub)
    );
  }

  async getSubscribedList(
    page: number,
    limit: number
  ): Promise<SubscribedListResponse> {
    const skip = (page - 1) * limit;

    const total = await prisma.subscriptionHistory.count({
      where: {
        status: "paid",
      },
    });

    const subscriptions = await prisma.subscriptionHistory.findMany({
      where: {
        status: "paid",
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        plan: {
          select: {
            name: true,
          },
        },
        rep: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const subscriptionItems = subscriptions.map((sub) =>
      SubscriptionHistoryMapper.recentSubToDomain(sub)
    );

    const totalPages = Math.ceil(total / limit);

    return {
      subscriptions: subscriptionItems,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
