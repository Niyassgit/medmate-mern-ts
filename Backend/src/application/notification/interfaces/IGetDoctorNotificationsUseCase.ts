import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";

export interface IGetDoctorNotificationsUseCase{
    execute(userId:string):Promise<NotificationsResponseDTO[]>;
}