import { SubscribedListResponse } from "../dto/SubscribedListDTO";

export interface IGetSubscribedListUseCase {
  execute(
    userId?: string,
    page?: number,
    limit?: number
  ): Promise<SubscribedListResponse>;
}

