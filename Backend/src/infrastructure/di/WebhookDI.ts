import { HandleStripeWebhookUseCase } from "../../application/subscription/use-cases/HandleStripeWebhookUseCase";
import { WebhookController } from "../../presentation/http/controllers/WebhookController";
import { stripeWebhookService } from "../services/StripeWebHookService";

import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { SubscriptionHistoryRepository } from "../repositories/SubscriptionHistoryRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";

const medicalRepRepository = new MedicalRepRepository();
const subscriptionHistoryRepository = new SubscriptionHistoryRepository();
const subscriptionRepository = new SubscriptionRepository();

const webhookService = new stripeWebhookService(
  medicalRepRepository,
  subscriptionHistoryRepository,
  subscriptionRepository
);

const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(
  webhookService
);

export const webhookController = new WebhookController(
  handleStripeWebhookUseCase
);

