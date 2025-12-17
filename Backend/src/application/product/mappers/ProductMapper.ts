import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IProduct } from "../../../domain/product/entities/IProduct";
import { ProductDTO } from "../dto/ProdductDTO";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";

export class ProductMapper {
  static async toDomain(
    data: IProduct,
    storageService: IStorageService,
    territoryRepository?: ITerritoryRepository
  ): Promise<ProductDTO> {
    let signedUrls: string[] | null = null;
    if (data.imageUrl && data.imageUrl.length > 0) {
      signedUrls = await Promise.all(
        data.imageUrl.map(storageService.generateSignedUrl)
      );
    }

    let territoryNames: string[] | undefined;
    if (territoryRepository && data.territoryIds && data.territoryIds.length > 0) {
      territoryNames = await Promise.all(
        data.territoryIds.map(async (id) => {
          const name = await territoryRepository.getTerritoryName(id);
          return name || "";
        })
      );
      territoryNames = territoryNames.filter((name) => name !== "");
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
      territoryNames,
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
    };
  }
    static toEditEntity(
    dto: ProductDTO,
    repId: string
  ): Omit<IProduct, "id" | "createdAt"> {
    return {
      name: dto.name,
      brand: dto.brand,
      imageUrl: dto.imageUrls || [],
      ingredients: dto.ingredients,
      mrp: dto.mrp,
      ptr: dto.ptr,
      repId: repId,
      territoryIds: dto.territoryIds || [],
      updatedAt:new Date(),
    };
  }
}
