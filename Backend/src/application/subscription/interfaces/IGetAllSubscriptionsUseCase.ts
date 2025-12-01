import { SubscriptionsDTO } from "../dto/SubscriptionsDTO";

export interface IGetAllSubscriptionsUseCase{
    execute(userId?:string):Promise<SubscriptionsDTO[]>;
}