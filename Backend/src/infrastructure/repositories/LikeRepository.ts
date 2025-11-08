import { Like, Prisma } from "@prisma/client";
import { ILike } from "../../domain/Like/entities/ILike";
import { ILikeRepository } from "../../domain/Like/repositories/ILikeRepository";
import { BaseRepository } from "../database/BaseRepository";
import { prisma } from "../database/prisma";
import { LikeMapper } from "../mappers/LikeMapper";

export class LikeRepository
  extends BaseRepository<ILike, Like, Prisma.LikeCreateInput, "like">
  implements ILikeRepository {
    constructor(){
        super(prisma.like,(like)=>LikeMapper.toDomain(like));
    }
    
  async toggleLike(postId: string, doctorId: string): Promise<{ liked: boolean; like?: ILike; }> {
      const existingLike=await prisma.like.findFirst({
            where:{productId:postId,doctorId},
        });
        if(existingLike){
          await this.delete(existingLike.id);
            return {liked:false};
        }
        const createdData=LikeMapper.toPersistance({doctorId:doctorId,productId:postId});
        const created=await this.create(createdData);
        return {liked:true,like:created};
  }
  async getLikeCount(postId: string): Promise<number> {
      const count=await prisma.like.count({
        where:{productId:postId},
      });
      return count;
  }
  }
