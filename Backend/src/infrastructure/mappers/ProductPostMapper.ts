import { IProductPost } from "../../domain/product/entity/IProductPost";
import { Prisma, ProductPost } from "@prisma/client";
import { ProductPostWithRelations } from "../types/ProductPostWithRelations";
import { IProductPostForFeed } from "../../domain/product/entity/IProductPostForFeed";

export class ProductPostMapper {
  static toPersistance(
    domain: Omit<IProductPost, "id" | "createdAt" | "updatedAt">,
    medicalRepId: string
  ): Prisma.ProductPostCreateInput {
    return {
      title: domain.title,
      brand: domain.brand,
      description: domain.description,
      imageUrl: domain.imageUrl,
      ingredients: domain.ingredients,
      termsOfUse: domain.termsOfUse,
      useCases: domain.useCases,
      rep: {
        connect: { id: medicalRepId },
      },
      ...(domain.territoryId
        ? {
            territory: {
              connect: { id: domain.territoryId },
            },
          }
        : {}),
    };
  }

  static toPartialPersistance(
    domain: Partial<IProductPost>
  ): Prisma.ProductPostUpdateInput {
    const persistence: Prisma.ProductPostUpdateInput = {};

    if (domain.title !== undefined) persistence.title = domain.title;
    if (domain.brand !== undefined) persistence.brand = domain.brand;
    if (domain.description !== undefined)
      persistence.description = domain.description;
    if (domain.imageUrl !== undefined) persistence.imageUrl = domain.imageUrl;
    if (domain.ingredients !== undefined)
      persistence.ingredients = domain.ingredients;
    if (domain.termsOfUse !== undefined)
      persistence.termsOfUse = domain.termsOfUse;
    if (domain.useCases !== undefined) persistence.useCases = domain.useCases;

    if (domain.territoryId !== undefined) {
      if (domain.territoryId === null) {
        persistence.territory = { disconnect: true };
      } else {
        persistence.territory = { connect: { id: domain.territoryId } };
      }
    }
    if (domain.repId !== undefined) {
      persistence.rep = { connect: { id: domain.repId } };
    }
    return persistence;
  }

  static toDomainList(products: ProductPost[]): IProductPost[] {
    return products.map((product) => ({
      id: product.id,
      brand: product.brand,
      description: product.description,
      title: product.title,
      repId: product.repId,
      imageUrl: product.imageUrl,
      ingredients: product.ingredients,
      termsOfUse: product.termsOfUse,
      useCases: product.useCases,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
      territoryId: product.territoryId,
    }));
  }
  static toDomain(product: ProductPost): IProductPost {
    return {
      id: product.id,
      brand: product.brand,
      description: product.description,
      title: product.title,
      repId: product.repId,
      imageUrl: product.imageUrl,
      ingredients: product.ingredients,
      termsOfUse: product.termsOfUse,
      useCases: product.useCases,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
      territoryId: product.territoryId,
    };
  }
  static toFeedList(posts: ProductPostWithRelations[]): IProductPostForFeed[] {
    return posts.map((p) => {

      const isSubscribedRep = 
        p.rep.subscriptionStatus && 
        p.rep.subscriptionEnd && 
        new Date(p.rep.subscriptionEnd) > new Date();
      
      return {
        id: p.id,
        repId: p.repId,
        title: p.title,
        description: p.description,
        imageUrl: p.imageUrl,
        brand: p.brand,
        useCases: p.useCases,
        ingredients: p.ingredients,
        termsOfUse: p.termsOfUse,
        territoryId: p.territoryId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        rep: {
          id: p.rep.id,
          name: p.rep.name,
          company: p.rep.companyName,
          isSubscribedRep: isSubscribedRep,
          image: p.rep.user?.profileImage,
        },
        _count: {
          likes: p._count.likes,
          interests: p._count.interests,
        },
      };
    });
  }
}
