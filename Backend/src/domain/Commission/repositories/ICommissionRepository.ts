import { ICommission } from "../entities/ICommission";
import { ICommissionWithProduct } from "../entities/ICommissionWithProduct";

export interface CommissionCursorResult {
  commissions: ICommissionWithProduct[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ICommissionRepository {
  createCommission(
    data: Omit<ICommission, "id" | "createdAt" | "updatedAt">[]
  ): Promise<void>;
  findCommission(commissionId: string): Promise<ICommission | null>;
  findByDoctorId(doctorId: string, start: Date, endDate: Date): Promise<ICommissionWithProduct[]>;
  findByDoctorIdWithCursor(
    doctorId: string,
    start: Date,
    endDate: Date,
    cursor?: string,
    limit?: number
  ): Promise<CommissionCursorResult>;
}
