import { NotificationUserDTO } from "./NotificationUserDTO";

export interface NotificationsResponseDTO{
    id:string;
    content:string;
    createdAt:Date;
    isRead:boolean,
    type:string;
    roleId:string;
    user:NotificationUserDTO;
    postId?:string;
    postImage?:string | null;
}
