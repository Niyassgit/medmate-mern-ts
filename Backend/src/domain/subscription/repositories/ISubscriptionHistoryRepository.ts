import { ISubscriptionHistory } from "../entities/ISubscriptionHistory";

export interface ISubscriptionHistoryRepository{
    createHistory(data:Omit<ISubscriptionHistory,"id">):Promise<ISubscriptionHistory>;
    findHistoryById(SubHisId:string):Promise<ISubscriptionHistory | null>;
    findHistoriesByRepId(repId:string):Promise<ISubscriptionHistory[] | null>;
    findAllPlans():Promise<ISubscriptionHistory[]>;
}

