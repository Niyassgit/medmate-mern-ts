import { OrderStatus, StripePaymentStatus } from "../../../shared/Enums";

export interface IOrder {
  id: string;
  guestId: string;
  prescriptionId: string;
  addressId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: StripePaymentStatus;
  deliveryAddress: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}
