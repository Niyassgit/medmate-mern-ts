import { FeedDTO } from "../dto/FeedDTO";

export interface IGetFeedUseCase {
    execute(userId: string, page: number, limit: number): Promise<FeedDTO[]>
}