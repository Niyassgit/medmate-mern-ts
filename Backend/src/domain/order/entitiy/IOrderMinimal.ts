import { OrderStatus, StripePaymentStatus } from "../../../shared/Enums";

export interface IOrderMinimal {
  id: string;
  totalAmount: number;
  paymentStatus: StripePaymentStatus;
  status: OrderStatus;
}
