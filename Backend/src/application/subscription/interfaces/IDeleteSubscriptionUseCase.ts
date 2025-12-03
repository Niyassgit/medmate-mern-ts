export interface IDeleteSubscriptionUseCase{
    execute(subscriptionId:string,userId?:string):Promise<string>;
}