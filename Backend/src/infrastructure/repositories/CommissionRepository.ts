import { Prisma, Commission, Product } from "@prisma/client";
import { ICommission } from "../../domain/commission/entities/ICommission";
import { ICommissionWithProduct } from "../../domain/commission/entities/ICommissionWithProduct";
import { ICommissionRepository } from "../../domain/commission/repositories/ICommissionRepository";
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
  implements ICommissionRepository
{
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

  async findByDoctorId(
    doctorId: string,
    start: Date,
    endDate: Date
  ): Promise<ICommissionWithProduct[]> {
    const result = await prisma.commission.findMany({
      where: {
        doctorId,
        createdAt: {
          gte: start,
          lte: endDate,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return result.map((comm) =>
      CommissionMapper.toDomainWithProduct(
        comm as unknown as Commission & { product: Product | null }
      )
    );
  }

  async findByDoctorIdWithCursor(
    doctorId: string,
    start: Date,
    endDate: Date,
    cursor?: string,
    limit: number = 20
  ): Promise<{
    commissions: ICommissionWithProduct[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const where: Prisma.CommissionWhereInput = {
      doctorId,
      createdAt: cursor
        ? {
            gte: start,
            lte: endDate,
            lt: new Date(cursor),
          }
        : {
            gte: start,
            lte: endDate,
          },
    };

    const result = await prisma.commission.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1,
    });

    const hasMore = result.length > limit;
    const commissions = result.slice(0, limit);

    const mappedCommissions = commissions.map((comm) =>
      CommissionMapper.toDomainWithProduct(
        comm as unknown as Commission & { product: Product | null }
      )
    );

    const nextCursor = hasMore && commissions.length > 0
      ? commissions[commissions.length - 1].createdAt.toISOString()
      : null;

    return {
      commissions: mappedCommissions,
      nextCursor,
      hasMore,
    };
  }
}
