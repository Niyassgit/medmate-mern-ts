import { LikedResponseDTO } from "../dto/LikedResponseDTO";

export interface IToggleLikeOnPostUseCase{
    execute(postId:string,userId?:string):Promise<LikedResponseDTO>;
}