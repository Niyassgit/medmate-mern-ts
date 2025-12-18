import { IStripeWebhookService } from "../../domain/common/services/IStripeWebhookService";
import { StripeWebhookEvent } from "../../shared/DataTypes";
import Stripe from "stripe";
import { prisma } from "../config/db";
import { BadRequestError } from "../../application/errors";
import { ErrorMessages } from "../../shared/Messages";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { IMedicalRepRepository } from "../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ISubscriptionHistoryRepository } from "../../domain/subscription/repositories/ISubscriptionHistoryRepository";
import { ISubscriptionRepositoy } from "../../domain/subscription/repositories/ISubscriptionRepository";
import { SubscriptionHistoryMapper } from "../mappers/SubscriptionHistoryMapper";

export class stripeWebhookService implements IStripeWebhookService {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository,
    private _subscriptionRepository: ISubscriptionRepositoy
  ) { }

  async handleCheckoutCompleted(event: StripeWebhookEvent): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.type === "ORDER") {
      const { orderId } = session.metadata;
      const paymentId = (session.payment_intent as string) || session.id;

      if (!orderId) {
        console.warn("Order ID missing in webhook metadata");
        return;
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.SUCCESS,
          status: OrderStatus.CONFIRMED,
          paymentId: paymentId,
        },
      });
      return;
    }

    const repId = session.metadata?.repId;
    const planId = session.metadata?.planId;
    if (!repId || !planId) return;

    const rep = await this._medicalRepRepository.getMedicalRepById(repId);

    if (!rep) {
      console.warn("Medical Rep not found");
      return;
    }

    const start = new Date();
    let baseDate = new Date();

    if (
      rep.subscriptionStatus &&
      rep.subscriptionEnd &&
      new Date(rep.subscriptionEnd) > new Date()
    ) {
      baseDate = new Date(rep.subscriptionEnd);
    }

    const end = new Date(baseDate);


    const plan = await this._subscriptionRepository.findSubscriptionById(planId);

    if (!plan) {
      throw new BadRequestError(ErrorMessages.SUB_NOT_FOUND);
    }
    switch (plan.tenure.toLowerCase()) {
      case "monthly":
        end.setMonth(end.getMonth() + 1);
        break;
      case "quarterly":
        end.setMonth(end.getMonth() + 3);
        break;
      case "yearly":
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
        break;
    }

    await this._medicalRepRepository.updateSubscriptionStatus(
      repId,
      planId,
      start,
      end
    );


    await this._subscriptionHistoryRepository.createHistory({
      repId,
      planId,
      sessionId: session.id,
      paymentIntentId: (session.payment_intent as string) || null,
      invoiceId: (session.invoice as string) || null,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "inr",
      status: session.payment_status,
      startDate: start,
      endDate: end,
      createdAt: new Date(),
    });
  }
}
