import { Notification, Prisma } from "@prisma/client";
import { INotification } from "../../domain/notification/entities/INotification";
import { INotificationRepository } from "../../domain/notification/repositories/INotificationService";
import { BaseRepository } from "../database/BaseRepository";
import { NotificationType, Role } from "../../shared/Enums";
import { prisma } from "../config/db";
import { NotificationMapper } from "../mappers/NotificationMapper";
import { INotificationWithUser } from "../../domain/notification/entities/INotificationWithUser";

export class NotificationRepository
  extends BaseRepository<
    INotification,
    Notification,
    Prisma.NotificationCreateInput,
    "notification"
  >
  implements INotificationRepository
{
  constructor() {
    super(prisma.notification, (not) => NotificationMapper.toDomain(not));
  }
  async createNotification(
    senderId: string,
    senderRole: Role,
    receiverId: string,
    receiverRole: Role,
    type: NotificationType,
    content: string
  ): Promise<INotification> {
    const domainEntity: Omit<INotification, "id" | "createdAt" | "updatedAt"> =
      {
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        type,
        content,
        isRead: false,
      };

    const mappedData = NotificationMapper.toPersistance(domainEntity);
    const result = await this.create(mappedData);
    return result;
  }
  async deleteConnectionNotificationById(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    await prisma.notification.deleteMany({
      where: {
        senderId,
        receiverId,
        type: NotificationType.CONNECTION_REQUEST,
      },
    });
  }
  async findAllNotifications(userId: string): Promise<INotificationWithUser[]> {
    const result = await prisma.notification.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: {
            id: true,
            profileImage: true,
            doctor: { select: { name: true, id: true } },
            medicalRep: { select: { name: true, id: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return result.map(NotificationMapper.toDomainWithUser);
  }

  async updateNotificationById(
    notificationId: string,
    type: NotificationType
  ): Promise<INotificationWithUser | null> {
    const result = await prisma.notification.update({
      where: { id: notificationId },
      data: { type },
      include: {
        sender: {
          select: {
            id: true,
            profileImage: true,
            doctor: { select: { name: true, id: true } },
            medicalRep: { select: { name: true, id: true } },
          },
        },
      },
    });

    return NotificationMapper.toDomainWithUser(result);
  }
}
