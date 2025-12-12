export interface ICreateOrderData {
  guestId: string;
  prescriptionId: string;
  addressId: string;
  totalAmount: number;
  deliveryAddress?: string;
  paymentId?: string;
}
