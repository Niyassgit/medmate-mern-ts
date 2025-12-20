import { ICommission } from "../entities/ICommission";

export interface ICommissionRepository {
  createCommission(
    data: Omit<ICommission, "id" | "createdAt" | "updatedAt">[]
  ): Promise<void>;
  findCommission(commissionId: string): Promise<ICommission | null>;
}
