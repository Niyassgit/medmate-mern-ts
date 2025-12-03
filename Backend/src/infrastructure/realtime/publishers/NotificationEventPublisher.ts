import { NotificationUserDTO } from "../../../application/notification/dto/NotificationUserDTO";
import { INotificationEventPublisher } from "../../../domain/common/services/INotificationEventPublisher";
import { io } from "../SocketGateway";

export class NotificationEventPublisher implements INotificationEventPublisher {
  async publishNotification(event: {
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
  }): Promise<void> {
    const room = `user:${event.receiverUserId}`;
    io.to(room).emit("notification:new", {
      id: event.id,
      content: event.content,
      createdAt: event.createdAt,
      isRead: event.isRead,
      type: event.type,
      roleId: event.roleId,
      user: event.user,
      receiverUserId: event.receiverUserId,
      postId: event.postId,
      postImage: event.postImage,
    });
  }
  async deletePublishedNotification(event: {
    receiverUserId: string;
    notificationId: string;
  }): Promise<void> {
    const room = `user:${event.receiverUserId}`;
    io.to(room).emit("notification:deleted", {
      id: event.notificationId,
    });
  }

  async unreadNotificationCount(event: {
    receiverUserId: string;
    count: number;
  }): Promise<void> {
    const room = `user:${event.receiverUserId}`;
    io.to(room).emit("notification:count", event.count);
  }
}
