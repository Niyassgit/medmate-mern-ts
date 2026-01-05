import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";
import { ISubscription } from "../../../domain/subscription/entities/ISubscription";
import { CreateSubscriptionDTO } from "../dto/CreateSubscriptionDTO";
import { SubscriptionDTO } from "../dto/SubscriptionDTO";
import { SubscriptionStatusDTO } from "../dto/SubscriptionStatusDTO";


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

  static toListDomain(e: ISubscription[]): SubscriptionDTO[] {
    return e.map((sub) => this.toDomain(sub));
  }

  static toEntity(
    dto: CreateSubscriptionDTO
  ): Omit<ISubscription, "id" | "createdAt" | "updatedAt" | "isActive"> {
    return {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      tenure: dto.tenure,
      features: dto.features, 
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
}
