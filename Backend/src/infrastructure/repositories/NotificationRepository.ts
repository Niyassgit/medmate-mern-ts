import { Notification, Prisma } from "@prisma/client";
import { INotification } from "../../domain/notification/entities/INotification";
import { INotificationRepository } from "../../domain/notification/repositories/INotificationService";
import { BaseRepository } from "../database/BaseRepository";
import { NotificationType, Role } from "../../shared/Enums";
import { prisma } from "../config/db";
import { NotificationMapper } from "../mappers/NotificationMapper";
import { INotificationWithUser } from "../../domain/notification/entities/INotificationWithUser";
import tr from "zod/v4/locales/tr.cjs";

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
    senderUserId: string,
    senderRole: Role,
    receiverUserId: string,
    receiverRole: Role,
    type: NotificationType,
    content: string,
    postId?: string
  ): Promise<INotification> {
    const domainEntity: Omit<INotification, "id" | "createdAt" | "updatedAt"> =
      {
        senderUserId,
        senderRole,
        receiverUserId,
        receiverRole,
        type,
        content,
        isRead: false,
        postId,
      };

    const mappedData = NotificationMapper.toPersistance(domainEntity);
    const result = await this.create(mappedData);
    return result;
  }

  async deleteConnectionNotificationById(
    senderId: string,
    receiverId: string
  ): Promise<string | null> {
    const notification = await prisma.notification.findFirst({
      where: {
        senderId,
        receiverId,
        type: NotificationType.CONNECTION_REQUEST,
      },
      select: { id: true },
    });
    if (!notification) return null;
    await this.delete(notification.id);
    return notification.id;
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

  async deleteLikeNotification(
    senderId: string,
    receiverId: string,
    postId: string
  ): Promise<string | null> {
    const notification = await prisma.notification.findFirst({
      where: { senderId, receiverId, postId },
      select: { id: true },
    });
    if (!notification) return null;
    await this.delete(notification.id);
    return notification.id;
  }

  async findNotificationById(
    id: string
  ): Promise<INotificationWithUser | null> {
    const result = await prisma.notification.findFirst({
      where: { id },
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
    return result ? NotificationMapper.toDomainWithUser(result) : null;
  }

  async markAllNotificationAsRead(userId: string): Promise<boolean> {
    const result = await prisma.notification.updateMany({
      where: { receiverId: userId },
      data: { isRead: true },
    });
    return result.count > 0;
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const result = await prisma.notification.updateMany({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return result.count > 0;
  }

  async getCountOfUnreadNotification(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { receiverId: userId, isRead: false },
    });
  }
  async findNotificationOfConnectionByIds(
    senderId: string,
    receiverId: string
  ): Promise<string | null> {
    const result=await prisma.notification.findFirst({
      where:{senderId,receiverId,type:NotificationType.CONNECTION_REQUEST},
      select:{id:true},
    });
    return result?result.id:null;
  }
}
