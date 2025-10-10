import { IProductPost } from "../../domain/product/entity/IProductPost";
import { IProductPostRepository } from "../../domain/product/repositories/IProductPostRepository";
import { prisma } from "../../config/db";
import { ProductPostMapper } from "../mappers/ProductPostMapper";
import { BaseRepository } from "../database/BaseRepository";
import { Prisma, ProductPost } from "@prisma/client";

export class ProductPostRepository
  extends BaseRepository<IProductPost, ProductPost,Prisma.ProductPostCreateInput, "productPost">
  implements IProductPostRepository
{
  constructor() {
    super(prisma.productPost,(product)=>ProductPostMapper.toDomain(product));
  }

  async createPost(
    userId: string,
    data: Omit<IProductPost, "id" | "createdAt" | "updatedAt">
  ): Promise<IProductPost | null> {
    const formatedData = ProductPostMapper.toPersistance(data, userId);
    return await this.create(formatedData);
  }
  async editPost(
    postId: string,
    data: Partial<IProductPost>
  ): Promise<IProductPost | null> {
    const formatedData = ProductPostMapper.toPartialPersistance(data);
    return this.update(postId, formatedData as Partial<ProductPost>);
  }
  async getProducts(userId: string): Promise<IProductPost[] | null> {
    const products = await this.findAll({
      where: { repId: userId },
      orderBy: { createdAt: "desc" },
    });
    if (!products || products.length === 0) return null;
    return ProductPostMapper.toDomainList(products);
  }
}
