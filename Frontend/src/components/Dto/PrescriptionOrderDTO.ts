import { OrderStatus, StripePaymentStatus } from "@/types/PaymentTypes";

export interface PrescriptionOrderDTO {
  id: string;
  totalAmount: number;
  paymentStatus: StripePaymentStatus,
  status: OrderStatus,
}
