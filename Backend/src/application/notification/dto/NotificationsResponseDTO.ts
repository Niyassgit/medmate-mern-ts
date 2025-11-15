import { NotificationUserDTO } from "./NotificationUserDTO";

export interface NotificationsResponseDTO{
    id:string;
    content:string;
    createdAt:Date;
    isRead:boolean,
    type:string;
    user:NotificationUserDTO
}
