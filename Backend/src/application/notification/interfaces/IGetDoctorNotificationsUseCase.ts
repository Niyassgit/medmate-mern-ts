import { NotificationFullResponseDTO } from "../dto/NotificaionFullResponseDTO";

export interface IGetDoctorNotificationsUseCase{
    execute(userId:string,cursor?:string,limit?:number):Promise<NotificationFullResponseDTO>;
}