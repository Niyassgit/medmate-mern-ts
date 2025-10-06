import { IProductPost } from "../../domain/product/entity/IProductPost"
import { Prisma, ProductPost } from "@prisma/client"

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

    static toPartialPersistance(
        domain:Partial<IProductPost>
    ):Prisma.ProductPostUpdateInput{

        const persistence:Prisma.ProductPostUpdateInput={};

        if(domain.title !==undefined)persistence.title=domain.title;
        if(domain.brand !==undefined) persistence.brand =domain.brand;
        if(domain.description !==undefined) persistence.description=domain.description;
        if(domain.imageUrl !==undefined) persistence.imageUrl=domain.imageUrl;
        if(domain.ingredients !== undefined) persistence.ingredients=domain.ingredients;
        if(domain.termsOfUse !==undefined) persistence.termsOfUse=domain.termsOfUse;
        if(domain.useCases !==undefined) persistence.useCases=domain.useCases;

        if(domain.territoryId !==undefined){
            if(domain.territoryId === null){
                persistence.territory={disconnect:true};
            }else{
                persistence.territory={connect:{id:domain.territoryId}};
            }
        }
       
        return persistence;
    }

}