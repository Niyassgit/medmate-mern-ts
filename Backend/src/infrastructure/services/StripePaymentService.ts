import { IStripePaymentService } from "../../domain/common/services/IStripePaymentService";
import { ICheckoutDetails } from "../../domain/subscription/entities/ICheckoutDetails";
import { ISubscription } from "../../domain/subscription/entities/ISubscription";
import { env } from "../config/env";
import { stripe } from "../config/stripe";

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
}
