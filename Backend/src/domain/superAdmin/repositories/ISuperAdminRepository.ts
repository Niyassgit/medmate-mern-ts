import { ISuperAdmin } from "../entities/ISuperAdmin";

export interface ISuperAdminRepository {
  createSuperAdmin(
    data: Omit<ISuperAdmin, "id" | "createdAt" | "updatedAt">
  ): Promise<ISuperAdmin>;
  getSuperAdminByEmail(email: string): Promise<ISuperAdmin | null>;
}
