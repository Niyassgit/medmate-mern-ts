import { IProductPost } from "../../../domain/product/entity/IProductPost";
import { ProductPostDTO } from "../dto/ProductPostDTO";

export class ProductPostMapper{
    static toProductPostEntity(
    dto:ProductPostDTO
    ):Omit<IProductPost,"id" | "createdAt" | "updatedAt" > {
       return{
        brand:dto.brand,
        description:dto.description,
        imageUrl:dto.imageUrl ?? [],
        ingredients:dto.ingredients,
        title:dto.title,
        termsOfUse:dto.termsOfUse ??[],
        useCases:dto.useCases ?? [],
        territoryId:dto.territoryId ?? null,
        repId:dto.repId
       }
    }
}