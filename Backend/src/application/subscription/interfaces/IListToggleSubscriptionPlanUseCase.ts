import { SubscriptionDTO } from "../dto/SubscriptionDTO";

export interface IListToggleSubscriptionPlanUseCase{
    execute(subscriptionId:string,userId?:string):Promise<string>;
}