import { IProductPost } from "../../../domain/product/entity/IProductPost";
import { ProductPostDTO } from "../dto/ProductPostDTO";
import { ProductListDTO } from "../dto/ProductListDTO";

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
}
