import { IProductPost } from "../../domain/product/entity/IProductPost";
import { IProductPostRepository } from "../../domain/product/repositories/IProductPostRepository";
import { prisma } from "../config/db";
import { ProductPostMapper } from "../mappers/ProductPostMapper";
import { BaseRepository } from "../database/BaseRepository";
import { Prisma, ProductPost } from "@prisma/client";
import { IProductPostForFeed } from "../../domain/product/entity/IProductPostForFeed";
import { IMedicalRepWithUser } from "../../domain/medicalRep/entities/IMedicalRepWithUser";
import { MedicalRepWithUserMapper } from "../mappers/MedicalRepWithUserMapper";

export class ProductPostRepository
  extends BaseRepository<
    IProductPost,
    ProductPost,
    Prisma.ProductPostCreateInput,
    "productPost"
  >
  implements IProductPostRepository
{
  constructor() {
    super(prisma.productPost, (product) => ProductPostMapper.toDomain(product));
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
  async findPostById(postId: string): Promise<IProductPost | null> {
    const post = await this.findById(postId);
    return post ? post : null;
  }
  async getProducts(userId: string): Promise<IProductPostForFeed[] | null> {
    const products = await prisma.productPost.findMany({
      where: { repId: userId, isArchived: false },
       include:{
        rep:{
          include:{
            user:true
          }
        },
        _count:{
          select:{
            interests:true,
            likes:true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    if (!products || products.length === 0) return null;
    return ProductPostMapper.toFeedList(products);
  }
  async getPostDetails(postId: string): Promise<IProductPost | null> {
    const product = await this.findById(postId);
    return product ? product : null;
  }
  async getPostsByIds(repIds: string[]): Promise<IProductPostForFeed[]> {
    const posts = await prisma.productPost.findMany({
      where: {
        repId: {
          in: repIds,
        },
      },
      include: {
        rep: {
          select: {
            id: true,
            name: true,
            companyName: true,
            user: {
              select: { profileImage: true },
            },
          },
        },
        _count: {
          select: {
            interests: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return ProductPostMapper.toFeedList(posts);
  }
  async archivePost(postId: string): Promise<boolean> {
    const res = await prisma.productPost.update({
      where: { id: postId },
      data: { isArchived: true },
    });
    return !!res;
  }
  async DeletePostUseCase(postId: string): Promise<boolean> {
    await prisma.productPost.delete({
      where:{id:postId}
    });
    return true;
  }
  async findRepByPostId(postId: string): Promise<IMedicalRepWithUser | null> {
    const post=await prisma.productPost.findFirst({
      where:{id:postId},
    include:{
      rep:{
        include:{
          user:true,
        }
      },
    }
    });
    if(!post?.rep) return null;
    return MedicalRepWithUserMapper.toDomain(post.rep);
  }
  async findPostsByRepId(repId: string): Promise<IProductPostForFeed[] | null> {
    const posts=await prisma.productPost.findMany({
      where:{repId},
      include:{
        rep:{
          include:{
            user:true
          }
        },
        _count:{
          select:{
            interests:true,
            likes:true,
          }
        }
      }
    });
    if(!posts) return null;
    return ProductPostMapper.toFeedList(posts)
  }
}
