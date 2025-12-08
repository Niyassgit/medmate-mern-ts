import { Prisma, Product } from "@prisma/client";
import { IProduct } from "../../domain/product/entities/IProduct";
import { IProductRepositories } from "../../domain/product/repositories/IProductRepository";
import { BaseRepository } from "../database/BaseRepository";
import { ProductMapper } from "../mappers/ProductMapper";
import { prisma } from "../database/prisma";

export class ProductRepository
  extends BaseRepository<
    IProduct,
    Product,
    Prisma.ProductCreateInput,
    "product"
  >
  implements IProductRepositories
{
  constructor() {
    super(prisma.product, (prd) => ProductMapper.toDomain(prd));
  }
  async createProduct(
    data: Omit<IProduct, "id" | "createdAt" | "updatedAt">
  ): Promise<IProduct> {
    const mappedData = ProductMapper.toPersistance(data);
    return this.create(mappedData);
  }

  async getAllProductsByRepId(repId: string): Promise<IProduct[]> {
    const result = await prisma.product.findMany({
      where: { repId },
    });
    return result.map((prd) => ProductMapper.toDomain(prd));
  }
}
