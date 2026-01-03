import { Prisma, Product } from "@prisma/client";
import { IProduct } from "../../domain/product/entities/IProduct";

export class ProductMapper {
  static toPersistance(
    data: Omit<IProduct, "id" | "createdAt" | "updatedAt">
  ): Prisma.ProductCreateInput {
    return {
      name: data.name,
      brand: data.brand,
      mrp: data.mrp,
      ptr: data.ptr,
      rep: { connect: { id: data.repId } },
      imageUrl: data.imageUrl,
      territoryIds: data.territoryIds || [],
      ingredients: data.ingredients,
    };
  }

  static toUpdatePersistance(
    data: Omit<IProduct, "id" | "createdAt">
  ): Prisma.ProductUpdateInput {
    return {
      name: data.name,
      brand: data.brand,
      mrp: data.mrp,
      ptr: data.ptr,
      imageUrl: data.imageUrl,
      territoryIds: data.territoryIds || [],
      ingredients: data.ingredients,
      updatedAt: new Date(),
    };
  }

  static toDomain(data: Product): IProduct {
    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      mrp: data.mrp,
      ptr: data.ptr,
      repId: data.repId,
      imageUrl: data.imageUrl,
      territoryIds: data.territoryIds || [],
      ingredients: data.ingredients,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
