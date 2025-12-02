import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.stripe_secret_key, {
  apiVersion: "2025-11-17.clover",
});
