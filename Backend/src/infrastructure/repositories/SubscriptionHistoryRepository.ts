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
}

