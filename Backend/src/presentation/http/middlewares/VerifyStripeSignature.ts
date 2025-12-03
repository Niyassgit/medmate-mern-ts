import { Request, Response, NextFunction } from "express";
import { stripe } from "../../../infrastructure/config/stripe";
import { env } from "../../../infrastructure/config/env";
import { UnautharizedError } from "../../../application/errors";
import { ErrorMessages } from "../../../shared/Messages";

export const VerifyStripeSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    throw new UnautharizedError( ErrorMessages.NO_STRIPE_SIG_FOUND);
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.stripe_webhook_secret
    );

    req.body = event;
    next();
  } catch (err) {
    const error = err as Error;
    throw new UnautharizedError(
      `${ErrorMessages.WEB_HOOK_SIG_VER_FAILED}: ${error.message}`
    );
  }
};

