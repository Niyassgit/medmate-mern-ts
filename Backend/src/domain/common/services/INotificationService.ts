export interface INotificationService{
    sendEmail(to:string,subject:string,body:string):Promise<void>;
}