import { Feature, PlanFeature, Prisma, SubscriptionPlan } from "@prisma/client";
import { ISubscription } from "../../domain/subscription/entities/ISubscription";

export type SubscriptionPlanWithFeatures = SubscriptionPlan & {
  features: (PlanFeature & { feature: Feature })[];
};

type SubscriptionPlanCreateInputWithFeatures = Omit<
  Prisma.SubscriptionPlanCreateInput,
  "features"
> & {
  features: {
    create: Array<{
      feature: {
        connect: { id: string };
      };
    }>;
  };
};

type SubscriptionPlanUpdateInputWithFeatures = Omit<
  Prisma.SubscriptionPlanUpdateInput,
  "features"
> & {
  features: {
    create: Array<{
      feature: {
        connect: { id: string };
      };
    }>;
  };
};

export class SubscriptionMapper {

  static toEntity(e: SubscriptionPlanWithFeatures): ISubscription {
    const features: string[] = e.features.map(
      (pf: PlanFeature & { feature: Feature }) => pf.feature.key
    );

    return {
      id: e.id,
      name: e.name,
      description: e.description,
      price: e.price,
      tenure: e.tenure,
      features: features,
      isActive: e.isActive,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  }

  static toDomainWithoutFeatures(e: SubscriptionPlan): ISubscription {
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      price: e.price,
      tenure: e.tenure,
      features: [], 
      isActive: e.isActive,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  }

  static toList(e: SubscriptionPlanWithFeatures[]): ISubscription[] {
    return e.map((sub) => this.toEntity(sub));
  }

  static toPersistence(
    data: ISubscription
  ): SubscriptionPlanCreateInputWithFeatures {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      tenure: data.tenure,
      features: {
        create: data.features.map((featureId: string) => ({
          feature: {
            connect: { id: featureId },
          },
        })),
      },
    };
  }


  static toUpdatePersistence(
    data: Omit<ISubscription, "id" | "createdAt" | "updatedAt">
  ): SubscriptionPlanUpdateInputWithFeatures {
    const { features, ...rest } = data;

    return {
      ...rest,
      features: {
        create: features.map((featureId: string) => ({
          feature: {
            connect: { id: featureId },
          },
        })),
      },
    };
  }
}
