import { IProductPost } from "../../domain/product/entity/IProductPost"
import { ProductPost } from "@prisma/client"

export class ProductPostMapper{
    static toPersistance(
        domain:Omit<IProductPost,"id" | "createdAt" | "updatedAt">,
        medicalRepId:string
    ):Omit<ProductPost, "id" | "createdAt" | "updatedAt"> {
        return{
            title:domain.title,
            brand:domain.brand,
            description:domain.description,
            imageUrl:domain.imageUrl,
            ingredients:domain.ingredients,
            termsOfUse:domain.termsOfUse,
            territoryId:domain.territoryId ?? null,
            useCases:domain.useCases,
            repId:medicalRepId      
        }
    }

}