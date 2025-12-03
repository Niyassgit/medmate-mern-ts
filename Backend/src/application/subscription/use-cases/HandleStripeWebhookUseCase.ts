import { IStripeWebhookService } from "../../../domain/common/services/IStripeWebhookService";
import { StripeWebhookEvent } from "../../../shared/DataTypes";
import { IHandleStripeWebhookUseCase } from "../interfaces/IHandleStripeWebhookUseCase";

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(private _stripeWebhookService: IStripeWebhookService) {}

  async execute(event: StripeWebhookEvent): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
        await this._stripeWebhookService.handleCheckoutCompleted(event);
        break;
      default:
    }
  }
}

