import { Commission, Prisma, Product } from "@prisma/client";
import { ICommission } from "../../domain/commission/entities/ICommission";
import { ICommissionWithProduct } from "../../domain/commission/entities/ICommissionWithProduct";
import { CommissionStatus } from "../../shared/Enums";
import { ProductMapper } from "./ProductMapper";

export class CommissionMapper {
  static toDomain(data: Commission): ICommission {
    return {
      id: data.id,
      productId: data.productId,
      doctorId: data.doctorId,
      mrp: data.mrp,
      ptr: data.ptr,
      status: data.status as CommissionStatus,
      orderId: data.orderId,
      doctorCut: data.doctorCut,
      adminCut: data.adminCut,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  static toPersistance(
    data: Omit<ICommission, "id" | "createdAt" | "updatedAt">
  ): Prisma.CommissionCreateManyInput {
    return {
      orderId: data.orderId,
      productId: data.productId,
      doctorId: data.doctorId,
      mrp: data.mrp,
      ptr: data.ptr,
      adminCut: data.adminCut,
      doctorCut: data.doctorCut,
      status: data.status,
    };
  }

  static toDomainWithProduct(
    data: Commission & { product: Product | null }
  ): ICommissionWithProduct {
    const commission = this.toDomain(data);
    const product = data.product as Product | null;
    return {
      ...commission,
      product: product ? ProductMapper.toDomain(product) : null,
    };
  }
}
