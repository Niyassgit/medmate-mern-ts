import { OrderStatus, PaymentStatus } from "../../../shared/Enums";

export interface IOrder {
  id: string;
  guestId: string;
  prescriptionId: string;
  addressId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
  doctorName?: string;
  guestName?: string;
  hospital?: string;
  items?: {
    productId?: string;
    name: string;
    quantity: number;
    image?: string;
    ptr?: number;
    repId?: string;
  }[];
}
