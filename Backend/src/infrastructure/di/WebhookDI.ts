import { HandleStripeWebhookUseCase } from "../../application/subscription/use-cases/HandleStripeWebhookUseCase";
import { WebhookController } from "../../presentation/http/controllers/WebhookController";
import { stripeWebhookService } from "../services/StripeWebHookService";

import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { SubscriptionHistoryRepository } from "../repositories/SubscriptionHistoryRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { OrderRepository } from "../repositories/OrderRepository";
import { CommissionRepository } from "../repositories/CommissionRepository";

const medicalRepRepository = new MedicalRepRepository();
const subscriptionHistoryRepository = new SubscriptionHistoryRepository();
const subscriptionRepository = new SubscriptionRepository();
const orderRepository = new OrderRepository();
const commissionRepository = new CommissionRepository();

const webhookService = new stripeWebhookService(
  medicalRepRepository,
  subscriptionHistoryRepository,
  subscriptionRepository,
  orderRepository,
  commissionRepository
);

const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(
  webhookService
);

export const webhookController = new WebhookController(
  handleStripeWebhookUseCase
);
