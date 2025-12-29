
import { ISubscription } from "../../domain/subscription/entities/ISubscription";
import { ISubscriptionRepositoy } from "../../domain/subscription/repositories/ISubscriptionRepository";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { SubscriptionMapper, SubscriptionPlanWithFeatures } from "../../application/subscription/mappers/SubscriptionMapper";

export class SubscriptionRepository
  extends BaseRepository<
    ISubscription,
    SubscriptionPlan,
    Prisma.SubscriptionPlanCreateInput,
    "subscriptionPlan"
  >
  implements ISubscriptionRepositoy {
  constructor() {
    super(prisma.subscriptionPlan, (sub) => SubscriptionMapper.toDomainEntity(sub));
  }
  async createSubscription(data: ISubscription): Promise<ISubscription> {
    const mappedData = SubscriptionMapper.toPersistence(data);
    return this.create(mappedData);
  }

  async findSubscriptionById(
    subscriptionId: string
  ): Promise<ISubscription | null> {
    const result = await prisma.subscriptionPlan.findUnique({
      where: { id: subscriptionId },
      include: { features: { include: { feature: true } } },
    });
    if (!result) return null;
    return SubscriptionMapper.toDomainEntity(result as unknown as SubscriptionPlanWithFeatures);
  }

  async getAllSubscriptions(): Promise<ISubscription[]> {
    const result = await prisma.subscriptionPlan.findMany({
      include: { features: { include: { feature: true } } },
    });
    // Map each prisma result to domain entity
    return result.map(p => SubscriptionMapper.toDomainEntity(p as unknown as SubscriptionPlanWithFeatures));
  }

  async updateSubscriptionPlan(
    subscriptionId: string,
    data: Omit<ISubscription, "id" | "createdAt" | "updatedAt">
  ): Promise<ISubscription> {

    // Filtering out 'features' from data if simply passed as strings to update scalar fields
    const { features, ...rest } = data as any;

    const result = await prisma.subscriptionPlan.update({
      where: { id: subscriptionId },
      data: rest,
      include: { features: { include: { feature: true } } }
    });
    return SubscriptionMapper.toDomainEntity(result as unknown as SubscriptionPlanWithFeatures);
  }

  async toggleListStatus(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscription> {
    const result = await prisma.subscriptionPlan.update({
      where: { id: subscriptionId },
      data: { isActive: isActive },
      include: { features: { include: { feature: true } } }
    });
    return SubscriptionMapper.toDomainEntity(result as unknown as SubscriptionPlanWithFeatures);
  }

  async deleteSubscriptionById(subscriptionId: string): Promise<void> {
    await this.delete(subscriptionId);
  }
}
