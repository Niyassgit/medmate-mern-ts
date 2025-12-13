import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface OrderDTO {
  id: string;
  guestId: string;
  prescriptionId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId: string;
  createdAt: Date;
  items?: {
    name: string;
    quantity: number;
    image?: string;
  }[];
}