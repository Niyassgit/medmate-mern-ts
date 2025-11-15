import { NotificationType, Role } from "../../../shared/Enums";
import { INotification} from "../entities/INotification";
import { INotificationWithUser } from "../entities/INotificationWithUser";

export interface INotificationRepository {
  createNotification(
    senderId: string,
    senderRole:Role,
    receiverId: string,
    receiverRole: Role,
    type: NotificationType,
    content: string
  ): Promise<INotification>;
  deleteConnectionNotificationById(senderId: string, receiverId: string): Promise<void>;
  findAllNotifications(userId:string):Promise<INotificationWithUser[]>;
}
