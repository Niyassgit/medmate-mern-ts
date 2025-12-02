import { StripePaymentStatus } from "../../../shared/Enums";

export interface CheckoutDetailsDTO {
  amount_total:number;
  currency: string;
  payment_status: string;
  planId: string;
  repId: string;
}
