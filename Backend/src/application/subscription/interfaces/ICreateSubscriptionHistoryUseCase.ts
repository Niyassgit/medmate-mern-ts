import { CreateSubHistoryDTO } from "../dto/CreateSubHistoryDTO";

export interface ICreateSubscriptionHistoryUseCase{
    execute(dto:CreateSubHistoryDTO):Promise<void>;
}

