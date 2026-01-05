import { ISubscription } from "../../domain/subscription/entities/ISubscription";
import { ISubscriptionRepository } from "../../domain/subscription/repositories/ISubscriptionRepository";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import {
  SubscriptionMapper,
  SubscriptionPlanWithFeatures,
} from "../mappers/SubscriptionMappers";

export class SubscriptionRepository
  extends BaseRepository<
    ISubscription,
    SubscriptionPlan,
    Prisma.SubscriptionPlanCreateInput,
    "subscriptionPlan"
  >
  implements ISubscriptionRepository
{
  constructor() {
    super(prisma.subscriptionPlan, (sub) =>
      SubscriptionMapper.toDomainWithoutFeatures(sub)
    );
  }
  async createSubscription(data: ISubscription): Promise<ISubscription> {
    const mappedData = SubscriptionMapper.toPersistence(data);
    const created = await prisma.subscriptionPlan.create({
      data: mappedData,
      include: { features: { include: { feature: true } } },
    });
    return SubscriptionMapper.toEntity(
      created as SubscriptionPlanWithFeatures
    );
  }

  async findSubscriptionById(
    subscriptionId: string
  ): Promise<ISubscription | null> {
    const result = await prisma.subscriptionPlan.findUnique({
      where: { id: subscriptionId },
      include: { features: { include: { feature: true } } },
    });
    if (!result) return null;
    return SubscriptionMapper.toEntity(
      result as SubscriptionPlanWithFeatures
    );
  }

  async getAllSubscriptions(): Promise<ISubscription[]> {
    const result = await prisma.subscriptionPlan.findMany({
      include: { features: { include: { feature: true } } },
    });
    return SubscriptionMapper.toList(
      result as SubscriptionPlanWithFeatures[]
    );
  }

  async updateSubscriptionPlan(
    subscriptionId: string,
    data: Omit<ISubscription, "id" | "createdAt" | "updatedAt">
  ): Promise<ISubscription> {
    const { features, ...rest } = data;

    await prisma.planFeature.deleteMany({
      where: { planId: subscriptionId },
    });

    const updateData = SubscriptionMapper.toUpdatePersistence({
      ...rest,
      features,
    });

    const result = await prisma.subscriptionPlan.update({
      where: { id: subscriptionId },
      data: updateData,
      include: { features: { include: { feature: true } } },
    });
    return SubscriptionMapper.toEntity(
      result as SubscriptionPlanWithFeatures
    );
  }

  async toggleListStatus(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscription> {
    const result = await prisma.subscriptionPlan.update({
      where: { id: subscriptionId },
      data: { isActive: isActive },
      include: { features: { include: { feature: true } } },
    });
    return SubscriptionMapper.toEntity(
      result as SubscriptionPlanWithFeatures
    );
  }

  async deleteSubscriptionById(subscriptionId: string): Promise<void> {
    await prisma.planFeature.deleteMany({
      where: { planId: subscriptionId },
    });
    await this.delete(subscriptionId);
  }
}
