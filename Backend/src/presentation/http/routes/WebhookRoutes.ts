import { Router } from "express";
import express from "express";
import { webhookController } from "../../../infrastructure/di/WebhookDI";
import { VerifyStripeSignature } from "../middlewares/VerifyStripeSignature";

export class WebhookRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/stripe",
      express.raw({ type: "application/json" }),
      VerifyStripeSignature,
      webhookController.handleStripeWebhook
    );
  }
}

