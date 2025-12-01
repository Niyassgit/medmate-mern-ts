import { ISubscription } from "../entities/ISubscription";

export interface ISubscriptionRepositoy{
    findSubscriptionById(subscriptionId:string):Promise<ISubscription | null>;
    getAllSubscriptions():Promise<ISubscription[]>;
    createSubscription(data:Omit<ISubscription,"id" | "createdAt" | "updatedAt">):Promise<ISubscription>;
}