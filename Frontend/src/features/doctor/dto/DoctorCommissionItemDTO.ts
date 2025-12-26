import { CommissionStatus } from "@/types/CommissionStatus";

export interface DoctorCommissionItemDTO {
  commissionId: string;

  orderId: string;
  productName: string;

  mrp: number;
  ptr: number;
  doctorEarning: number;

  status: CommissionStatus;
  earnedAt: Date;
}
