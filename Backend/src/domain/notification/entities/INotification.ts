import { NotificationType, Role } from "../../../shared/Enums";

export interface INotification {
  id: string;
  senderId: string;
  senderRole: Role;
  receiverId: string;
  receiverRole: Role;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
