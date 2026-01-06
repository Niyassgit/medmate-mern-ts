import { OrderStatus, PaymentStatus } from "@/types/PaymentTypes";

export interface PrescriptionOrderDTO {
  id: string;
  totalAmount: number;
  paymentStatus: PaymentStatus,
  status: OrderStatus,
}
