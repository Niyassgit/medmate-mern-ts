import { NotificationType } from "../../../shared/Enums";
import { IUserForNotification } from "../../common/entities/IUserForNotification";

export interface INotificationWithUser {
  id: string;
  content: string;
  isRead: boolean;
  type:NotificationType,
  createdAt: Date;
  RoleId:string;
  user:IUserForNotification
}
