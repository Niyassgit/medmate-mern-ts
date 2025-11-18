import { NotificationType, Role } from "../../../shared/Enums";

export interface INotification {
  id: string;
  senderUserId: string;
  senderRole: Role;
  receiverUserId: string;
  receiverRole: Role;
  type: NotificationType;
  content: string;
  isRead: boolean;
  postId?:string;
  createdAt: Date;
}
