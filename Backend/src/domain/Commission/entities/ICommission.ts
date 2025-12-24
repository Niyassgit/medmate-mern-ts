import { CommissionStatus } from "../../../shared/Enums";

export interface ICommission {
  id: string;
  orderId: string;
  productId: string;
  doctorId: string;

  mrp: number;
  ptr: number;
  adminCut: number;
  doctorCut: number;

  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
}
