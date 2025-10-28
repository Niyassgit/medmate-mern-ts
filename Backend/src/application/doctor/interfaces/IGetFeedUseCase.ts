import { FeedDTO } from "../dto/FeedDTO";

export interface IGetFeedUseCase{
    execute(userId:string):Promise<FeedDTO[]>
}