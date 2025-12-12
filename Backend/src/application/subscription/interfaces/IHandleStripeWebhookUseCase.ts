import { StripeWebhookEvent } from "../../../shared/DataTypes";

export interface IHandleStripeWebhookUseCase {
  execute(event: StripeWebhookEvent): Promise<void>;
}
















