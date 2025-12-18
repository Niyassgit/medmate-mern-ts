import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface PrescriptionOrderDTO {
  id: string;
  totalAmount: number;
  paymentStatus: PaymentStatus,
  status: OrderStatus,
}