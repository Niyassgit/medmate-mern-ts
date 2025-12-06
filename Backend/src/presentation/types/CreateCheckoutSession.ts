export interface CheckoutSessionBody {
  amount_total: number;
  currency: string;
  payment_status: string;
  planId: string;
  repId: string;
}
