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
      useCases: data.useCase,
      ingredients: data.ingredients,
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
      useCase: data.useCases,
      ingredients: data.ingredients,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
