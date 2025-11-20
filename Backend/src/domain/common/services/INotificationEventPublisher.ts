import { NotificationUserDTO } from "../../../application/notification/dto/NotificationUserDTO";

export interface INotificationEventPublisher {
  publishNotification(event: {
    id: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    type: string;
    roleId: string;
    user: NotificationUserDTO;
    receiverUserId: string;
    postId?: string;
    postImage?: string | null;
  }): Promise<void>;

  deletePublishedNotification(event: {
    receiverUserId: string;
    notificationId: string;
  }): Promise<void>;

  unreadNotificationCount(event: {
    receiverUserId: string;
    count: number;
  }): Promise<void>;
}
