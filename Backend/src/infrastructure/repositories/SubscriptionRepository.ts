import { ISubscription } from "../../domain/subscription/entities/ISubscription";
import { ISubscriptionRepositoy } from "../../domain/subscription/repositories/ISubscriptionRepository";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { SubscriptionMapper } from "../mappers/SubscriptionMappers";

export class SubscriptionRepository
  extends BaseRepository<
    ISubscription,
    SubscriptionPlan,
    Prisma.SubscriptionPlanCreateInput,
    "subscriptionPlan"
  >
  implements ISubscriptionRepositoy
{
  constructor() {
    super(prisma.subscriptionPlan, (sub) => SubscriptionMapper.toEntity(sub));
  }
  async createSubscription(data: ISubscription): Promise<ISubscription> {
    const mappedData = SubscriptionMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async findSubscriptionById(
    subscriptionId: string
  ): Promise<ISubscription | null> {
    return await this.findById(subscriptionId);
  }

  async getAllSubscriptions(): Promise<ISubscription[]> {
    return await prisma.subscriptionPlan.findMany({});
  }

  async updateSubscriptionPlan(
    subscriptionId: string,
    data: Omit<ISubscription, "id" | "createdAt" | "updatedAt">
  ): Promise<ISubscription> {
    const result = await prisma.subscriptionPlan.update({
      where: { id: subscriptionId },
      data: data,
    });
    return SubscriptionMapper.toEntity(result);
  }

  async toggleListStatus(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscription> {
    const result = await prisma.subscriptionPlan.update({
      where: { id: subscriptionId },
      data: { isActive: isActive },
    });
    return SubscriptionMapper.toEntity(result);
  }

  async deleteSubscriptionById(subscriptionId: string): Promise<void> {
    this.delete(subscriptionId);
  }
}
