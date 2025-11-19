import { NotificationType, Role } from "../../../shared/Enums";
import { INotification } from "../entities/INotification";
import { INotificationWithUser } from "../entities/INotificationWithUser";

export interface INotificationRepository {
  createNotification(
    senderUserId: string,
    senderRole: Role,
    receiverUserId: string,
    receiverRole: Role,
    type: NotificationType,
    content: string,
    postId?: string
  ): Promise<INotification>;
  deleteConnectionNotificationById(
    senderId: string,
    receiverId: string
  ): Promise<string | null>;
  findAllNotifications(userId: string): Promise<INotificationWithUser[]>;
  findNotificationById(id:string):Promise<INotificationWithUser | null>;
  updateNotificationById(
    notificationId: string,
    type: NotificationType
  ): Promise<INotificationWithUser | null>;
  deleteLikeNotification(
    senderId: string,
    receiverId: string,
    postId: string
  ): Promise<string | null>;
  markAllNotificationAsRead(userId:string):Promise<boolean>;
  markNotificationAsRead(notificationId:string):Promise<boolean>;
}
