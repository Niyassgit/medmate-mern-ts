import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface IOrderMinimal {
  id: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
}
