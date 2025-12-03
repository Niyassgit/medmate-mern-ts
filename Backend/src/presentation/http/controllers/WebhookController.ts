import { Request, Response } from "express";
import { IHandleStripeWebhookUseCase } from "../../../application/subscription/interfaces/IHandleStripeWebhookUseCase";
import { HttpStatusCode } from "../../../shared/HttpStatusCodes";
import { StripeWebhookEvent } from "../../../shared/DataTypes";

export class WebhookController {
  constructor(
    private _handleStripeWebhookUseCase: IHandleStripeWebhookUseCase
  ) {}

  handleStripeWebhook = async (req: Request, res: Response) => {
    const event = req.body as StripeWebhookEvent;

    await this._handleStripeWebhookUseCase.execute(event);

    return res
      .status(HttpStatusCode.OK)
      .json({ success: true, received: true });
  };
}

