export interface IRepMessageMarkAsReadUseCase{
    execute(conversationId:string,userId?:string):Promise<void>;
}