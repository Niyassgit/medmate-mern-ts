import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";
import { ISubscription } from "../../../domain/subscription/entities/ISubscription";
import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { SubscriptionStatusDTO } from "../dto/SubscriptionStatusDTO";

import { SubscriptionPlan, PlanFeature, Feature } from "@prisma/client";

export type SubscriptionPlanWithFeatures = SubscriptionPlan & {
  features: (PlanFeature & { feature: Feature })[];
};

export class SubscriptionMapper {
  static toDomain(e: ISubscription): SubscriptionDTO {
    return {
      id: e.id,
      name: e.name,
      tenure: e.tenure,
      description: e.description,
      features: e.features,
      price: e.price,
      isActive: e.isActive,
      updatedAt: e.updatedAt,
      createdAt: e.createdAt,
    };
  }

  static toDomainEntity(e: SubscriptionPlanWithFeatures): ISubscription {
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      price: e.price,
      tenure: e.tenure,
      features: e.features?.map((f: any) => f.feature.key) || [],
      isActive: e.isActive,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  }

  static toListDomain(e: ISubscription[]): SubscriptionDTO[] {
    return e.map((sub) => this.toDomain(sub));
  }

  static toEntity(
    dto: CreateSubscriptionDTO
  ): Omit<ISubscription, "id" | "createdAt" | "updatedAt" | "isActive"> {
    return {
      name: dto.name,
      description: dto.description,
      features: dto.features,
      price: dto.price,
      tenure: dto.tenure,
    };
  }

  static statusToDomain(data: IMedicalRepWithUser): SubscriptionStatusDTO {
    return {
      planId: data.subscriptionPlanId ?? null,
      startDate: data.subscriptionStart ?? null,
      endDate: data.subscriptionEnd ?? null,
      isActive: data.subscriptionStatus ?? false,
    };
  }

  static toPersistence(data: ISubscription): any {
    return {
      name: data.name,
      description: data.description,
      price: data.price,
      tenure: data.tenure,
      features: {
        create: data.features.map((featureId) => ({
          feature: {
            connect: { id: featureId },
          },
        })),
      },
    };
  }
}
