import { InterestResponseDTO } from "../dto/InterestResponseDTO";

export interface IToggleInterestOnPostUseCase{
    exectue(postId:string,userId?:string):Promise<InterestResponseDTO>
}