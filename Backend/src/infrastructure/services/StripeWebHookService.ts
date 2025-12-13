import { IStripeWebhookService } from "../../domain/common/services/IStripeWebhookService";
import { StripeWebhookEvent } from "../../shared/DataTypes";
import Stripe from "stripe";
import { prisma } from "../config/db";
import { BadRequestError } from "../../application/errors";
import { ErrorMessages } from "../../shared/Messages";
import { PaymentStatus, OrderStatus } from "@prisma/client";

export class stripeWebhookService implements IStripeWebhookService {
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

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    const start = new Date();
    const end = new Date();
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
    await prisma.medicalRep.update({
      where: { id: repId },
      data: {
        subscriptionPlanId: planId,
        subscriptionStatus: true,
        subscriptionStart: start,
        subscriptionEnd: end,
      },
    });
  }
}
