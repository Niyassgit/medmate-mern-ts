import { ISubscription } from "../../domain/subscription/entities/ISubscription";
import { ISubscriptionRepositoy } from "../../domain/subscription/repositories/ISubscriptionRepository";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { SubscriptionMapper } from "../../application/subscription/mappers/SubscriptionMapper";
import { subscriptionMapper } from "../mappers/SubscriptionMappers";

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
    super(prisma.subscriptionPlan, (sub) => SubscriptionMapper.toDomain(sub));
  }
  async createSubscription(data: ISubscription): Promise<ISubscription> {
    const mappedData = subscriptionMapper.toPersistance(data);
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
}
