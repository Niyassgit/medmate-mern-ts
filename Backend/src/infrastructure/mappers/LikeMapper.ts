import { Like, Prisma } from "@prisma/client";
import { ILike } from "../../domain/Like/entities/ILike";


export class LikeMapper{
    static toPersistance(data:{doctorId:string;productId:string}):Prisma.LikeCreateInput{
        return{
            doctor:{connect:{id:data.doctorId}},
            product:{connect:{id:data.productId}}
        }
    }
    static toDomain(p:Like):ILike{
        return{
            id:p.id,
            doctorId:p.doctorId,
            productId:p.productId,
            createdAt:p.createdAt,
        }
    }
}