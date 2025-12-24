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
import { ICommissionRepository } from "../../domain/Commission/repositories/ICommissionRepository";
import { IOrderRepository } from "../../domain/order/repositories/IOrderRepository";
import { ICommission } from "../../domain/Commission/entities/ICommission";
import { CommissionStatus } from "../../shared/Enums";

export class stripeWebhookService implements IStripeWebhookService {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _subscriptionHistoryRepository: ISubscriptionHistoryRepository,
    private _subscriptionRepository: ISubscriptionRepositoy,
    private _orderRepository: IOrderRepository,
    private _commissionRepository: ICommissionRepository
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

      const orderDetails = await this._orderRepository.findOrderDetailsById(
        orderId
      );
      if (!orderDetails || !orderDetails.prescription) {
        throw new BadRequestError(ErrorMessages.ORDER_NOT_FOUND);
      }

      const commissions = orderDetails.prescription.items.map((item) => {
        const mrp = item.product.mrp;
        const ptr = item.product.ptr;

        const profit = mrp - ptr;
        const adminCut = +(profit * 0.05).toFixed(2);
        const doctorCut = +(profit - adminCut).toFixed(2);
        return {
          orderId,
          productId: item.product.id,
          doctorId: orderDetails.prescription!.doctor.id,
          mrp,
          ptr,
          adminCut,
          doctorCut,
          status: CommissionStatus.PENDING,
        };
      });
      await this._commissionRepository.createCommission(commissions);
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

    const plan = await this._subscriptionRepository.findSubscriptionById(
      planId
    );

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
