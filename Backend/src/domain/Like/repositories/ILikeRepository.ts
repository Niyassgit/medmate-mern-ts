import { ILike } from "../entities/ILike";

export interface ILikeRepository{
    toggleLike(postId:string,doctorId:string):Promise<{liked:boolean,like?:ILike}>;
    getLikeCount(postId:string):Promise<number>;
    getProductIdsByDoctor(doctorId:string):Promise<string[]>;
    
}