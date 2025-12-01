import { ISubscription } from "../../../domain/subscription/entities/ISubscription";
import { createSubscriptionDTO } from "../dto/createSubscriptionDTO";
import { SubscriptionsDTO } from "../dto/SubscriptionsDTO";

export class SubscriptionMapper {
  static toDomain(e: ISubscription): SubscriptionsDTO {
    return {
      id: e.id,
      name: e.name,
      tenure: e.tenure,
      description: e.description,
      features: e.features,
      price: e.price,
      updatedAt: e.updatedAt,
      createdAt: e.createdAt,
    };
  }

  static toListDomain(e: ISubscription[]): SubscriptionsDTO[] {
    return e.map((sub) => this.toDomain(sub));
  }
 
  static toEntity(dto:createSubscriptionDTO):Omit<ISubscription,"id" | "createdAt" | "updatedAt">{
    return {
        name:dto.name,
        description:dto.description,
        features:dto.features,
        price:dto.price,
        tenure:dto.tenure,
    }
  }
}
