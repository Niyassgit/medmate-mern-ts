import { Interest, Prisma } from "@prisma/client";
import { IInterest } from "../../domain/Interest/entities/IInterest";
import { IInterestRepository } from "../../domain/Interest/repositories/IInterestRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../config/db";
import { IntersetMapper } from "../mappers/InterestMapper";

export class InterestRepository
  extends BaseRepository<
    IInterest,
    Interest,
    Prisma.InterestCreateInput,
    "interest"
  >
  implements IInterestRepository {
    constructor(){
        super(prisma.interest,(interest)=>IntersetMapper.toDomain(interest));
    }
    async toggleInterest(postId: string, doctorId: string): Promise<{ interested: boolean; interest?: IInterest; }> {
        const existInterest=await prisma.interest.findFirst({
            where:{productId:postId,doctorId},
        });
        if(existInterest){
            await this.delete(existInterest.id);
            return {interested:false};
        }
        const mappedInterest=IntersetMapper.toPersistance({doctorId:doctorId,productId:postId});
        const created=await this.create(mappedInterest);
        return {interested:true,interest:created}
    }
    async getInterestCount(postId: string): Promise<number> {
        const count= await prisma.interest.count({
            where:{productId:postId},
        });
        return count;
    }
  }
