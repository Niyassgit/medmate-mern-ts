import { NotificationUserDTO } from "./NotificationUserDTO";

export interface NotificationsResponseDTO{
    id:string;
    content:string;
    createdAt:Date;
    isRead:boolean,
    type:string;
    roleId:string;
    isConnected:boolean;
    user:NotificationUserDTO
}
