import { HandleStripeWebhookUseCase } from "../../application/subscription/use-cases/HandleStripeWebhookUseCase";
import { WebhookController } from "../../presentation/http/controllers/WebhookController";
import { stripeWebhookService } from "../services/StripeWebHookService";

const webhookService = new stripeWebhookService();

const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(
  webhookService
);

export const webhookController = new WebhookController(
  handleStripeWebhookUseCase
);

