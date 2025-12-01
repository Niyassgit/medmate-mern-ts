import { SubscriptionsDTO } from "../dto/SubscriptionDTO";

export interface IGetAllSubscriptionsUseCase{
    execute(userId?:string):Promise<SubscriptionsDTO[]>;
}