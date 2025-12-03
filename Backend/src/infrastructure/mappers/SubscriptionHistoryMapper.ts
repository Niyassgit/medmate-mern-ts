import { Prisma, SubscriptionHistory } from "@prisma/client";
import { ISubscriptionHistory } from "../../domain/subscription/entities/ISubscriptionHistory";

export class SubscriptionHistoryMapper {
  static toPersistance(
    data: Omit<ISubscriptionHistory,"id">
  ): Prisma.SubscriptionHistoryCreateInput {
    return {
      amount: data.amount,
      currency: data.currency,
      endDate: data.endDate,
      sessionId: data.sessionId,
      startDate: data.startDate,
      status: data.status,
      createdAt: data.createdAt,
      paymentIntentId: data.paymentIntentId,
      invoiceId: data.invoiceId,
      plan: { connect: { id: data.planId } },
      rep: { connect: { id: data.repId } },
    };
  }

  static toDomain(data: SubscriptionHistory): ISubscriptionHistory {
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      endDate: data.endDate,
      sessionId: data.sessionId,
      startDate: data.startDate,
      status: data.status,
      createdAt: data.createdAt,
      paymentIntentId: data.paymentIntentId,
      invoiceId: data.invoiceId,
      planId: data.planId,
      repId: data.repId,
    };
  }
}

