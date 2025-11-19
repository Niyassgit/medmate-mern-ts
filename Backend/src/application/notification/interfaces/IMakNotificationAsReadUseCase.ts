export interface IMarkNotificationAsReadUseCase{
    execute(notificationId:string,userId?:string):Promise<void>;
}