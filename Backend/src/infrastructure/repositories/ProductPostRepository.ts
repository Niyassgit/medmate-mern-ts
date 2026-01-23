import { IProductPost } from "../../domain/productPost/entity/IProductPost";
import { IProductPostRepository } from "../../domain/productPost/repositories/IProductPostRepository";
import { prisma } from "../config/db";
import { ProductPostMapper } from "../mappers/ProductPostMapper";
import { BaseRepository } from "../database/BaseRepository";
import { Prisma, ProductPost } from "@prisma/client";
import { IProductPostForFeed } from "../../domain/productPost/entity/IProductPostForFeed";
import { IMedicalRepWithUser } from "../../domain/medicalRep/entities/IMedicalRepWithUser";
import { MedicalRepWithUserMapper } from "../mappers/MedicalRepWithUserMapper";
import { ProductPostListStatus } from "../../shared/Enums";

export class ProductPostRepository
  extends BaseRepository<
    IProductPost,
    ProductPost,
    Prisma.ProductPostCreateInput,
    "productPost"
  >
  implements IProductPostRepository {
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

  async getProducts(
    repId: string,
    status: ProductPostListStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: IProductPostForFeed[]; total: number } | null> {
    const where: Prisma.ProductPostWhereInput = {
      repId,
    };
    if (status === ProductPostListStatus.PUBLISHED) {
      where.isArchived = false;
    }
    if (status === ProductPostListStatus.ARCHIVE) {
      where.isArchived = true;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.productPost.findMany({
        where,
        include: {
          rep: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              interests: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.productPost.count({ where }),
    ]);

    if (!products || products.length === 0) return { data: [], total: 0 };
    return { data: ProductPostMapper.toFeedList(products), total };
  }
  async getPostDetails(postId: string): Promise<IProductPost | null> {
    const product = await this.findById(postId);
    return product ? product : null;
  }
  async getPostsByIds(
    repIds: string[],
    excludedIds: string[]
  ): Promise<IProductPostForFeed[]> {
    const posts = await prisma.productPost.findMany({
      where: {
        repId: {
          in: repIds,
        },
        id: { notIn: excludedIds },
      },
      include: {
        rep: {
          select: {
            id: true,
            name: true,
            companyName: true,
            subscriptionStatus: true,
            subscriptionStart: true,
            subscriptionEnd: true,
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

  async unArchive(postId: string): Promise<boolean> {
    const res = await prisma.productPost.update({
      where: { id: postId },
      data: { isArchived: false },
    });
    return !!res;
  }
  async DeletePost(postId: string): Promise<boolean> {
    await prisma.like.deleteMany({
      where: { productId: postId },
    });
    await prisma.interest.deleteMany({
      where: { productId: postId },
    });
    await prisma.productPost.delete({
      where: { id: postId },
    });
    return true;
  }
  async findRepByPostId(postId: string): Promise<IMedicalRepWithUser | null> {
    const post = await prisma.productPost.findFirst({
      where: { id: postId },
      include: {
        rep: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!post?.rep) return null;
    return MedicalRepWithUserMapper.toDomain(post.rep);
  }
  async findPostsByRepId(repId: string): Promise<IProductPostForFeed[] | null> {
    const posts = await prisma.productPost.findMany({
      where: { repId },
      include: {
        rep: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            interests: true,
            likes: true,
          },
        },
      },
    });
    if (!posts) return null;
    return ProductPostMapper.toFeedList(posts);
  }
  async findRepIdByPostId(postId: string): Promise<{ repId: string | null }> {
    const result = await prisma.productPost.findFirst({
      where: { id: postId },
      select: { repId: true },
    });
    return { repId: result ? result.repId : null };
  }

  async findPostInADay(repId: string): Promise<IProductPost[]> {
    const day = new Date();
    const posts = await prisma.productPost.findMany({
      where: { repId, createdAt: day },
    });
    return ProductPostMapper.toDomainList(posts);
  }

  async countTotalPosts(): Promise<number> {
    const count = await prisma.productPost.count({
      where: { isArchived: false },
    });
    return count;
  }
}
