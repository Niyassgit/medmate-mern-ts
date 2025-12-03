import Stripe from "stripe";

export const DataTypes={
 STRING:"string",
 NUMBER:"number"
}as const;

export type StripeWebhookEvent = Stripe.Event;