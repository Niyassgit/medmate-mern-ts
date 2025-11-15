import { NotificationsResponseDTO } from "../dto/NotificationsResponseDTO";

export interface IGetRepNotificationsUseCase{
    execute(userId:string):Promise<NotificationsResponseDTO[]>;
}