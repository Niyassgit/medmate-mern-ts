import { IProductPost } from "../../../domain/product/entity/IProductPost";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { ProductListDTO } from "../dto/ProductListDTO";
import { PostDetailsDTO } from "../dto/PostDetailsDTO";
import { RelatedProductDTO } from "../../doctor/dto/RelatedProductDTO";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IProductPostForFeed } from "../../../domain/product/entity/IProductPostForFeed";

export class ProductPostMapper {
  static toProductPostEntity(
    dto: ProductPostDTO
  ): Omit<IProductPost, "id" | "createdAt" | "updatedAt"> {
    return {
      brand: dto.brand,
      description: dto.description,
      imageUrl: dto.imageUrl,
      ingredients: Array.isArray(dto.ingredients)
        ? dto.ingredients
        : [dto.ingredients],
      title: dto.title,
      termsOfUse: dto.termsOfUse,
      useCases: Array.isArray(dto.useCases) ? dto.useCases : [dto.useCases],
      territoryId: dto.territoryId ?? null,
      repId: dto.repId,
    };
  }

  static toProductList(persistance: IProductPost[]): ProductListDTO[] {
    return persistance.map((product) => ({
      id: product.id,
      image: product.imageUrl?.[0] || "",
      title: product.title,
      date: product.createdAt,
      description: product.description,
    }));
  }

  static async toDomain(
    entity: IProductPost,
    storageService: IStorageService
  ): Promise<PostDetailsDTO> {
    let singedUrls: string[] =[];
    if (entity && entity.imageUrl.length > 0) {
      singedUrls = await Promise.all(
         entity.imageUrl.map((img) =>storageService.generateSignedUrl(img)
      )
      );
     
    }

    return {
      id: entity.id,
      brand: entity.brand,
      description: entity.description,
      imageUrl:singedUrls,
      ingredients: entity.ingredients,
      repId: entity.repId,
      termsOfUse: entity.termsOfUse,
      title: entity.title,
      useCases: entity.useCases,
      territoryId: entity.territoryId ?? "",
      createdAt: entity.createdAt,
    };
  }
  static async toRelatedProductsDomain(
    post: IProductPostForFeed[],
    storageService: IStorageService
  ): Promise<RelatedProductDTO[]> {
    return Promise.all(

      post.map(async (p) => {
        let signedUrl: string | null = null;
        if (p.imageUrl.length > 0) {
          signedUrl = await storageService.generateSignedUrl(p.imageUrl[0]);
        }
        return {
          id: p.id,
          brand: p.brand,
          createdAt: p.createdAt,
          productImage: signedUrl,
          title: p.title,
          likes:p._count.likes ?? 0,
          interests:p._count.isInterested ?? 0,
        };
      })
    );
  }
}
