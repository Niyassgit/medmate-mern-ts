import { IProductPost } from "../../domain/product/entity/IProductPost";
import { IProductPostRepository } from "../../domain/product/repositories/IProductPostRepository";
import { prisma } from "../../config/db";
import { ProductPostMapper } from "../mappers/ProductPostMapper";

export class ProductPostRepository implements IProductPostRepository{

    async createPost(userId: string, data: Omit<IProductPost, "id" | "createdAt" | "updatedAt">): Promise<IProductPost | null> {
        const formatedData=ProductPostMapper.toPersistance(data,userId);
        const product=await prisma.productPost.create({
          data:formatedData
        });
        return product;
    }
}