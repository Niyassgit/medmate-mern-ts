import { PostDetailsResponseDTO } from "../dto/PostDetailsResponseDTO";

export interface IPostDetailsUseCase{
    execute(postId:string,userId?:string):Promise<PostDetailsResponseDTO>
}