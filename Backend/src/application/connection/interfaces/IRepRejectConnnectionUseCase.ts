export interface IRepRejectConnectionUseCase{
    execute(doctoId:string,notificationId:string,userId?:string):Promise<string>;
}