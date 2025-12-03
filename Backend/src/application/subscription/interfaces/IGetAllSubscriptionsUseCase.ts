import { SubscriptionDTO } from "../dto/SubscriptionDTO";

export interface IGetAllSubscriptionsUseCase{
    execute(userId?:string):Promise<SubscriptionDTO[]>;
}