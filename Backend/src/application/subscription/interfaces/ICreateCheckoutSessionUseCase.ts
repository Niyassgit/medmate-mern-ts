export interface ICreateCheckoutSessionUseCase{
    execute(userId:string,planId:string):Promise<string>;
}