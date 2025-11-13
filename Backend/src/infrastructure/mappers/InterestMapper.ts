import { Prisma,Interest } from "@prisma/client";
import { IInterest } from "../../domain/Interest/entities/IInterest";


export class IntersetMapper{
    static toPersistance(entity:{doctorId:string,productId:string}):Prisma.InterestCreateInput{
        return{
            doctor:{connect:{id:entity.doctorId}},
            product:{connect:{id:entity.productId}}
        }
    }
    static toDomain(p:Interest):IInterest{
        return{
            id:p.id,
            doctorId:p.doctorId,
             productId:p.productId,
            createdAt:p.createdAt,
           
        }
    }
}