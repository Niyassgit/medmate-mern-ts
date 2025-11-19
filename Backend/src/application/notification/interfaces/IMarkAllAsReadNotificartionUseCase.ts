export interface IMakeAllAsReadNotificationUseCase{
    execute(userId:string):Promise<void>;
}