import { IRecentsubscription } from "../../../domain/subscription/entities/IRecentSubscription";
import { ISubscriptionHistory } from "../../../domain/subscription/entities/ISubscriptionHistory";
import { SubscribedListResponse } from "../../superAdmin/dto/SubscribedListDTO";
import { CreateSubHistoryDTO } from "../dto/CreateSubHistoryDTO";

export class SubscriptionHistoryMapper {
  static toEntity(dto: CreateSubHistoryDTO): Omit<ISubscriptionHistory, "id"> {
    return {
      amount: dto.amount,
      currency: dto.currency,
      createdAt: dto.createdAt,
      endDate: dto.endDate,
      invoiceId: dto.invoiceId,
      paymentIntentId: dto.paymentIntentId,
      planId: dto.planId,
      repId: dto.repId,
      sessionId: dto.sessionId,
      startDate: dto.startDate,
      status: dto.status,
    };
  }

  static toDomain(
    subscriptions: IRecentsubscription[],
    page: number,
    total: number,
    limit: number,
    totalPages: number,
  ):SubscribedListResponse{
    return{
      subscriptions:subscriptions,
      page,
      total,
      limit,
      totalPages
    }
  }
}
