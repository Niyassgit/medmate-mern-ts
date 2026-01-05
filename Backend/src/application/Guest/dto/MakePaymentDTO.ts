export interface MakePaymentDTO {
  prescriptionId: string;
  addressId: string;
  paymentMethod: string;
  userId?: string;
}
