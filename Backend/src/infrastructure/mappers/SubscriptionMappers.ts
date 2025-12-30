import { Feature, PlanFeature, Prisma, SubscriptionPlan } from "@prisma/client";
import { ISubscription } from "../../domain/subscription/entities/ISubscription";

export type SubscriptionPlanWithFeatures = SubscriptionPlan & {
  features: (PlanFeature & { feature: Feature })[];
};

export class SubscriptionMapper {
  static toEntity(e: SubscriptionPlanWithFeatures): ISubscription {
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      price: e.price,
      tenure: e.tenure,
      isActive: e.isActive,
      updatedAt: e.updatedAt,
      createdAt: e.createdAt,
      features: e.features.map((pf) => pf.feature.key),
    };
  }
  static toList(e: SubscriptionPlanWithFeatures[]): ISubscription[] {
    return e.map((sub) => this.toEntity(sub));
  }

  static toPersistance(
    entity: ISubscription
  ): Prisma.SubscriptionPlanCreateInput {
    return {
      id: entity.id,
      description: entity.description,
      name: entity.name,
      price: entity.price,
      tenure: entity.tenure,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      reps: entity.repIds?.length
        ? { connect: entity.repIds.map((id) => ({ id })) }
        : undefined,

      features: {
        create: entity.features.map((featureKey) => ({
          feature: {
            connect: { key: featureKey },
          },
        })),
      },
    };
  }
}
