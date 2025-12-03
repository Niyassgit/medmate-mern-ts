import { StripeWebhookEvent } from "../../../shared/DataTypes";

export interface IStripeWebhookService{
 handleCheckoutCompleted(event:StripeWebhookEvent):Promise<void>
}