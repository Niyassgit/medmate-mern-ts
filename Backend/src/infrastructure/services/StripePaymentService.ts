import { IStripePaymentService } from "../../domain/common/services/IStripePaymentService";
import { IOrderCheckoutDetails } from "../../domain/order/entitiy/IOrderCheckoutDetails";
import { ICheckoutDetails } from "../../domain/subscription/entities/ICheckoutDetails";
import { ISubscription } from "../../domain/subscription/entities/ISubscription";
import { env } from "../config/env";
import { stripe } from "../config/stripe";
import { IOrderPaymentDetails } from "../../domain/order/entitiy/IOrderPaymentDetails";

export class StripePaymentService implements IStripePaymentService {
  async createCheckoutSession(
    repId: string,
    plan: ISubscription,
    price: number
  ): Promise<string | null> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: plan.name, description: plan.description },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.origin}/rep/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.origin}/rep/subscription-cancel`,
      metadata: { repId, planId: plan.id },
    });
    return session.url;
  }

  async getCheckoutDetails(sessionId: string): Promise<ICheckoutDetails> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      amount_total: session.amount_total ?? 0,
      currency: session.currency ?? "INR",
      payment_status: session.payment_status ?? "unpaid",
      planId: session.metadata?.planId ?? "",
      repId: session.metadata?.repId ?? "",
    };
  }

  async createOrderCheckoutSession(
    paymentDetails: IOrderPaymentDetails
  ): Promise<string | null> {
    const { orderId, items, customerEmail, prescriptionId, guestId } =
      paymentDetails;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${env.origin}/guest/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.origin}/guest/order-cancel`,
      customer_email: customerEmail,
      metadata: { orderId, type: "ORDER", prescriptionId, guestId },
    });
    return session.url;
  }

  async getOrderCheckoutDetails(
    sessionId: string
  ): Promise<IOrderCheckoutDetails> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      amount_total: session.amount_total ?? 0,
      currency: session.currency ?? "inr",
      payment_status: session.payment_status,
      prescriptionId: session.metadata?.prescriptionId ?? "",
      guestId: session.metadata?.guestId ?? "",
    };
  }
}
