import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IProduct } from "../../../domain/product/entities/IProduct";
import { ProductDTO } from "../dto/ProdductDTO";

export class ProductMapper {
  static async toDomain(
    data: IProduct,
    storageService: IStorageService
  ): Promise<ProductDTO> {
    let signedUrls: string[] | null = null;
    if (data.imageUrl && data.imageUrl.length > 0) {
      signedUrls = await Promise.all(
        data.imageUrl.map(storageService.generateSignedUrl)
      );
    }
    return {
      id: data.id,
      name: data.name,
      brand: data.brand,
      imageUrls: signedUrls,
      ingredients: data.ingredients,
      mrp: data.mrp,
      ptr: data.ptr,
      territoryIds: data.territoryIds || [],
      useCase: data.useCase,
    };
  }

  static toEntity(
    dto: ProductDTO,
    repId: string
  ): Omit<IProduct, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      brand: dto.brand,
      imageUrl: dto.imageUrls || [],
      ingredients: dto.ingredients,
      mrp: dto.mrp,
      ptr: dto.ptr,
      repId: repId,
      territoryIds: dto.territoryIds || [],
      useCase: dto.useCase,
    };
  }
}
