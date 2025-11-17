import { Notification, Prisma, User } from "@prisma/client";
import { INotification } from "../../domain/notification/entities/INotification";
import { Role as DomainRole} from "../../shared/Enums";
import { NotificationType as DomainNotificationType } from "../../shared/Enums";
import { INotificationWithUser } from "../../domain/notification/entities/INotificationWithUser";

export class NotificationMapper {
  static toDomain(persistance: Notification): INotification {
    return {
      id: persistance.id,
      senderId: persistance.senderId,
      senderRole: persistance.senderRole as DomainRole,
      receiverId: persistance.receiverId,
      receiverRole: persistance.receiverRole as DomainRole,
      content: persistance.content,
      isRead: persistance.isRead,
      type: persistance.type as DomainNotificationType,
      createdAt: persistance.createdAt,
    };
  }
  static toPersistance(
    domain: Omit<INotification, "id" | "createdAt" | "updatedAt">
  ): Prisma.NotificationCreateInput {
    return {
      sender: { connect: { id: domain.senderId } },
      senderRole: domain.senderRole,
      receiver: { connect: { id: domain.receiverId } },
      receiverRole: domain.receiverRole,
      content: domain.content,
      type: domain.type,
      isRead: domain.isRead,
    };
  }

  static toDomainWithUser(
     p: Notification & {
    sender: {
      id: string;
      profileImage: string | null;
      doctor: { name: string ,id:string} | null;
      medicalRep: { name: string ,id:string} | null;
    };
  }
  ): INotificationWithUser {
    return{
        id:p.id,
        content:p.content,
        type:p.type as DomainNotificationType,
        isRead:p.isRead,
        createdAt:p.createdAt,
        RoleId:p.sender.doctor?.id ?? p.sender.medicalRep?.id ?? "unKnown",
        user:{
            id:p.sender.id,
            profileImage:p.sender.profileImage,
            name:p.sender.doctor?.name ?? p.sender.medicalRep?.name ?? "unknown",
        }
    }
  }
}
