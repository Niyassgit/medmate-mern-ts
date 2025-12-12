import { OrderStatus, StripePaymentStatus } from "../../../shared/Enums";

export interface PrescriptionOrderDTO {
  id: string;
  totalAmount: number;
  paymentStatus: StripePaymentStatus,
  status: OrderStatus,
}