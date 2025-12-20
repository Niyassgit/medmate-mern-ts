import { Prisma, Commission } from "@prisma/client";
import { ICommission } from "../../domain/Commission/entities/ICommission";
import { ICommissionRepository } from "../../domain/Commission/repositories/ICommissionRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../config/db";
import { CommissionMapper } from "../mappers/CommissionMapper";

export class CommissionRepository
  extends BaseRepository<
    ICommission,
    Commission,
    Prisma.CommissionCreateManyInput,
    "commission"
  >
  implements ICommissionRepository {
  constructor() {
    super(prisma.commission, (c) => CommissionMapper.toDomain(c));
  }

  async createCommission(
    data: Omit<ICommission, "id" | "createdAt" | "updatedAt">[]
  ): Promise<void> {
    const mapped = data.map((comm) => CommissionMapper.toPersistance(comm));
    await prisma.commission.createMany({ data: mapped });
  }

  async findCommission(commissionId: string): Promise<ICommission | null> {
    const result = await this.findById(commissionId);
    return result ?? null;
  }
}
