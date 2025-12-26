import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface OrderTableDTO {
  orderId: string;
  doctorName: string;
  createdAt: string;
  orderStatus: OrderStatus;
  totalAmount: string;
  payementStatus: PaymentStatus;
}
