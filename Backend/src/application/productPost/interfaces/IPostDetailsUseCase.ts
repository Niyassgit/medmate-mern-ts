import { PostDetailsDTO } from "../dto/PostDetailsDTO";

export interface IGetProductPostDetailsUseCase{
    execute(postId:string):Promise<PostDetailsDTO>;
}