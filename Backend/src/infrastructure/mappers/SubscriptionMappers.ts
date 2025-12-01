import { Prisma, SubscriptionPlan } from "@prisma/client";
import { ISubscription } from "../../domain/subscription/entities/ISubscription";

export class SubscriptionMapper {
  static toEntity(e: SubscriptionPlan): ISubscription {
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      features: e.features,
      price: e.price,
      tenure: e.tenure,
      isActive:e.isActive,
      updatedAt: e.updatedAt,
      createdAt: e.createdAt,
    };
  }
  static toList(e: SubscriptionPlan[]): ISubscription[] {
    return e.map((sub) => this.toEntity(sub));
  }

  static toPersistance(
    entity: ISubscription
  ): Prisma.SubscriptionPlanCreateInput {
    return {
      id: entity.id,
      description: entity.description,
      features: entity.features,
      name: entity.name,
      price: entity.price,
      tenure: entity.tenure,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      reps: entity.repIds?.length
        ? { connect: entity.repIds.map((id) => ({ id })) }
        : undefined,
    };
  }
}
