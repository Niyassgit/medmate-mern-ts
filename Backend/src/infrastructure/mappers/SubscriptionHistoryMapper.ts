import { Prisma, SubscriptionHistory } from "@prisma/client";
import { ISubscriptionHistory } from "../../domain/subscription/entities/ISubscriptionHistory";
import { IRecentsubscription } from "../../domain/subscription/entities/IRecentSubscription";
import { IRecentSubscriptionPrisma } from "../types/IRecentSubscriptionPrisma";

export class SubscriptionHistoryMapper {
  static toPersistance(
    data: Omit<ISubscriptionHistory, "id">
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

  static recentSubToDomain(
    data: IRecentSubscriptionPrisma
  ): IRecentsubscription {
    return {
      userId: data.repId,
      name: data.rep?.name ?? "Unknown",
      tier: data.plan?.name ?? "Unknown",
      amount: data.amount,
      date: data.createdAt,
      status: data.status,
    };
  }

  static toDomainFromSession(
    session: any, // Using any for Stripe session to avoid importing Stripe types in Mapper if not present, or use correct Type if available
    repId: string,
    planId: string,
    startDate: Date,
    endDate: Date
  ): Omit<ISubscriptionHistory, "id"> {
    return {
      repId,
      planId,
      sessionId: session.id,
      paymentIntentId: (session.payment_intent as string) || null,
      invoiceId: (session.invoice as string) || null,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "inr",
      status: session.payment_status,
      startDate,
      endDate,
      createdAt: new Date(),
    };
  }
}
