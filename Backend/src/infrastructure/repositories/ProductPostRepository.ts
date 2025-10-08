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
    async editPost(postId:string,data: Partial<IProductPost>): Promise<IProductPost | null> {
       const formatedData=ProductPostMapper.toPartialPersistance(data);
      const updatedPost= await prisma.productPost.update({
         where:{id:postId},
         data:formatedData
       });
       return updatedPost;
    }
    async getProducts(userId: string): Promise<IProductPost[] | null> {
     const products=await prisma.productPost.findMany({
        where:{repId:userId},
        orderBy:{createdAt:"desc"}
      });
      if(!products) return null;
      return ProductPostMapper.toDomainList(products);
    }
}